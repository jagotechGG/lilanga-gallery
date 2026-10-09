'use strict';
const { t: tr, pick, LANGS, LANG_NAMES } = require('../i18n');

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const paras = (s) => String(s || '').split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean).map((p) => `<p>${esc(p).replace(/\n/g, '<br>')}</p>`).join('');
const img = (f) => '/uploads/' + encodeURIComponent(f);
const CATS = ['dipinto', 'scultura', 'disegno', 'altro'];
const PAL = ['red', 'mauve', 'yellow', 'salmon', 'green', 'slate', 'orange', 'cream'];

/* decorative shapes lifted from the vocabulary of Lilanga's panels */
const SHAPES = {
  wave: `<svg viewBox="0 0 160 70"><ellipse cx="80" cy="35" rx="76" ry="30" fill="#7B93A4"/><path d="M20 24c14-8 22 8 36 0s22 8 36 0 22 8 36 0M20 36c14-8 22 8 36 0s22 8 36 0 22 8 36 0M20 48c14-8 22 8 36 0s22 8 36 0 22 8 36 0" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/></svg>`,
  diamond: `<svg viewBox="0 0 120 120"><path d="M60 4 116 60 60 116 4 60Z" fill="#111" stroke="#fff" stroke-width="4"/><ellipse cx="60" cy="60" rx="26" ry="32" fill="#D6202B" stroke="#fff" stroke-width="4"/></svg>`,
  moon: `<svg viewBox="0 0 90 140"><path d="M20 10c50 10 66 60 40 120-12-30-50-40-48-70 2-26 8-40 8-50Z" fill="#7FB07C" stroke="#fff" stroke-width="3"/></svg>`,
  eye: `<svg viewBox="0 0 120 120"><path d="M60 6 114 60 60 114 6 60Z" fill="#F6B91E"/><circle cx="60" cy="60" r="24" fill="#fff" stroke="#D6202B" stroke-width="4"/></svg>`,
  zig: `<svg viewBox="0 0 220 90"><path d="M4 86 28 10 52 86 76 10 100 86 124 10 148 86 172 10 196 86" fill="#E8722A" stroke="#fff" stroke-width="3" stroke-linejoin="round"/></svg>`,
  curl: `<svg viewBox="0 0 120 120"><path d="M14 100c40 14 92-6 86-48-4-30-48-30-46 0 2 16 24 14 20 2" fill="none" stroke="#111" stroke-width="12" stroke-linecap="round"/></svg>`,
  bean: `<svg viewBox="0 0 160 70"><ellipse cx="80" cy="35" rx="76" ry="28" fill="#F6B91E"/><path d="M26 28c20-6 30 6 54 0s34 6 54 0M26 42c20-6 30 6 54 0s34 6 54 0" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/></svg>`,
  house: `<svg viewBox="0 0 120 130"><path d="M6 52 60 4l54 48Z" fill="#111"/><rect x="14" y="52" width="92" height="74" fill="#F5755B"/><rect x="30" y="68" width="22" height="22" fill="#fff" stroke="#F6B91E" stroke-width="3"/><rect x="72" y="68" width="14" height="46" fill="#fff" stroke="#F6B91E" stroke-width="3"/></svg>`,
};
const shape = (name, cls, speed, style = '') =>
  `<div class="shape ${cls}" data-speed="${speed}" style="${style}"><div class="shape-in">${SHAPES[name]}</div></div>`;

function langSwitch(lang) {
  return `<details class="lang"><summary aria-label="${esc(tr(lang, 'lang_label'))}"><span class="globe" aria-hidden="true">◐</span>${lang.toUpperCase()}</summary>
<ul>${LANGS.map((l) => `<li><a href="/lang/${l}" hreflang="${l}" lang="${l}"${l === lang ? ' class="on" aria-current="true"' : ''}><b>${l.toUpperCase()}</b> ${esc(LANG_NAMES[l])}</a></li>`).join('')}</ul></details>`;
}

function head(title, lang = 'it') {
  return `<!doctype html><html lang="${lang}"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>${esc(title)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,300..800&family=Fraunces:ital,opsz,wght@0,9..144,300..700;1,9..144,300..700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/site.css"></head>`;
}
const layout = (title, body, cls, lang) =>
  `${head(title, lang)}<body class="${cls || ''}"><div class="progress"></div>${body}<script src="/assets/site.js"></script></body></html>`;

/* ---------- gate ---------- */
function gatePage(s, err, lang = 'it') {
  const T = (k) => tr(lang, k);
  const msg = err === 'bad' ? T('gate_bad') : err === 'wait' ? T('gate_wait') : '';
  return `${head(s.siteTitle, lang)}<body class="gate">
<div class="gate-lang">${langSwitch(lang)}</div>
<div class="gate-bg">
${shape('wave', 'g1', 0.4)}${shape('diamond', 'g2', 0.7)}${shape('moon', 'g3', 0.5)}${shape('eye', 'g4', 0.8)}${shape('zig', 'g5', 0.3)}${shape('curl', 'g6', 0.6)}${shape('bean', 'g7', 0.5)}${shape('house', 'g8', 0.6)}
</div>
<main class="gate-card">
  <p class="kicker">${esc(pick(s, 'heroKicker', lang))}</p>
  <h1 class="gate-title">Lilanga</h1>
  <p class="gate-sub">${T('gate_sub')}</p>
  <form method="post" action="/gate" autocomplete="off">
    <input type="password" name="phrase" placeholder="${esc(T('gate_ph'))}" required autofocus aria-label="${esc(T('gate_ph'))}">
    <button type="submit">${T('gate_enter')} <span>→</span></button>
  </form>
  <p class="gate-err" role="alert">${esc(msg)}</p>
</main>
<script src="/assets/site.js"></script></body></html>`;
}

/* ---------- home ---------- */
function card(a, i, lang) {
  const col = PAL[i % PAL.length];
  const T = (k) => tr(lang, k);
  const title = pick(a, 'title', lang) || T('untitled');
  return `<a class="card reveal c-${col}" href="/opera/${esc(a.code)}" data-cat="${esc(a.category)}" style="--d:${(i % 3) * 90}ms">
  <div class="card-img">${a.front ? `<img src="${img(a.front)}" alt="${esc(title)}" loading="lazy">` : `<div class="noimg">${T('no_photo')}</div>`}</div>
  <div class="card-meta"><span class="code">${esc(a.code)}</span><h3>${esc(title)}</h3>
  <p>${esc([T('one_' + a.category), pick(a, 'technique', lang)].filter(Boolean).join(' · '))}</p></div></a>`;
}

function homePage(db, lang = 'it') {
  const s = db.settings;
  const T = (k) => tr(lang, k);
  const S = (k) => pick(s, k, lang);
  const works = db.artworks.filter((a) => a.published);
  const cats = CATS.filter((c) => works.some((a) => a.category === c));
  const counts = { total: works.length, paint: works.filter((a) => a.category === 'dipinto').length, other: works.filter((a) => a.category !== 'dipinto').length };
  const tl = S('timeline').split(/\r?\n/).map((l) => l.split('|')).filter((p) => p.length >= 2)
    .map(([y, ...t]) => `<li class="reveal"><span class="y">${esc(y.trim())}</span><p>${esc(t.join('|').trim())}</p></li>`).join('');
  const heroImgs = works.filter((a) => a.front).slice(0, 2);
  const one = `<span>Lilanga</span><i></i><span>Shetani</span><i></i><span>Makonde</span><i></i><span>${T('mq4')}</span><i></i>`;
  const marquee = Array(8).fill(one).join('');

  const body = `
<header class="nav"><a href="#top" class="brand">Lilanga</a>
<nav><a href="#catalogo">${T('nav_catalog')}</a><a href="#collezione" class="hm">${T('nav_collection')}</a><a href="#artista" class="hm">${T('nav_artist')}</a><a href="#autenticita" class="hm">${T('nav_auth')}</a><a href="/esci" class="out hm-s">${T('nav_exit')}</a>${langSwitch(lang)}</nav></header>

<section class="hero" id="top" data-bg="#D6202B">
  <div class="hero-shapes">${shape('wave', 'h1', 0.25)}${shape('diamond', 'h2', 0.5)}${shape('moon', 'h3', 0.35)}${shape('eye', 'h4', 0.6)}${shape('zig', 'h5', 0.2)}${shape('curl', 'h6', 0.45)}${shape('bean', 'h7', 0.3)}</div>
  <div class="hero-in">
    <p class="kicker rise" style="--i:0">${esc(S('heroKicker'))}</p>
    <h1 class="hero-title">${esc(s.heroTitle).split(' ').map((w, i) => `<span class="word"><span class="rise" style="--i:${i + 1}">${w}</span></span>`).join(' ')}</h1>
    <p class="hero-sub rise" style="--i:4">${esc(S('heroSubtitle'))}</p>
    <a href="#catalogo" class="cta rise" style="--i:5">${T('hero_cta')} <span>↓</span></a>
  </div>
  ${heroImgs.map((a, i) => `<a href="/opera/${esc(a.code)}" class="hero-art ha${i}" data-speed="${i ? 0.18 : -0.12}"><img src="${img(a.front)}" alt="${esc(pick(a, 'title', lang))}"></a>`).join('')}
</section>

<div class="marquee" aria-hidden="true"><div class="track">${marquee}${marquee}</div></div>

<section class="catalog" id="catalogo" data-bg="#F7E9B0">
  <div class="wrap">
    <p class="kicker dark reveal">${T('cat_kicker')}</p>
    <h2 class="big reveal">${T('cat_title')}</h2>
    <div class="filters reveal" role="tablist">
      <button class="chip on" data-f="all">${T('all')} <b>${works.length}</b></button>
      ${cats.map((c) => `<button class="chip" data-f="${c}">${T('cat_' + c)} <b>${works.filter((a) => a.category === c).length}</b></button>`).join('')}
    </div>
    <div class="grid">${works.map((a, i) => card(a, i, lang)).join('') || `<p class="empty">${T('empty')}</p>`}</div>
  </div>
</section>

<section class="story" id="collezione" data-bg="#B04A60">
  ${shape('curl', 's1', 0.3)}${shape('bean', 's2', 0.5)}${shape('diamond', 's3', 0.25)}
  <div class="wrap two">
    <div><p class="kicker reveal">${T('kicker_collection')}</p><h2 class="big reveal">${esc(S('collectionTitle'))}</h2>
      <div class="stats">
        <div class="reveal"><b data-count="${counts.total}">0</b><span>${T('st_works')}</span></div>
        <div class="reveal"><b data-count="${counts.paint}">0</b><span>${T('st_paint')}</span></div>
        <div class="reveal"><b data-count="${counts.other}">0</b><span>${T('st_other')}</span></div>
      </div></div>
    <div class="prose reveal">${paras(S('collectionStory'))}</div>
  </div>
</section>

<section class="artist" id="artista" data-bg="#111">
  <div class="wrap two">
    <div class="sticky"><p class="kicker reveal">${T('kicker_bio')}</p><h2 class="big reveal">${esc(S('artistTitle'))}</h2>
      <figure class="portrait reveal"><img src="/media/george-lilanga.jpg" alt="${esc(T('photo_caption'))}" width="500" height="398" loading="lazy"><figcaption>${esc(T('photo_caption'))}</figcaption></figure></div>
    <div><div class="prose light reveal">${paras(S('artistBio'))}</div>
    <ol class="timeline">${tl}</ol></div>
  </div>
</section>

<section class="auth" id="autenticita" data-bg="#7FB07C">
  ${shape('eye', 'a1', 0.35)}${shape('zig', 'a2', 0.2)}
  <div class="wrap two">
    <div><p class="kicker dark reveal">${esc(S('authKicker'))}</p><h2 class="big reveal">${esc(S('authTitle'))}</h2><div class="seal reveal" aria-hidden="true">${SHAPES.diamond}</div></div>
    <div class="prose reveal">${paras(S('authText'))}</div>
  </div>
</section>

<footer class="foot" data-bg="#F6B91E"><div class="wrap"><div class="foot-big">Lilanga</div><p>${esc(S('footer'))}</p>${s.contact ? `<p class="contact">${esc(s.contact)}</p>` : ''}<p><a href="/esci">${T('foot_exit')}</a></p></div></footer>`;
  return layout(s.siteTitle, body, 'home', lang);
}

/* ---------- artwork sheet ---------- */
function gallery(title, files, alt) {
  if (!files || !files.length) return '';
  return `<section class="sheet-sec reveal"><h3>${esc(title)}</h3><div class="thumbs">${files.map((f) => `<button class="zoom" data-src="${img(f)}"><img src="${img(f)}" alt="${esc(alt)}" loading="lazy"></button>`).join('')}</div></section>`;
}
function artworkPage(s, a, prev, next, lang = 'it') {
  const T = (k) => tr(lang, k);
  const P = (o, k) => pick(o, k, lang);
  const title = P(a, 'title') || T('untitled');
  const rows = [
    [T('s_code'), a.code], [T('s_tech'), P(a, 'technique')], [T('s_dim'), a.dimensions], [T('s_year'), P(a, 'year')],
    [T('s_prov'), P(a, 'provenance')], [T('s_cons'), P(a, 'conservation')],
  ].filter((r) => r[1]).map((r) => `<div class="row"><dt>${esc(r[0])}</dt><dd>${esc(r[1])}</dd></div>`).join('');
  const ros = { si: ['ok', T('ros_si')], richiesta: ['wait', T('ros_richiesta')], no: ['no', T('ros_no')] }[a.rosenfeld] || ['no', ''];
  const main = [[T('front'), a.front], [T('back'), a.back]].filter((x) => x[1]);
  const desc = P(a, 'description'), rnotes = P(a, 'rosenfeldNotes');
  const body = `
<header class="nav solid"><a href="/#top" class="brand">Lilanga</a><nav><a href="/#catalogo">${T('back_catalog')}</a><a href="/esci" class="out hm-s">${T('nav_exit')}</a>${langSwitch(lang)}</nav></header>
<main class="sheet">
 <div class="sheet-top">
  <div class="sheet-hero">
    ${a.front ? `<button class="zoom main-img" data-src="${img(a.front)}"><img src="${img(a.front)}" alt="${esc(title)}"></button>` : `<div class="noimg big">${T('no_photo')}</div>`}
    ${main.length > 1 ? `<div class="mini">${main.map((m) => `<button class="zoom" data-src="${img(m[1])}"><img src="${img(m[1])}" alt="${esc(m[0])}"><span>${esc(m[0])}</span></button>`).join('')}</div>` : ''}
  </div>
  <div class="sheet-info">
    <p class="kicker dark rise" style="--i:0">${esc(T('one_' + a.category))} · ${esc(a.code)}</p>
    <h1 class="rise" style="--i:1">${esc(title)}</h1>
    ${desc ? `<div class="lede rise" style="--i:2">${paras(desc)}</div>` : ''}
    <dl class="specs rise" style="--i:3">${rows}</dl>
    <div class="badge ${ros[0]} rise" style="--i:4"><i></i>${esc(ros[1])}</div>
    ${rnotes ? `<p class="small">${esc(rnotes)}</p>` : ''}
  </div>
 </div>
 ${gallery(T('sec_sign'), a.signature ? [a.signature] : [], T('signature'))}
 ${gallery(T('sec_labels'), a.labels, T('label'))}
 ${gallery(T('sec_cert'), a.rosenfeldImgs, T('certificate'))}
 ${a.catalogues && a.catalogues.length ? `<section class="sheet-sec reveal"><h3>${T('sec_cat')}</h3><ul class="plain">${a.catalogues.map((c) => `<li>${esc(c)}</li>`).join('')}</ul></section>` : ''}
 ${a.exhibitions && a.exhibitions.length ? `<section class="sheet-sec reveal"><h3>${T('sec_exh')}</h3><ul class="plain">${a.exhibitions.map((c) => `<li>${esc(c)}</li>`).join('')}</ul></section>` : ''}
 ${gallery(T('sec_shown'), a.exhibited, T('shown'))}
 <nav class="pn reveal"><a href="/opera/${esc(prev.code)}">← ${esc(P(prev, 'title') || prev.code)}</a><a href="/opera/${esc(next.code)}">${esc(P(next, 'title') || next.code)} →</a></nav>
</main>`;
  return layout(`${title} — ${s.siteTitle}`, body, 'detail', lang);
}

const notFoundPage = (s, lang = 'it') => layout('404', `<main class="nf"><h1>404</h1><p>${esc(tr(lang, 'nf_text'))}</p><a class="cta" href="/">${esc(tr(lang, 'nf_back'))}</a></main>`, 'detail', lang);

module.exports = { layout, esc, gatePage, homePage, artworkPage, notFoundPage, head };
