'use strict';
const LANGS = ['it', 'en', 'fr'];

/* Etichette dell'interfaccia */
const UI = {
  it: {
    nav_catalog: 'Catalogo', nav_collection: 'Collezione', nav_auth: 'Autenticità', nav_artist: 'L\'artista', nav_exit: 'Esci',
    back_catalog: '← Catalogo',
    gate_sub: 'Questo archivio è riservato.<br>Inserisci la parola d\'ordine per entrare.',
    gate_ph: 'Parola d\'ordine', gate_enter: 'Entra', gate_bad: 'Parola d\'ordine non corretta.', gate_wait: 'Troppi tentativi. Riprova tra qualche minuto.',
    hero_cta: 'Entra nella collezione', cat_kicker: 'Catalogo', cat_title: 'Le opere', all: 'Tutte',
    cat_dipinto: 'Dipinti', cat_scultura: 'Sculture', cat_disegno: 'Disegni', cat_altro: 'Altro',
    one_dipinto: 'Dipinto', one_scultura: 'Scultura', one_disegno: 'Disegno', one_altro: 'Altro',
    empty: 'Nessuna opera pubblicata al momento.', no_photo: 'Foto non disponibile', untitled: 'Senza titolo',
    kicker_collection: 'Collezione', kicker_bio: 'Biografia',
    st_works: 'opere', st_paint: 'dipinti', st_other: 'sculture e disegni',
    foot_exit: 'Esci dall\'archivio',
    s_code: 'Codice interno', s_tech: 'Tecnica', s_dim: 'Dimensioni', s_year: 'Anno', s_prov: 'Provenienza', s_cons: 'Stato di conservazione',
    ros_si: 'Certificato Galerie Rosenfeld presente', ros_richiesta: 'Certificato Galerie Rosenfeld in richiesta', ros_no: 'Senza certificato Galerie Rosenfeld',
    sec_sign: 'Firma (dettaglio)', sec_labels: 'Etichette, timbri e certificati', sec_cert: 'Certificato Galerie Rosenfeld',
    sec_cat: 'Cataloghi e pubblicazioni', sec_exh: 'Esposizioni', sec_shown: 'L\'opera esposta',
    front: 'Fronte', back: 'Retro', signature: 'Firma', label: 'Etichetta o timbro', certificate: 'Certificato', shown: 'Opera esposta',
    nf_text: 'Questa opera non esiste (o è sparita nel mondo degli shetani).', nf_back: 'Torna al catalogo',
    mq4: 'Colore', close: 'Chiudi', lang_label: 'Lingua',
  },
  en: {
    nav_catalog: 'Catalogue', nav_collection: 'Collection', nav_auth: 'Authenticity', nav_artist: 'The artist', nav_exit: 'Exit',
    back_catalog: '← Catalogue',
    gate_sub: 'This archive is private.<br>Enter the passphrase to come in.',
    gate_ph: 'Passphrase', gate_enter: 'Enter', gate_bad: 'Wrong passphrase.', gate_wait: 'Too many attempts. Please try again in a few minutes.',
    hero_cta: 'Enter the collection', cat_kicker: 'Catalogue', cat_title: 'The works', all: 'All',
    cat_dipinto: 'Paintings', cat_scultura: 'Sculptures', cat_disegno: 'Drawings', cat_altro: 'Other',
    one_dipinto: 'Painting', one_scultura: 'Sculpture', one_disegno: 'Drawing', one_altro: 'Other',
    empty: 'No works published at the moment.', no_photo: 'Photo not available', untitled: 'Untitled',
    kicker_collection: 'Collection', kicker_bio: 'Biography',
    st_works: 'works', st_paint: 'paintings', st_other: 'sculptures and drawings',
    foot_exit: 'Leave the archive',
    s_code: 'Internal code', s_tech: 'Technique', s_dim: 'Dimensions', s_year: 'Year', s_prov: 'Provenance', s_cons: 'Condition',
    ros_si: 'Galerie Rosenfeld certificate available', ros_richiesta: 'Galerie Rosenfeld certificate requested', ros_no: 'No Galerie Rosenfeld certificate',
    sec_sign: 'Signature (detail)', sec_labels: 'Labels, stamps and certificates', sec_cert: 'Galerie Rosenfeld certificate',
    sec_cat: 'Catalogues and publications', sec_exh: 'Exhibitions', sec_shown: 'The work on display',
    front: 'Front', back: 'Back', signature: 'Signature', label: 'Label or stamp', certificate: 'Certificate', shown: 'Work on display',
    nf_text: 'This work does not exist (or has vanished into the world of the shetani).', nf_back: 'Back to the catalogue',
    mq4: 'Colour', close: 'Close', lang_label: 'Language',
  },
  fr: {
    nav_catalog: 'Catalogue', nav_collection: 'Collection', nav_auth: 'Authenticité', nav_artist: 'L\'artiste', nav_exit: 'Quitter',
    back_catalog: '← Catalogue',
    gate_sub: 'Cette archive est privée.<br>Saisissez le mot de passe pour entrer.',
    gate_ph: 'Mot de passe', gate_enter: 'Entrer', gate_bad: 'Mot de passe incorrect.', gate_wait: 'Trop de tentatives. Réessayez dans quelques minutes.',
    hero_cta: 'Entrer dans la collection', cat_kicker: 'Catalogue', cat_title: 'Les œuvres', all: 'Toutes',
    cat_dipinto: 'Peintures', cat_scultura: 'Sculptures', cat_disegno: 'Dessins', cat_altro: 'Autre',
    one_dipinto: 'Peinture', one_scultura: 'Sculpture', one_disegno: 'Dessin', one_altro: 'Autre',
    empty: 'Aucune œuvre publiée pour le moment.', no_photo: 'Photo non disponible', untitled: 'Sans titre',
    kicker_collection: 'Collection', kicker_bio: 'Biographie',
    st_works: 'œuvres', st_paint: 'peintures', st_other: 'sculptures et dessins',
    foot_exit: 'Quitter l\'archive',
    s_code: 'Code interne', s_tech: 'Technique', s_dim: 'Dimensions', s_year: 'Année', s_prov: 'Provenance', s_cons: 'État de conservation',
    ros_si: 'Certificat Galerie Rosenfeld disponible', ros_richiesta: 'Certificat Galerie Rosenfeld demandé', ros_no: 'Sans certificat Galerie Rosenfeld',
    sec_sign: 'Signature (détail)', sec_labels: 'Étiquettes, tampons et certificats', sec_cert: 'Certificat Galerie Rosenfeld',
    sec_cat: 'Catalogues et publications', sec_exh: 'Expositions', sec_shown: 'L\'œuvre exposée',
    front: 'Recto', back: 'Verso', signature: 'Signature', label: 'Étiquette ou tampon', certificate: 'Certificat', shown: 'Œuvre exposée',
    nf_text: 'Cette œuvre n\'existe pas (ou a disparu dans le monde des shetani).', nf_back: 'Retour au catalogue',
    mq4: 'Couleur', close: 'Fermer', lang_label: 'Langue',
  },
};

/* Campi traducibili (suffisso _en / _fr; se vuoto si usa l'italiano) */
const SETTINGS_KEYS = ['heroKicker', 'heroSubtitle', 'collectionTitle', 'collectionStory', 'authKicker', 'authTitle', 'authText', 'artistTitle', 'artistBio', 'timeline', 'footer'];
const ARTWORK_KEYS = ['title', 'year', 'technique', 'provenance', 'conservation', 'description', 'rosenfeldNotes'];

const t = (lang, key) => (UI[lang] && UI[lang][key]) || UI.it[key] || key;
const pick = (obj, key, lang) => (lang !== 'it' && obj[key + '_' + lang]) || obj[key] || '';

function detect(req, cookieLang) {
  if (LANGS.includes(cookieLang)) return cookieLang;
  const h = String(req.headers['accept-language'] || '').toLowerCase();
  for (const part of h.split(',')) {
    const code = part.trim().slice(0, 2);
    if (LANGS.includes(code)) return code;
  }
  return 'it';
}

/* Testi di partenza tradotti */
const SETTINGS_EN = {
  heroKicker: 'Private collection',
  heroSubtitle: 'Spirits, irony and colour: the collection of paintings, sculptures and drawings by one of the masters of contemporary African art.',
  collectionTitle: 'The story of the collection',
  collectionStory: [
    'This collection is the story of an artist in his formative years. While George Lilanga was leaving Makonde sculpture behind to invent a pictorial language of his own, in Dar es Salaam, amid the creative atmosphere of the Nyumba ya Sanaa centre, someone began to gather what came out of his hands: the first drawings, watercolours, hand-printed works and batiks.',
    'Over the years the collection grew to include every form in which Lilanga expressed himself: paintings on canvas and masonite, carved calabashes, wooden sculptures and metal works. Most of the works belong to his early period, before the 1978 Washington exhibition brought him to a wide public, and before contact with the Tingatinga school changed his palette. It is material that is hard to find elsewhere.',
    'For years the collection remained in Germany, in the hands of Christine Rosenfeld, who looked after it and supplied it with Galerie Rosenfeld certificates. Interest from institutions was not lacking: the Linden-Museum in Stuttgart appreciated its value and acquired part of the works, which are now in its holdings. The rest, the larger core, stayed together.',
    'That core is now held by Ivan Anfossi, who acquired it in full, preventing it from being scattered; the story is told in the Authenticity section. Since then the work has been that of an archive: every work has been photographed front and back, signature, labels and stamps included, and catalogued with an internal code.',
    'This website is its showcase. It gathers the works\' records for scholars, collectors and anyone who wants to be swept away by the world of Lilanga, starting from where it all began.',
  ].join('\n\n'),
  authKicker: 'Provenance',
  authTitle: 'Authenticity',
  authText: [
    'A collection is worth as much as its history, and the history of this one can be told in full. That is why we say clearly how these works came to be here.',
    'The works come from the estate of Christine Rosenfeld, who for years collected the work of George Lilanga and supplied it with Galerie Rosenfeld certificates. When that estate was left without heirs, the entire inheritance was put up for sale through the court.',
    'Ivan Anfossi submitted an offer in court to take over the whole Rosenfeld estate, so as to prevent the collection from being split up and dispersed. The offer was successful, and the collection passed to him as it was: a single acquisition, with a clear provenance from beginning to end.',
    'For those who study or buy, the point is this: there are no intermediate owners and no grey areas. Where available, each record shows the Galerie Rosenfeld certificate, the labels and stamps on the back, the close-up of the signature and the bibliographic references.',
  ].join('\n\n'),
  artistTitle: 'The artist',
  artistBio: [
    'George Lilanga (1934–2005), also known as Lilanga di Nyama, was one of the most important Tanzanian artists of the twentieth century. Born, by his own account, in the village of Kikwetu, in the Masasi district of southern Tanzania, he belonged to the Makonde people, famous for their ebony sculpture.',
    'From 1961 he trained as a sculptor, then moved to Dar es Salaam in the early 1970s, where he was among the founders of the Nyumba ya Sanaa art centre. There he turned the forms of the shetani, the mischievous spirits of Makonde mythology, into a wholly personal pictorial language: long-limbed figures, distorted and ironic faces, flat fields of colour with black outlines, populated by floating shapes and decorative patterns.',
    'After an exhibition in Washington in 1978 his fame spread beyond Africa. Contact with the Tingatinga school, in the early 1980s, strengthened his passion for colour and compositional freedom. His works have been shown in Europe, Asia and Africa, and have influenced artists such as Keith Haring. He signed his works simply "Lilanga". He died in Dar es Salaam in June 2005.',
  ].join('\n\n'),
  timeline: [
    '1934 | Born in Kikwetu, Masasi district (Tanzania), in the Makonde community.',
    '1961 | Begins training as a sculptor in the Makonde tradition.',
    '1973 | In Dar es Salaam he takes part in founding the Nyumba ya Sanaa centre.',
    '1978 | The Washington exhibition introduces him to an international audience.',
    '1980 | Meeting the Tingatinga school enriches his palette.',
    '1989 | Enters the circuit of the great European museums, including Paris.',
    '2005 | Dies in Dar es Salaam.',
  ].join('\n'),
  footer: 'Private archive · All rights in the works belong to their respective rights holders.',
};

const SETTINGS_FR = {
  heroKicker: 'Collection privée',
  heroSubtitle: 'Esprits, ironie et couleur : la collection de peintures, sculptures et dessins d\'un des maîtres de l\'art africain contemporain.',
  collectionTitle: 'L\'histoire de la collection',
  collectionStory: [
    'Cette collection est le récit d\'un artiste dans ses années de formation. Alors que George Lilanga quittait la sculpture makondé pour inventer un langage pictural bien à lui, à Dar es Salaam, dans l\'atmosphère créative du centre Nyumba ya Sanaa, quelqu\'un a commencé à rassembler ce qui sortait de ses mains : les premiers dessins, aquarelles, estampes à la main et batiks.',
    'Au fil des ans, la collection s\'est étendue à toutes les formes dans lesquelles Lilanga s\'est exprimé : peintures sur toile et sur Isorel, calebasses sculptées, sculptures en bois et œuvres en métal. La plupart des travaux appartiennent à sa période initiale, avant que l\'exposition de Washington de 1978 ne le fasse connaître du grand public, et avant que le contact avec l\'école Tingatinga ne change sa palette. C\'est un ensemble difficile à trouver ailleurs.',
    'Pendant des années, la collection est restée en Allemagne, entre les mains de Christine Rosenfeld, qui l\'a conservée et accompagnée des certificats de la Galerie Rosenfeld. L\'intérêt des institutions n\'a pas manqué : le Linden-Museum de Stuttgart en a apprécié la valeur et a acquis une partie des œuvres, qui font aujourd\'hui partie de ses collections. Le reste, le noyau le plus important, est demeuré uni.',
    'Ce noyau est aujourd\'hui entre les mains d\'Ivan Anfossi, qui l\'a acquis dans son intégralité en évitant sa dispersion ; l\'histoire est racontée dans la section Authenticité. Depuis, le travail est celui d\'une archive : chaque œuvre a été photographiée recto et verso, signature, étiquettes et tampons compris, et cataloguée avec un code interne.',
    'Ce site en est la vitrine. Il rassemble les fiches des œuvres pour les chercheurs, les collectionneurs et tous ceux qui veulent se laisser entraîner dans le monde de Lilanga, à partir de là où tout a commencé.',
  ].join('\n\n'),
  authKicker: 'Provenance',
  authTitle: 'Authenticité',
  authText: [
    'Une collection vaut ce que vaut son histoire, et l\'histoire de celle-ci peut être racontée en entier. C\'est pourquoi nous disons clairement comment ces œuvres sont arrivées jusqu\'ici.',
    'Les œuvres proviennent du patrimoine de Christine Rosenfeld, qui a collectionné pendant des années le travail de George Lilanga et l\'a accompagné des certificats de la Galerie Rosenfeld. Lorsque ce patrimoine s\'est retrouvé sans héritiers, l\'ensemble de la succession a été mis en vente par voie judiciaire.',
    'Ivan Anfossi a présenté au tribunal une offre pour reprendre l\'intégralité de la succession Rosenfeld, afin d\'éviter que la collection soit divisée et dispersée. L\'offre a abouti, et la collection lui est revenue telle quelle : une acquisition unique, avec une provenance claire du début à la fin.',
    'Pour qui étudie ou achète, l\'essentiel est ceci : il n\'y a pas d\'intermédiaires ni de zones d\'ombre. Lorsqu\'ils sont disponibles, chaque fiche présente le certificat Galerie Rosenfeld, les étiquettes et tampons au dos, la signature en gros plan et les références bibliographiques.',
  ].join('\n\n'),
  artistTitle: 'L\'artiste',
  artistBio: [
    'George Lilanga (1934–2005), également connu sous le nom de Lilanga di Nyama, a été l\'un des plus importants artistes tanzaniens du XXe siècle. Né, selon son propre récit, dans le village de Kikwetu, dans le district de Masasi, au sud de la Tanzanie, il appartenait au peuple makondé, célèbre pour sa sculpture sur ébène.',
    'À partir de 1961, il se forma à la sculpture, puis s\'installa à Dar es Salaam au début des années 1970, où il fut l\'un des fondateurs du centre artistique Nyumba ya Sanaa. Il y transforma les formes des shetani, les esprits malicieux de la mythologie makondé, en un langage pictural entièrement personnel : figures aux longs membres, visages déformés et ironiques, aplats de couleur cernés de noir, peuplés de formes flottantes et de motifs décoratifs.',
    'Après une exposition à Washington en 1978, sa renommée dépassa l\'Afrique. Le contact avec l\'école Tingatinga, au début des années 1980, renforça sa passion pour la couleur et sa liberté de composition. Ses œuvres ont été exposées en Europe, en Asie et en Afrique, et ont influencé des artistes comme Keith Haring. Il signait ses œuvres simplement « Lilanga ». Il est mort à Dar es Salaam en juin 2005.',
  ].join('\n\n'),
  timeline: [
    '1934 | Naissance à Kikwetu, district de Masasi (Tanzanie), dans la communauté makondé.',
    '1961 | Début de sa formation de sculpteur dans la tradition makondé.',
    '1973 | À Dar es Salaam, il participe à la fondation du centre Nyumba ya Sanaa.',
    '1978 | L\'exposition de Washington le révèle au public international.',
    '1980 | La rencontre avec l\'école Tingatinga enrichit sa palette.',
    '1989 | Il entre dans le circuit des grands musées européens, dont Paris.',
    '2005 | Il meurt à Dar es Salaam.',
  ].join('\n'),
  footer: 'Archive privée · Tous les droits sur les œuvres appartiennent à leurs ayants droit respectifs.',
};

const DEMO = {
  demo001: {
    en: { title: 'Three figures and the house', year: '1990s (to be verified)', technique: 'Enamel on panel', provenance: 'Demo record — to be completed.', conservation: 'Good. Slight signs of wear at the edges.', description: 'Placeholder work used to show the site layout.' },
    fr: { title: 'Trois figures et la maison', year: 'années 1990 (à vérifier)', technique: 'Émail sur panneau', provenance: 'Fiche de démonstration — à compléter.', conservation: 'Bon. Légères traces d\'usure sur les bords.', description: 'Œuvre fictive utilisée pour montrer la mise en page du site.' },
  },
  demo002: {
    en: { title: 'Shetani on a mauve ground', technique: 'Enamel on panel', provenance: 'Demo record — to be completed.', conservation: 'Good.', description: 'Placeholder work used to show the site layout.' },
    fr: { title: 'Shetani sur fond mauve', technique: 'Émail sur panneau', provenance: 'Fiche de démonstration — à compléter.', conservation: 'Bon.', description: 'Œuvre fictive utilisée pour montrer la mise en page du site.' },
  },
};

function settingsTranslations() {
  const out = {};
  for (const k of SETTINGS_KEYS) { out[k + '_en'] = SETTINGS_EN[k]; out[k + '_fr'] = SETTINGS_FR[k]; }
  return out;
}

module.exports = { LANGS, UI, t, pick, detect, SETTINGS_KEYS, ARTWORK_KEYS, settingsTranslations, DEMO };
