'use strict';
const { esc } = require('./site');
const img = (f) => '/uploads/' + encodeURIComponent(f);

const page = (title, body) => `<!doctype html><html lang="it"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex"><title>${esc(title)} — Admin</title>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,300..800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/admin.css"></head><body>${body}<script src="/assets/admin.js"></script></body></html>`;

const shell = (active, inner, flash) => `
<aside><div class="logo">Lilanga<small>Admin</small></div>
<a href="/admin" class="${active === 'opere' ? 'on' : ''}">Opere</a>
<a href="/admin/contenuti" class="${active === 'contenuti' ? 'on' : ''}">Contenuti e sicurezza</a>
<a href="/" target="_blank">Vedi il sito ↗</a><a href="/admin/logout" class="lo">Esci</a></aside>
<main>${flash ? `<div class="flash">${esc(flash)}</div>` : ''}${inner}</main>`;

function login(err) {
  const m = err === 'bad' ? 'Password errata.' : err === 'wait' ? 'Troppi tentativi, riprova più tardi.' : '';
  return page('Accesso', `<div class="login"><form method="post" action="/admin/login"><h1>Lilanga <small>Admin</small></h1>
<input type="password" name="password" placeholder="Password amministratore" required autofocus><button>Accedi</button><p class="err">${esc(m)}</p></form></div>`);
}

function dashboard(db, ok) {
  const flash = { creata: 'Opera creata.', eliminata: 'Opera eliminata.' }[ok];
  const rows = db.artworks.slice().sort((a, b) => a.code.localeCompare(b.code)).map((a) => `
<tr><td class="th">${a.front ? `<img src="${img(a.front)}" alt="">` : ''}</td>
<td><b>${esc(a.code)}</b></td><td>${esc(a.title || 'Senza titolo')}</td><td>${esc(a.category)}</td><td>${esc(a.technique)}</td>
<td><span class="pill ${a.published ? 'on' : ''}">${a.published ? 'Pubblicata' : 'Bozza'}</span></td>
<td><a class="btn sm" href="/admin/opere/${a.id}">Modifica</a></td></tr>`).join('');
  return page('Opere', shell('opere', `<div class="bar"><h1>Opere <span>${db.artworks.length}</span></h1><a class="btn" href="/admin/opere/nuova">+ Nuova opera</a></div>
<table><thead><tr><th></th><th>Codice</th><th>Titolo</th><th>Categoria</th><th>Tecnica</th><th>Stato</th><th></th></tr></thead><tbody>${rows || '<tr><td colspan="7">Nessuna opera.</td></tr>'}</tbody></table>`, flash));
}

const field = (label, name, val, ph = '') => `<label>${label}<input name="${name}" value="${esc(val)}" placeholder="${esc(ph)}"></label>`;
const area = (label, name, val, rows = 4, hint = '') => `<label>${label}${hint ? `<em>${hint}</em>` : ''}<textarea name="${name}" rows="${rows}">${esc(val)}</textarea></label>`;
const sel = (label, name, val, opts) => `<label>${label}<select name="${name}">${opts.map(([v, t]) => `<option value="${v}" ${v === val ? 'selected' : ''}>${t}</option>`).join('')}</select></label>`;

function single(label, name, cur) {
  return `<div class="up"><h4>${label}</h4>${cur ? `<div class="cur"><img src="${img(cur)}" alt=""><label class="chk"><input type="checkbox" name="remove_${name}"> Rimuovi</label></div>` : ''}
<input type="file" name="${name}" accept="image/jpeg,image/png,image/webp,image/gif"></div>`;
}
function multi(label, name, cur) {
  return `<div class="up"><h4>${label}</h4>${cur && cur.length ? `<div class="curs">${cur.map((f) => `<div class="cur"><img src="${img(f)}" alt=""><label class="chk"><input type="checkbox" name="remove_${name}" value="${esc(f)}"> Rimuovi</label></div>`).join('')}</div>` : ''}
<input type="file" name="${name}" accept="image/jpeg,image/png,image/webp,image/gif" multiple></div>`;
}

function form(a, isNew, ok) {
  const action = isNew ? '/admin/opere/nuova' : '/admin/opere/' + a.id;
  return page(isNew ? 'Nuova opera' : a.code, shell('opere', `
<div class="bar"><h1>${isNew ? 'Nuova opera' : esc(a.code) + ' — ' + esc(a.title || 'Senza titolo')}</h1><a class="btn ghost" href="/admin">← Elenco</a></div>
<form method="post" action="${action}" enctype="multipart/form-data" class="art">
<fieldset><legend>Dati principali</legend><div class="g2">
${field('Codice interno', 'code', a.code, 'LIL-001')}${field('Titolo', 'title', a.title)}
${sel('Categoria', 'category', a.category, [['dipinto', 'Dipinto'], ['scultura', 'Scultura'], ['disegno', 'Disegno'], ['altro', 'Altro']])}${field('Anno', 'year', a.year, 'es. 1992 o anni \'90')}
${field('Tecnica', 'technique', a.technique, 'es. Smalto su pannello')}${field('Dimensioni', 'dimensions', a.dimensions, 'es. 50 × 50 cm')}
</div>${area('Descrizione / note', 'description', a.description, 3)}
${area('Provenienza conosciuta', 'provenance', a.provenance, 3)}
${area('Stato di conservazione', 'conservation', a.conservation, 2)}
<label class="chk big"><input type="checkbox" name="published" ${a.published ? 'checked' : ''}> Pubblicata sul sito</label></fieldset>

<fieldset><legend>Certificato Galerie Rosenfeld</legend><div class="g2">
${sel('Certificato', 'rosenfeld', a.rosenfeld, [['si', 'Presente'], ['richiesta', 'In richiesta'], ['no', 'Non presente']])}${field('Note (numero, data…)', 'rosenfeldNotes', a.rosenfeldNotes)}
</div>${multi('Scansioni / foto del certificato', 'rosenfeldImgs', a.rosenfeldImgs)}</fieldset>

<fieldset><legend>Fotografie</legend><div class="g3">
${single('Fronte', 'front', a.front)}${single('Retro', 'back', a.back)}${single('Firma (primo piano)', 'signature', a.signature)}
</div>${multi('Etichette, timbri, certificati', 'labels', a.labels)}${multi('Fotografie dell\'opera esposta', 'exhibited', a.exhibited)}</fieldset>

<fieldset><legend>Letteratura</legend>
${area('Cataloghi e pubblicazioni', 'catalogues', (a.catalogues || []).join('\n'), 4, 'una voce per riga')}
${area('Esposizioni', 'exhibitions', (a.exhibitions || []).join('\n'), 3, 'una voce per riga')}</fieldset>

<div class="actions"><button class="btn">Salva</button>${isNew ? '' : `<button class="btn danger" formaction="/admin/opere/${a.id}/elimina" formnovalidate data-confirm="Eliminare definitivamente ${esc(a.code)} e le sue foto?">Elimina opera</button>`}</div>
</form>`, ok ? 'Salvato.' : ''));
}

function content(s, ok) {
  const flash = { 1: 'Contenuti salvati.', pw: 'Password cambiata.', pwerr: 'Password non cambiata: controlla quella attuale (nuova: minimo 8 caratteri).' }[ok];
  return page('Contenuti', shell('contenuti', `<div class="bar"><h1>Contenuti e sicurezza</h1></div>
<form method="post" action="/admin/contenuti" class="art">
<fieldset><legend>Accesso al sito</legend>${field('Parola d\'ordine (passphrase)', 'passphrase', s.passphrase)}
<p class="hint">Cambiandola, chi era già entrato dovrà reinserirla. Non è sensibile alle maiuscole.</p></fieldset>
<fieldset><legend>Home</legend>${field('Titolo del sito', 'siteTitle', s.siteTitle)}${field('Sopratitolo', 'heroKicker', s.heroKicker)}${field('Titolo grande', 'heroTitle', s.heroTitle)}${area('Sottotitolo', 'heroSubtitle', s.heroSubtitle, 3)}</fieldset>
<fieldset><legend>Storia della collezione</legend>${field('Titolo sezione', 'collectionTitle', s.collectionTitle)}${area('Testo', 'collectionStory', s.collectionStory, 12, 'paragrafi separati da una riga vuota')}</fieldset>
<fieldset><legend>L'artista</legend>${field('Titolo sezione', 'artistTitle', s.artistTitle)}${area('Biografia', 'artistBio', s.artistBio, 12, 'paragrafi separati da una riga vuota')}${area('Cronologia', 'timeline', s.timeline, 8, 'una riga per voce, formato: anno | testo')}</fieldset>
<fieldset><legend>Piè di pagina</legend>${field('Testo', 'footer', s.footer)}${field('Contatti (opzionale)', 'contact', s.contact)}</fieldset>
<div class="actions"><button class="btn">Salva contenuti</button></div></form>
<form method="post" action="/admin/password" class="art"><fieldset><legend>Password amministratore</legend><div class="g2">
<label>Password attuale<input type="password" name="current" required></label><label>Nuova password<input type="password" name="next" minlength="8" required></label></div>
<div class="actions"><button class="btn ghost">Cambia password</button></div></fieldset></form>`, flash));
}

module.exports = { login, dashboard, form, content };
