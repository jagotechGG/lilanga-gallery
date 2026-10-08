'use strict';
// Credenziali iniziali: CAMBIARLE dal pannello admin (Contenuti → Sicurezza).
const ADMIN_PASSWORD = 'lilanga-admin';

function initialDb() {
  return {
    settings: {
      passphrase: 'shetani',
      siteTitle: 'Collezione Lilanga',
      heroKicker: 'Collezione privata',
      heroTitle: 'George Lilanga',
      heroSubtitle: 'Spiriti, ironia e colore: la collezione di dipinti, sculture e disegni di uno dei maestri dell\'arte africana contemporanea.',
      collectionTitle: 'La storia della collezione',
      collectionStory:
        'La collezione nasce da un incontro: un piccolo pannello rosso, visto per caso in una galleria, in cui tre figure dai lunghi arti danzavano attorno a una casa. Da quel giorno, per oltre trent\'anni, ogni opera è stata scelta con la stessa regola: doveva far sorridere e, un istante dopo, far riflettere.\n\nNegli anni la raccolta è cresciuta con pazienza, tra acquisti presso gallerie europee, scambi con altri collezionisti e viaggi alla ricerca di pezzi con una provenienza chiara. Ogni opera è accompagnata, dove disponibile, da certificato di autenticità, documentazione fotografica e riferimenti bibliografici.\n\nOggi la collezione conta dipinti su pannello, sculture in legno, disegni e lavori su carta. Questo archivio digitale ne raccoglie le schede, per studiosi, appassionati e per chiunque voglia lasciarsi trascinare dal mondo di Lilanga.',
      artistTitle: 'L\'artista',
      artistBio:
        'George Lilanga (1934–2005), noto anche come Lilanga di Nyama, è stato uno dei più importanti artisti tanzaniani del Novecento. Nato, secondo il suo stesso racconto, nel villaggio di Kikwetu, nel distretto di Masasi, nel sud della Tanzania, apparteneva al popolo Makonde, celebre per la tradizione della scultura in ebano.\n\nA partire dal 1961 si formò come scultore, per poi trasferirsi a Dar es Salaam all\'inizio degli anni Settanta, dove fu tra i fondatori del centro artistico Nyumba ya Sanaa. Qui trasformò le forme dei shetani, gli spiriti dispettosi della mitologia Makonde, in un linguaggio pittorico del tutto personale: figure dai lunghi arti, volti stravolti e ironici, campi di colore piatto e contorni neri, popolati da forme sospese e motivi decorativi.\n\nDopo una mostra a Washington nel 1978 la sua fama si estese oltre l\'Africa. Il contatto con la scuola Tingatinga, all\'inizio degli anni Ottanta, rafforzò la sua passione per il colore e la libertà compositiva. Le sue opere sono state esposte in Europa, Asia e Africa, e hanno influenzato artisti come Keith Haring. Firmava i suoi lavori semplicemente «Lilanga». Morì a Dar es Salaam nel giugno 2005.',
      timeline:
        '1934 | Nasce a Kikwetu, distretto di Masasi (Tanzania), nella comunità Makonde.\n1961 | Inizia la formazione come scultore nella tradizione Makonde.\n1973 | A Dar es Salaam partecipa alla fondazione del centro Nyumba ya Sanaa.\n1978 | La mostra di Washington lo rivela al pubblico internazionale.\n1980 | L\'incontro con la scuola Tingatinga arricchisce la sua tavolozza.\n1989 | Entra nel circuito dei grandi musei europei, tra cui Parigi.\n2005 | Muore a Dar es Salaam.',
      footer: 'Archivio riservato · Tutti i diritti sulle opere appartengono ai rispettivi aventi diritto.',
      contact: '',
    },
    artworks: [
      {
        id: 'demo001', code: 'LIL-001', title: 'Tre figure e la casa', category: 'dipinto', year: 'anni \'90 (da verificare)',
        technique: 'Smalto su pannello', dimensions: '50 × 50 cm', provenance: 'Scheda dimostrativa — da compilare.',
        rosenfeld: 'richiesta', rosenfeldNotes: '', catalogues: [], exhibitions: [],
        conservation: 'Buono. Lievi segni d\'uso ai margini.', description: 'Opera segnaposto utilizzata per mostrare il layout del sito.',
        published: true, front: 'demo-001.jpg', back: null, signature: 'demo-001-firma.jpg', labels: [], rosenfeldImgs: [], exhibited: [],
      },
      {
        id: 'demo002', code: 'LIL-002', title: 'Shetani su fondo malva', category: 'dipinto', year: '',
        technique: 'Smalto su pannello', dimensions: '50 × 50 cm', provenance: 'Scheda dimostrativa — da compilare.',
        rosenfeld: 'no', rosenfeldNotes: '', catalogues: [], exhibitions: [],
        conservation: 'Buono.', description: 'Opera segnaposto utilizzata per mostrare il layout del sito.',
        published: true, front: 'demo-002.jpg', back: null, signature: 'demo-002-firma.jpg', labels: [], rosenfeldImgs: [], exhibited: [],
      },
    ],
  };
}
module.exports = { initialDb, ADMIN_PASSWORD };
