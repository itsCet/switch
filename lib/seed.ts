import { CalendarEvent, DraftPost, Deadline, JournalEntry, Partner, Template } from "./types";

export const SEED_DRAFTS: DraftPost[] = [
  {
    id: "d1",
    space: "gtp",
    title: "Carrousel stats - demi-finale J14",
    status: "a-valider",
    updatedAt: "2026-07-04T18:20:00",
    excerpt: "3 chiffres cles du match, visuel aux couleurs du tournoi, CTA billetterie.",
  },
  {
    id: "d2",
    space: "fourteen",
    title: "Coverage backstage - shooting capsule ete",
    status: "brouillon",
    updatedAt: "2026-07-04T21:05:00",
    excerpt: "Selects du shooting, teaser video 15s, legende sur le concept 'Passion Is Always Right'.",
  },
];

export const SEED_DEADLINES: Deadline[] = [
  {
    id: "dl1",
    space: "gtp",
    title: "Publication recap match vs Lyon",
    date: "2026-07-06",
    kind: "publication",
  },
  {
    id: "dl2",
    space: "fourteen",
    title: "Livraison shooting capsule ete",
    date: "2026-07-09",
    kind: "shooting",
  },
];

export const SEED_PARTNERS: Partner[] = [
  {
    id: "p1",
    space: "gtp",
    name: "Swiss Basketball - com externe",
    lastContact: "2026-07-03T10:00:00",
    status: "en attente",
    note: "Attente validation visuel partenaire avant publication.",
  },
  {
    id: "p2",
    space: "fourteen",
    name: "Studio Noir & Or (photographe)",
    lastContact: "2026-07-04T16:40:00",
    status: "relance envoyee",
    note: "Relance pour les fichiers HD du shooting capsule.",
  },
];

export const SEED_CALENDAR: CalendarEvent[] = [
  { id: "c1", space: "gtp", title: "Match GTP vs Lyon", date: "2026-07-06", kind: "match", time: "18:00" },
  { id: "c2", space: "gtp", title: "Publication recap match", date: "2026-07-06", kind: "publication", time: "21:00" },
  { id: "c3", space: "fourteen", title: "Shooting capsule ete", date: "2026-07-06", kind: "shooting", time: "10:00" },
  { id: "c4", space: "fourteen", title: "Reunion planning FIBA content", date: "2026-07-08", kind: "reunion", time: "14:00" },
  { id: "c5", space: "gtp", title: "Coverage joueur - interview", date: "2026-07-09", kind: "match", time: "11:00" },
  { id: "c6", space: "fourteen", title: "Livraison shooting capsule ete", date: "2026-07-09", kind: "shooting", time: "17:00" },
  { id: "c7", space: "gtp", title: "Contenu partenaire - teasing", date: "2026-07-11", kind: "partenaire", time: "09:00" },
];

export const SEED_TEMPLATES: Template[] = [
  {
    id: "t1",
    space: "gtp",
    name: "Carrousel stats match",
    format: "Carrousel 5 slides",
    description: "Stats cles + MVP + citation coach + prochain match + CTA billetterie.",
    usageCount: 14,
    lastUsed: "2026-07-01",
  },
  {
    id: "t2",
    space: "gtp",
    name: "Coverage joueur",
    format: "Reel 30s",
    description: "Portrait joueur, entrainement, citation, teaser prochain match.",
    usageCount: 9,
    lastUsed: "2026-06-27",
  },
  {
    id: "t3",
    space: "gtp",
    name: "Contenu partenaire",
    format: "Post simple + story",
    description: "Mise en avant sponsor, logo integre, mention obligatoire, lien tracké.",
    usageCount: 6,
    lastUsed: "2026-06-20",
  },
  {
    id: "t4",
    space: "fourteen",
    name: "Contenu FIBA / Swiss Basketball",
    format: "Repost + habillage",
    description: "Recadrage brand, ajout watermark Fourteen, legende ton 'Passion Is Always Right'.",
    usageCount: 11,
    lastUsed: "2026-06-30",
  },
  {
    id: "t5",
    space: "fourteen",
    name: "Backstage shooting",
    format: "Story sequence",
    description: "5-8 stories brutes + BTS + musique + sondage engagement.",
    usageCount: 8,
    lastUsed: "2026-06-22",
  },
];

export const SEED_JOURNAL: JournalEntry[] = [
  {
    space: "gtp",
    whereImAt: "Carrousel stats pret a etre valide, en attente retour visuel partenaire.",
    waitingOn: "Swiss Basketball (com externe) - validation visuel",
    updatedAt: "2026-07-04T18:25:00",
  },
  {
    space: "fourteen",
    whereImAt: "Tri des photos du shooting, montage teaser video en cours.",
    waitingOn: "Studio Noir & Or - fichiers HD",
    updatedAt: "2026-07-04T21:10:00",
  },
];
