import type { Apprenti, SygnaDocument, ActivityEvent } from './types';

export const apprentis: Apprenti[] = [
  {
    id: 'apr_001', name: 'Lina Bouzid', email: 'lina.bouzid@etu.fr',
    formation: 'BTS SIO SLAM', promo: '2024-2026', cfa: 'CFA Numerique Lyon',
    entreprise: 'Acme Software SAS', tuteur: 'Karim Dupont', formateur: 'Helene Vasseur',
    startDate: '2024-09-02', endDate: '2026-06-30',
    conformite: 92, documentsManquants: 1, avatarColor: 'from-cyan-400 to-blue-600',
  },
  {
    id: 'apr_002', name: 'Tom Renard', email: 'tom.renard@etu.fr',
    formation: 'Bachelor Cybersecurite', promo: '2024-2025', cfa: 'CFA Numerique Lyon',
    entreprise: 'Banque Forteresse', tuteur: 'Sophie Albert', formateur: 'Helene Vasseur',
    startDate: '2024-10-01', endDate: '2025-09-30',
    conformite: 76, documentsManquants: 3, avatarColor: 'from-violet-400 to-fuchsia-600',
  },
  {
    id: 'apr_003', name: 'Ines Marchand', email: 'ines.marchand@etu.fr',
    formation: 'Mastere Data', promo: '2023-2025', cfa: 'CFA Numerique Lyon',
    entreprise: 'Acme Software SAS', tuteur: 'Karim Dupont', formateur: 'Marc Lefevre',
    startDate: '2023-09-15', endDate: '2025-09-15',
    conformite: 100, documentsManquants: 0, avatarColor: 'from-emerald-400 to-teal-600',
  },
  {
    id: 'apr_004', name: 'Yanis Cohen', email: 'yanis.cohen@etu.fr',
    formation: 'BTS SIO SISR', promo: '2024-2026', cfa: 'CFA Numerique Lyon',
    entreprise: 'Hopital Saint-Joseph', tuteur: 'Patricia Vidal', formateur: 'Marc Lefevre',
    startDate: '2024-09-02', endDate: '2026-06-30',
    conformite: 64, documentsManquants: 4, avatarColor: 'from-amber-400 to-orange-600',
  },
  {
    id: 'apr_005', name: 'Amina Faure', email: 'amina.faure@etu.fr',
    formation: 'Bachelor Dev Web', promo: '2024-2025', cfa: 'CFA Numerique Lyon',
    entreprise: 'StudioPixel', tuteur: 'Lucas Mercier', formateur: 'Helene Vasseur',
    startDate: '2024-09-09', endDate: '2025-08-31',
    conformite: 88, documentsManquants: 1, avatarColor: 'from-rose-400 to-pink-600',
  },
  {
    id: 'apr_006', name: 'Hugo Pereira', email: 'hugo.pereira@etu.fr',
    formation: 'Mastere IA', promo: '2024-2026', cfa: 'CFA Numerique Lyon',
    entreprise: 'NeuroLab', tuteur: 'Claire Bernard', formateur: 'Marc Lefevre',
    startDate: '2024-09-16', endDate: '2026-09-15',
    conformite: 81, documentsManquants: 2, avatarColor: 'from-sky-400 to-indigo-600',
  },
];

export const documents: SygnaDocument[] = [
  {
    id: 'doc_001', title: 'Livret d\'apprentissage - Septembre 2025', category: 'livret',
    apprentiId: 'apr_001', createdAt: '2025-09-30T08:12:00Z', updatedAt: '2025-10-02T14:22:00Z',
    status: 'envoye', pages: 4, size: '412 ko', version: 3,
    expiresAt: '2025-10-30T23:59:00Z',
    signers: [
      { id: 's1', name: 'Lina Bouzid', email: 'lina.bouzid@etu.fr', role: 'apprenti', order: 1, status: 'signe', signedAt: '2025-10-01T09:00:00Z', method: 'dessinee' },
      { id: 's2', name: 'Karim Dupont', email: 'k.dupont@acme.fr', role: 'entreprise', order: 2, status: 'consulte' },
      { id: 's3', name: 'Helene Vasseur', email: 'h.vasseur@cfa.fr', role: 'formateur', order: 3, status: 'envoye' },
    ],
  },
  {
    id: 'doc_002', title: 'Convention de formation 2024-2026', category: 'convention',
    apprentiId: 'apr_001', createdAt: '2024-09-01T10:00:00Z', updatedAt: '2024-09-04T16:00:00Z',
    status: 'signe', pages: 12, size: '1.2 Mo', version: 1,
    signers: [
      { id: 's1', name: 'Lina Bouzid', email: 'lina.bouzid@etu.fr', role: 'apprenti', order: 1, status: 'signe', signedAt: '2024-09-02T08:00:00Z', method: 'otp' },
      { id: 's2', name: 'Karim Dupont', email: 'k.dupont@acme.fr', role: 'entreprise', order: 2, status: 'signe', signedAt: '2024-09-03T11:00:00Z', method: 'otp' },
      { id: 's3', name: 'Mireille Nadeau', email: 'direction@cfa.fr', role: 'admin', order: 3, status: 'signe', signedAt: '2024-09-04T16:00:00Z', method: 'otp' },
    ],
  },
  {
    id: 'doc_003', title: 'Emargement - Sprint 4', category: 'emargement',
    apprentiId: 'apr_002', createdAt: '2025-09-22T07:00:00Z', updatedAt: '2025-09-22T18:00:00Z',
    status: 'signe', pages: 1, size: '64 ko', version: 1,
    signers: [
      { id: 's1', name: 'Tom Renard', email: 'tom.renard@etu.fr', role: 'apprenti', order: 1, status: 'signe', method: 'dessinee', signedAt: '2025-09-22T09:00:00Z' },
      { id: 's2', name: 'Helene Vasseur', email: 'h.vasseur@cfa.fr', role: 'formateur', order: 2, status: 'signe', method: 'dessinee', signedAt: '2025-09-22T17:50:00Z' },
    ],
  },
  {
    id: 'doc_004', title: 'Compte rendu visite entreprise', category: 'compte-rendu',
    apprentiId: 'apr_004', createdAt: '2025-10-05T14:00:00Z', updatedAt: '2025-10-06T09:15:00Z',
    status: 'consulte', pages: 3, size: '298 ko', version: 1,
    signers: [
      { id: 's1', name: 'Marc Lefevre', email: 'm.lefevre@cfa.fr', role: 'formateur', order: 1, status: 'signe', signedAt: '2025-10-05T15:30:00Z' },
      { id: 's2', name: 'Patricia Vidal', email: 'pv@hsj.fr', role: 'entreprise', order: 2, status: 'consulte' },
      { id: 's3', name: 'Yanis Cohen', email: 'yanis.cohen@etu.fr', role: 'apprenti', order: 3, status: 'envoye' },
    ],
  },
  {
    id: 'doc_005', title: 'Attestation de formation Q3', category: 'attestation',
    apprentiId: 'apr_003', createdAt: '2025-09-28T08:00:00Z', updatedAt: '2025-09-28T08:00:00Z',
    status: 'signe', pages: 1, size: '88 ko', version: 1,
    signers: [{ id: 's1', name: 'Mireille Nadeau', email: 'direction@cfa.fr', role: 'admin', order: 1, status: 'signe', signedAt: '2025-09-28T08:05:00Z' }],
  },
  {
    id: 'doc_006', title: 'Convocation entretien mi-parcours', category: 'convocation',
    apprentiId: 'apr_002', createdAt: '2025-10-03T11:00:00Z', updatedAt: '2025-10-03T11:00:00Z',
    status: 'envoye', pages: 2, size: '120 ko', version: 1,
    signers: [
      { id: 's1', name: 'Tom Renard', email: 'tom.renard@etu.fr', role: 'apprenti', order: 1, status: 'envoye' },
    ],
  },
  {
    id: 'doc_007', title: 'Suivi pedagogique - Octobre', category: 'suivi',
    apprentiId: 'apr_005', createdAt: '2025-10-01T09:00:00Z', updatedAt: '2025-10-04T18:00:00Z',
    status: 'envoye', pages: 6, size: '540 ko', version: 2,
    signers: [
      { id: 's1', name: 'Helene Vasseur', email: 'h.vasseur@cfa.fr', role: 'formateur', order: 1, status: 'signe', signedAt: '2025-10-01T09:30:00Z' },
      { id: 's2', name: 'Lucas Mercier', email: 'lucas@studiopixel.fr', role: 'entreprise', order: 2, status: 'envoye' },
      { id: 's3', name: 'Amina Faure', email: 'amina.faure@etu.fr', role: 'apprenti', order: 3, status: 'envoye' },
    ],
  },
  {
    id: 'doc_008', title: 'Livret d\'apprentissage - Octobre 2025', category: 'livret',
    apprentiId: 'apr_006', createdAt: '2025-10-04T08:00:00Z', updatedAt: '2025-10-04T08:00:00Z',
    status: 'refuse', pages: 4, size: '402 ko', version: 1,
    signers: [
      { id: 's1', name: 'Hugo Pereira', email: 'hugo.pereira@etu.fr', role: 'apprenti', order: 1, status: 'refuse' },
    ],
  },
];

export const activity: ActivityEvent[] = [
  { id: 'a1', ts: '2025-10-07T14:32:00Z', actor: 'Lina Bouzid', action: 'a signe', target: 'Livret d\'apprentissage - Septembre 2025', ip: '82.66.12.4' },
  { id: 'a2', ts: '2025-10-07T13:08:00Z', actor: 'Karim Dupont', action: 'a consulte', target: 'Livret d\'apprentissage - Septembre 2025', ip: '94.22.10.1' },
  { id: 'a3', ts: '2025-10-07T11:45:00Z', actor: 'Helene Vasseur', action: 'a envoye une relance pour', target: 'Suivi pedagogique - Octobre', ip: '10.0.2.31' },
  { id: 'a4', ts: '2025-10-06T18:20:00Z', actor: 'Hugo Pereira', action: 'a refuse', target: 'Livret d\'apprentissage - Octobre 2025', ip: '78.11.4.92' },
  { id: 'a5', ts: '2025-10-06T17:02:00Z', actor: 'Sygna IA', action: 'a detecte 3 documents manquants pour', target: 'Tom Renard', ip: 'system' },
  { id: 'a6', ts: '2025-10-06T09:15:00Z', actor: 'Patricia Vidal', action: 'a consulte', target: 'Compte rendu visite entreprise', ip: '193.50.14.2' },
  { id: 'a7', ts: '2025-10-05T15:30:00Z', actor: 'Marc Lefevre', action: 'a signe', target: 'Compte rendu visite entreprise', ip: '10.0.2.18' },
  { id: 'a8', ts: '2025-10-04T18:00:00Z', actor: 'Helene Vasseur', action: 'a publie la version 2 de', target: 'Suivi pedagogique - Octobre', ip: '10.0.2.31' },
];

export const categoryLabels: Record<string, string> = {
  livret: 'Livret d\'apprentissage',
  convention: 'Convention',
  attestation: 'Attestation',
  convocation: 'Convocation',
  'compte-rendu': 'Compte rendu',
  suivi: 'Suivi pedagogique',
  emargement: 'Emargement',
};

export const statusLabels: Record<string, string> = {
  brouillon: 'Brouillon',
  envoye: 'Envoye',
  consulte: 'Consulte',
  signe: 'Signe',
  refuse: 'Refuse',
  expire: 'Expire',
};

export function getApprenti(id: string) { return apprentis.find(a => a.id === id); }
export function docsForApprenti(id: string) { return documents.filter(d => d.apprentiId === id); }
