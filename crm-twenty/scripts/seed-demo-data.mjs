// Seed demo data on testFormation + testApprenant + testOpportunite
// Idempotent-ish : checks for existing record by 'name' before creating.
import fs from 'node:fs';
const env = Object.fromEntries(
  fs.readFileSync('.env','utf8').split('\n').filter(Boolean).map(l=>{const i=l.indexOf('=');return [l.slice(0,i).trim(),l.slice(i+1).trim()];})
);
const BASE = env.TWENTY_API_BASE;
const H = { Authorization: 'Bearer '+env.TWENTY_API_KEY, 'Content-Type':'application/json' };

async function api(method, path, body) {
  const r = await fetch(BASE+path, { method, headers: H, body: body?JSON.stringify(body):undefined });
  const t = await r.text();
  let j; try { j = JSON.parse(t); } catch { j = t; }
  if (!r.ok) throw new Error(method+' '+path+' → '+r.status+' '+t.slice(0,300));
  return j;
}

// --- Formations ---
const formationsSeed = [
  { name: 'Bachelor NDRC',           code:'BACH_NDRC', niveau:'BAC_PLUS_3', duree:'12 mois',  prix: 8500,  modalite:'ALTERNANCE', objectifs:'Former des chargés de négociation et relation client capables de prospecter, négocier et fidéliser une clientèle B2B et B2C.' },
  { name: 'BTS Gestion de la PME',   code:'BTS_GPME',  niveau:'BAC_PLUS_2', duree:'24 mois',  prix: 7200,  modalite:'ALTERNANCE', objectifs:'Former des assistants de gestion polyvalents au service du dirigeant de TPE/PME.' },
  { name: 'Master MBA Management',   code:'MBA_MGT',   niveau:'BAC_PLUS_5', duree:'18 mois',  prix: 12000, modalite:'FC_DIPLOMANTE', objectifs:'Renforcer les compétences managériales pour évoluer vers un poste de direction.' },
  { name: 'Formation Power BI',      code:'FC_PBI',    niveau:'NON_DIPLOMANTE', duree:'35 heures', prix: 1800, modalite:'FC_COURTE', objectifs:'Maîtriser Power BI pour construire des tableaux de bord décisionnels.' },
];

console.log('--- Formations ---');
const existingFormations = (await api('GET','/rest/testFormations')).data?.testFormations || [];
const formationByName = {};
for (const f of formationsSeed) {
  let existing = existingFormations.find(e => e.name === f.name);
  if (existing) {
    console.log('  skip',f.name,'(exists)');
    formationByName[f.name] = existing.id;
  } else {
    const r = await api('POST','/rest/testFormations', f);
    const created = r.data.createTestFormation;
    console.log('  + formation',f.name,'(id',created.id+')');
    formationByName[f.name] = created.id;
  }
}

// --- Apprenants ---
const apprenantsSeed = [
  { fullName:{firstName:'Marie',  lastName:'Dupont'},   email:{primaryEmail:'marie.dupont@email.fr'},   telephone:{primaryPhoneNumber:'0612345678',  primaryPhoneCountryCode:'FR'}, dateNaissance:'2001-03-14', adresse:{addressStreet1:'12 rue de Rivoli', addressCity:'Paris',    addressPostcode:'75001', addressCountry:'France'}, dernierDiplome:'BAC_PLUS_2', statutActuel:'DEMANDEUR_EMPLOI', typeFormation:'APPRENTISSAGE', centreSouhaite:'PARIS',    commentNousAConnu:'GOOGLE',         formationVoulue:'Bachelor NDRC' },
  { fullName:{firstName:'Thomas', lastName:'Martin'},   email:{primaryEmail:'thomas.martin@email.fr'},  telephone:{primaryPhoneNumber:'0623456789',  primaryPhoneCountryCode:'FR'}, dateNaissance:'2003-07-22', adresse:{addressStreet1:'45 cours Lafayette',addressCity:'Lyon',     addressPostcode:'69003', addressCountry:'France'}, dernierDiplome:'BAC',        statutActuel:'ETUDIANT',         typeFormation:'APPRENTISSAGE', centreSouhaite:'LYON',     commentNousAConnu:'RESEAUX_SOCIAUX',formationVoulue:'BTS Gestion de la PME' },
  { fullName:{firstName:'Sophie', lastName:'Bernard'},  email:{primaryEmail:'sophie.bernard@email.fr'}, telephone:{primaryPhoneNumber:'0634567890',  primaryPhoneCountryCode:'FR'}, dateNaissance:'1990-11-05', adresse:{addressStreet1:'8 rue Paradis',     addressCity:'Marseille',addressPostcode:'13001', addressCountry:'France'}, dernierDiplome:'BAC_PLUS_5', statutActuel:'SALARIE',          typeFormation:'DIPLOMANTE',    centreSouhaite:'MARSEILLE',commentNousAConnu:'LINKEDIN',      formationVoulue:'Master MBA Management' },
  { fullName:{firstName:'Karim',  lastName:'Hadji'},    email:{primaryEmail:'karim.hadji@email.fr'},    telephone:{primaryPhoneNumber:'0645678901',  primaryPhoneCountryCode:'FR'}, dateNaissance:'1998-02-19', adresse:{addressStreet1:'56 rue Nationale',  addressCity:'Lille',    addressPostcode:'59000', addressCountry:'France'}, dernierDiplome:'BAC_PLUS_3', statutActuel:'SANS_ACTIVITE',    typeFormation:'APPRENTISSAGE', centreSouhaite:'LILLE',    commentNousAConnu:'BOUCHE_A_OREILLE',formationVoulue:'Bachelor NDRC' },
  { fullName:{firstName:'Elena',  lastName:'Rossi'},    email:{primaryEmail:'elena.rossi@email.fr'},    telephone:{primaryPhoneNumber:'0656789012',  primaryPhoneCountryCode:'FR'}, dateNaissance:'1985-09-30', adresse:{addressStreet1:"18 cours de l'Intendance", addressCity:'Bordeaux', addressPostcode:'33000', addressCountry:'France'}, dernierDiplome:'BAC_PLUS_3', statutActuel:'INDEPENDANT',     typeFormation:'CONTINUE',      centreSouhaite:'BORDEAUX', commentNousAConnu:'PRESCRIPTEUR',    formationVoulue:'Formation Power BI' },
];

console.log('\\n--- Apprenants ---');
const existingApprenants = (await api('GET','/rest/testApprenants')).data?.testApprenants || [];
const apprenantInfo = []; // {id, name, formationVoulue}
for (const a of apprenantsSeed) {
  const displayName = a.fullName.firstName+' '+a.fullName.lastName;
  let existing = existingApprenants.find(e =>
    e.fullName && e.fullName.firstName === a.fullName.firstName && e.fullName.lastName === a.fullName.lastName
  );
  const payload = { ...a, formationSouhaiteeId: formationByName[a.formationVoulue] };
  delete payload.formationVoulue;
  if (existing) {
    console.log('  skip',displayName,'(exists)');
    apprenantInfo.push({ id: existing.id, name: displayName, formationVoulue: a.formationVoulue });
  } else {
    const r = await api('POST','/rest/testApprenants', payload);
    const created = r.data.createTestApprenant;
    console.log('  + apprenant',displayName,'(id',created.id+')');
    apprenantInfo.push({ id: created.id, name: displayName, formationVoulue: a.formationVoulue });
  }
}

// --- Opportunités ---
const oppsSeed = [
  { apprenantName:'Marie Dupont',  pipelineType:'APPRENTISSAGE',      stageField:'stageApprentissage',     stageValue:'ENTRETIEN_TELEPHONIQUE',    daysAgo: 6 },
  { apprenantName:'Thomas Martin', pipelineType:'APPRENTISSAGE',      stageField:'stageApprentissage',     stageValue:'CANDIDATURE',               daysAgo: 2 },
  { apprenantName:'Karim Hadji',   pipelineType:'APPRENTISSAGE',      stageField:'stageApprentissage',     stageValue:'JOB_DATING',                daysAgo: 18 },
  { apprenantName:'Sophie Bernard',pipelineType:'FORMATION_PRO',      stageField:'stageFormationPro',      stageValue:'DEVIS_ENVOYE',              daysAgo: 9 },
  { apprenantName:'Elena Rossi',   pipelineType:'FORMATION_CONTINUE', stageField:'stageFormationContinue', stageValue:'DEMANDE_FINANCEMENT_ENVOYEE', daysAgo: 4 },
];

console.log('\\n--- Opportunités ---');
const existingOpps = (await api('GET','/rest/testOpportunites?limit=100')).data?.testOpportunites || [];
for (const o of oppsSeed) {
  const apr = apprenantInfo.find(a => a.name === o.apprenantName);
  const formationId = formationByName[apr.formationVoulue];
  const oppName = apr.name+' — '+apr.formationVoulue;
  if (existingOpps.find(e => e.name === oppName)) {
    console.log('  skip',oppName,'(exists)');
    continue;
  }
  const date = new Date(); date.setDate(date.getDate() - o.daysAgo);
  const payload = {
    name: oppName,
    apprenantId: apr.id,
    formationId,
    typePipeline: o.pipelineType,
    [o.stageField]: o.stageValue,
    dateOuverture: date.toISOString(),
  };
  const r = await api('POST','/rest/testOpportunites', payload);
  console.log('  +',oppName,'@',o.stageValue);
}

console.log('\\n=== DONE ===');
