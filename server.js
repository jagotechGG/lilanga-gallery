'use strict';
const express = require('express');
const multer = require('multer');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { layout, esc, gatePage, homePage, artworkPage, notFoundPage } = require('./views/site');
const admin = require('./views/admin');
const defaults = require('./defaults');

const PORT = process.env.PORT || 3000;
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, 'data');
const UPLOAD_DIR = path.join(DATA_DIR, 'uploads');
const DB_FILE = path.join(DATA_DIR, 'db.json');
const SECRET_FILE = path.join(DATA_DIR, 'secret.txt');
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

/* ---------- storage ---------- */
function hashPw(pw, salt = crypto.randomBytes(16).toString('hex')) {
  return salt + ':' + crypto.scryptSync(pw, salt, 32).toString('hex');
}
function checkPw(pw, stored) {
  const [salt, h] = String(stored).split(':');
  if (!salt || !h) return false;
  const a = Buffer.from(h, 'hex');
  const b = crypto.scryptSync(pw, salt, 32);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
function loadDb() {
  if (!fs.existsSync(DB_FILE)) {
    const db = defaults.initialDb();
    db.artworks = db.artworks.filter((a) => fs.existsSync(path.join(UPLOAD_DIR, a.front)));
    db.adminHash = hashPw(process.env.ADMIN_PASSWORD || defaults.ADMIN_PASSWORD);
    saveDb(db);
    return db;
  }
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
}
function saveDb(d) {
  const tmp = DB_FILE + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(d, null, 2));
  fs.renameSync(tmp, DB_FILE);
}
let db = loadDb();
if (!fs.existsSync(SECRET_FILE)) fs.writeFileSync(SECRET_FILE, crypto.randomBytes(32).toString('hex'));
const SECRET = fs.readFileSync(SECRET_FILE, 'utf8');

/* ---------- auth tokens ---------- */
const sign = (v) => crypto.createHmac('sha256', SECRET).update(v).digest('hex');
const normPhrase = (s) => String(s || '').trim().toLowerCase().replace(/\s+/g, ' ');
const gateToken = () => sign('gate:' + normPhrase(db.settings.passphrase));
const adminToken = () => sign('admin:' + db.adminHash);
const safeEq = (a, b) => {
  const x = Buffer.from(String(a)), y = Buffer.from(String(b));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
};
function cookies(req) {
  const out = {};
  (req.headers.cookie || '').split(';').forEach((p) => {
    const i = p.indexOf('=');
    if (i > 0) out[p.slice(0, i).trim()] = decodeURIComponent(p.slice(i + 1).trim());
  });
  return out;
}
const hasGate = (req) => { const c = cookies(req).lg; return !!c && safeEq(c, gateToken()); };
const isAdmin = (req) => { const c = cookies(req).la; return !!c && safeEq(c, adminToken()); };
const setCookie = (res, name, val, days) =>
  res.append('Set-Cookie', `${name}=${val}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${days * 86400}${res.req.secure ? '; Secure' : ''}`);

/* simple brute-force limiter */
const attempts = new Map();
function limited(key) {
  const now = Date.now();
  const a = (attempts.get(key) || []).filter((t) => now - t < 10 * 60 * 1000);
  attempts.set(key, a);
  return a.length >= 8;
}
const fail = (key) => attempts.set(key, [...(attempts.get(key) || []), Date.now()]);

/* ---------- uploads ---------- */
const EXT = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp', 'image/gif': '.gif' };
const upload = multer({
  storage: multer.diskStorage({
    destination: UPLOAD_DIR,
    filename: (req, file, cb) => cb(null, crypto.randomBytes(12).toString('hex') + EXT[file.mimetype]),
  }),
  fileFilter: (req, file, cb) => cb(null, !!EXT[file.mimetype]),
  limits: { fileSize: 40 * 1024 * 1024 },
});
const SINGLE = ['front', 'back', 'signature'];
const MULTI = ['labels', 'rosenfeldImgs', 'exhibited'];
const uploadFields = upload.fields([...SINGLE, ...MULTI].map((name) => ({ name, maxCount: name === 'front' || name === 'back' || name === 'signature' ? 1 : 30 })));
const rmFile = (f) => { if (f) fs.unlink(path.join(UPLOAD_DIR, path.basename(f)), () => {}); };
const arr = (v) => (v === undefined ? [] : Array.isArray(v) ? v : [v]);
const lines = (s) => String(s || '').split(/\r?\n/).map((x) => x.trim()).filter(Boolean);

function nextCode() {
  const max = db.artworks.reduce((m, a) => {
    const n = /^LIL-(\d+)$/.exec(a.code);
    return n ? Math.max(m, +n[1]) : m;
  }, 0);
  return 'LIL-' + String(max + 1).padStart(3, '0');
}
function applyArtwork(art, body, files) {
  const t = (k) => String(body[k] || '').trim();
  art.code = t('code') || art.code;
  art.title = t('title');
  art.category = ['dipinto', 'scultura', 'disegno', 'altro'].includes(body.category) ? body.category : 'dipinto';
  art.year = t('year');
  art.technique = t('technique');
  art.dimensions = t('dimensions');
  art.provenance = t('provenance');
  art.rosenfeld = ['si', 'no', 'richiesta'].includes(body.rosenfeld) ? body.rosenfeld : 'no';
  art.rosenfeldNotes = t('rosenfeldNotes');
  art.catalogues = lines(body.catalogues);
  art.exhibitions = lines(body.exhibitions);
  art.conservation = t('conservation');
  art.description = t('description');
  art.published = body.published === 'on';
  for (const f of SINGLE) {
    const up = files[f] && files[f][0];
    if (up) { rmFile(art[f]); art[f] = up.filename; }
    else if (body['remove_' + f] === 'on') { rmFile(art[f]); art[f] = null; }
  }
  for (const f of MULTI) {
    const rm = arr(body['remove_' + f]);
    art[f] = (art[f] || []).filter((x) => { if (rm.includes(x)) { rmFile(x); return false; } return true; });
    (files[f] || []).forEach((u) => art[f].push(u.filename));
  }
}
const blank = () => ({
  id: crypto.randomBytes(6).toString('hex'), code: nextCode(), title: '', category: 'dipinto', year: '', technique: '', dimensions: '',
  provenance: '', rosenfeld: 'no', rosenfeldNotes: '', catalogues: [], exhibitions: [], conservation: '', description: '',
  published: true, front: null, back: null, signature: null, labels: [], rosenfeldImgs: [], exhibited: [],
});

/* ---------- app ---------- */
const app = express();
app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use((req, res, next) => {
  res.set({ 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'same-origin', 'X-Frame-Options': 'DENY' });
  next();
});
app.use('/assets', express.static(path.join(__dirname, 'public'), { maxAge: 0 }));
app.use(express.urlencoded({ extended: false, limit: '1mb' }));

/* gate */
app.get('/gate', (req, res) => {
  if (hasGate(req)) return res.redirect('/');
  res.send(gatePage(db.settings, req.query.err));
});
app.post('/gate', (req, res) => {
  const key = 'g:' + req.ip;
  if (limited(key)) return res.status(429).send(gatePage(db.settings, 'wait'));
  if (safeEq(sign('gate:' + normPhrase(req.body.phrase)), gateToken())) {
    setCookie(res, 'lg', gateToken(), 30);
    return res.redirect('/');
  }
  fail(key);
  res.status(401).send(gatePage(db.settings, 'bad'));
});
app.get('/esci', (req, res) => {
  res.append('Set-Cookie', 'lg=; Path=/; Max-Age=0');
  res.redirect('/gate');
});

/* admin (own login, separate from the gate) */
app.get('/admin/login', (req, res) => res.send(admin.login(req.query.err)));
app.post('/admin/login', (req, res) => {
  const key = 'a:' + req.ip;
  if (limited(key)) return res.status(429).send(admin.login('wait'));
  if (checkPw(String(req.body.password || ''), db.adminHash)) {
    setCookie(res, 'la', adminToken(), 7);
    return res.redirect('/admin');
  }
  fail(key);
  res.status(401).send(admin.login('bad'));
});
app.use('/admin', (req, res, next) => (isAdmin(req) ? next() : res.redirect('/admin/login')));
app.get('/admin/logout', (req, res) => { res.append('Set-Cookie', 'la=; Path=/; Max-Age=0'); res.redirect('/admin/login'); });
app.get('/admin', (req, res) => res.send(admin.dashboard(db, req.query.ok)));
app.get('/admin/opere/nuova', (req, res) => res.send(admin.form(blank(), true)));
app.post('/admin/opere/nuova', uploadFields, (req, res) => {
  const art = blank();
  applyArtwork(art, req.body, req.files || {});
  if (db.artworks.some((a) => a.code === art.code)) art.code = nextCode();
  db.artworks.push(art);
  saveDb(db);
  res.redirect('/admin?ok=creata');
});
app.get('/admin/opere/:id', (req, res) => {
  const art = db.artworks.find((a) => a.id === req.params.id);
  if (!art) return res.redirect('/admin');
  res.send(admin.form(art, false, req.query.ok));
});
app.post('/admin/opere/:id', uploadFields, (req, res) => {
  const art = db.artworks.find((a) => a.id === req.params.id);
  if (!art) return res.redirect('/admin');
  const before = art.code;
  applyArtwork(art, req.body, req.files || {});
  if (db.artworks.some((a) => a !== art && a.code === art.code)) art.code = before;
  saveDb(db);
  res.redirect('/admin/opere/' + art.id + '?ok=1');
});
app.post('/admin/opere/:id/elimina', (req, res) => {
  const art = db.artworks.find((a) => a.id === req.params.id);
  if (art) {
    [art.front, art.back, art.signature, ...art.labels, ...art.rosenfeldImgs, ...art.exhibited].forEach(rmFile);
    db.artworks = db.artworks.filter((a) => a !== art);
    saveDb(db);
  }
  res.redirect('/admin?ok=eliminata');
});
app.get('/admin/contenuti', (req, res) => res.send(admin.content(db.settings, req.query.ok)));
app.post('/admin/contenuti', (req, res) => {
  const s = db.settings;
  for (const k of Object.keys(defaults.initialDb().settings)) if (typeof req.body[k] === 'string') s[k] = req.body[k].trim();
  if (!normPhrase(s.passphrase)) s.passphrase = defaults.initialDb().settings.passphrase;
  saveDb(db);
  res.redirect('/admin/contenuti?ok=1');
});
app.post('/admin/password', (req, res) => {
  if (!checkPw(String(req.body.current || ''), db.adminHash) || String(req.body.next || '').length < 8)
    return res.redirect('/admin/contenuti?ok=pwerr');
  db.adminHash = hashPw(req.body.next);
  saveDb(db);
  setCookie(res, 'la', adminToken(), 7);
  res.redirect('/admin/contenuti?ok=pw');
});

/* uploaded images: only with gate or admin */
app.get('/uploads/:f', (req, res) => {
  if (!hasGate(req) && !isAdmin(req)) return res.status(403).end();
  const p = path.join(UPLOAD_DIR, path.basename(req.params.f));
  if (!fs.existsSync(p)) return res.status(404).end();
  res.set('Cache-Control', 'private, max-age=86400');
  res.sendFile(p);
});

/* protected site */
app.use((req, res, next) => (hasGate(req) || isAdmin(req) ? next() : res.redirect('/gate')));
app.get('/', (req, res) => res.send(homePage(db)));
app.get('/opera/:code', (req, res) => {
  const list = db.artworks.filter((a) => a.published);
  const i = list.findIndex((a) => a.code === req.params.code);
  if (i < 0) return res.status(404).send(notFoundPage(db.settings));
  res.send(artworkPage(db.settings, list[i], list[(i - 1 + list.length) % list.length], list[(i + 1) % list.length]));
});
app.use((req, res) => res.status(404).send(notFoundPage(db.settings)));
app.use((err, req, res, next) => { console.error(err); res.status(500).send('Errore del server'); });

app.listen(PORT, () => {
  console.log(`Lilanga Gallery su http://localhost:${PORT}`);
  console.log(`Admin: http://localhost:${PORT}/admin`);
});
