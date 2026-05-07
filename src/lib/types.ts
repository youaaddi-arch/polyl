export type Role = 'admin' | 'entreprise' | 'apprenti' | 'formateur';

export type DocCategory =
  | 'livret'
  | 'convention'
  | 'attestation'
  | 'convocation'
  | 'compte-rendu'
  | 'suivi'
  | 'emargement';

export type SignStatus = 'brouillon' | 'envoye' | 'consulte' | 'signe' | 'refuse' | 'expire';

export interface Signer {
  id: string;
  name: string;
  email: string;
  role: Role;
  order: number;
  status: SignStatus;
  signedAt?: string;
  method?: 'dessinee' | 'email' | 'otp';
}

export interface SygnaDocument {
  id: string;
  title: string;
  category: DocCategory;
  apprentiId: string;
  createdAt: string;
  updatedAt: string;
  status: SignStatus;
  signers: Signer[];
  pages: number;
  size: string;
  version: number;
  expiresAt?: string;
}

export interface Apprenti {
  id: string;
  name: string;
  email: string;
  formation: string;
  promo: string;
  cfa: string;
  entreprise: string;
  tuteur: string;
  formateur: string;
  startDate: string;
  endDate: string;
  conformite: number; // 0-100
  documentsManquants: number;
  avatarColor: string;
}

export interface ActivityEvent {
  id: string;
  ts: string;
  actor: string;
  action: string;
  target: string;
  ip?: string;
}
