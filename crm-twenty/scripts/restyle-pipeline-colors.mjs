// Re-color the 3 pipeline stage SELECTs and key status fields with intentional
// gradients so the Kanban "tells a story" visually (cold leads → hot deals → client).
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
  if (!r.ok) throw new Error(method+' '+path+' → '+r.status+' '+t.slice(0,400));
  return j;
}

async function pagedFields() {
  let all=[], cursor=null;
  while(true){
    const r = await api('GET','/rest/metadata/fields'+(cursor?'?starting_after='+cursor:''));
    const arr = r.data||r;
    if(!arr.length) break;
    all = all.concat(arr);
    if(arr.length<60) break;
    cursor = arr[arr.length-1].id;
  }
  return all;
}

const objs = (await api('GET','/rest/metadata/objects')).data;
const allFields = await pagedFields();
const F = (objName, fName) => {
  const o = objs.find(x => x.nameSingular === objName);
  return allFields.find(f => f.objectMetadataId === o.id && f.name === fName);
};

// Pipeline cold→hot→client→done gradient
// Twenty palette: gray, red, orange, yellow, green, turquoise, sky, blue, purple, pink
const PIPELINES = {
  stageApprentissage: [
    ['DEMANDE_RENSEIGNEMENT', 'Demande de renseignement', 'gray'],
    ['CANDIDATURE',           'Candidature',              'sky'],
    ['ENTRETIEN_TELEPHONIQUE','Entretien téléphonique',   'blue'],
    ['ENTRETIEN_PHYSIQUE',    'Entretien physique',       'purple'],
    ['JOB_DATING',            'Job dating',               'pink'],
    ['PLACE',                 'Placé',                    'orange'],
    ['CONTRAT_SAISI',         'Contrat saisi',            'yellow'],
    ['CONTRAT_ACCORDE',       'Contrat accordé',          'green'],
    ['ENTREE_EN_FORMATION',   'Entrée en formation',      'turquoise'],
    ['FIN_DE_FORMATION',      'Fin de formation',         'gray'],
  ],
  stageFormationPro: [
    ['DEMANDE_RENSEIGNEMENT',         'Demande de renseignement',          'gray'],
    ['CANDIDATURE',                   'Candidature',                       'sky'],
    ['ENTRETIEN_TELEPHONIQUE',        'Entretien téléphonique',            'blue'],
    ['DEVIS_ENVOYE',                  'Devis envoyé',                      'purple'],
    ['DEVIS_VALIDE',                  'Devis validé',                      'pink'],
    ['DEMANDE_FINANCEMENT_ENVOYEE',   'Demande de financement envoyée',    'orange'],
    ['DEMANDE_FINANCEMENT_ACCORDEE',  'Demande de financement accordée',   'green'],
    ['ENTREE_EN_FORMATION',           'Entrée en formation',               'turquoise'],
    ['FIN_DE_FORMATION',              'Fin de formation',                  'gray'],
  ],
  stageFormationContinue: [
    ['DEMANDE_RENSEIGNEMENT',         'Demande de renseignement',          'gray'],
    ['ENTRETIEN_TELEPHONIQUE',        'Entretien téléphonique',            'blue'],
    ['DEVIS_ENVOYE',                  'Devis envoyé',                      'purple'],
    ['DEMANDE_FINANCEMENT_ENVOYEE',   'Demande de financement envoyée',    'orange'],
    ['DEMANDE_FINANCEMENT_ACCORDEE',  'Demande de financement accordée',   'green'],
    ['ENTREE_EN_FORMATION',           'Entrée en formation',               'turquoise'],
    ['FIN_DE_FORMATION',              'Fin de formation',                  'gray'],
  ],
};

async function patchSelectOptions(objName, fName, opts) {
  const f = F(objName, fName);
  if (!f) { console.log('  missing',fName); return; }
  const options = opts.map(([value,label,color],i)=>({ value, label, color, position: i }));
  await api('PATCH','/rest/metadata/fields/'+f.id, { options });
  console.log('  ✓',objName+'.'+fName,'('+options.length+' options re-colored)');
}

console.log('--- Re-coloring pipeline stages on testOpportunite ---');
for (const [name, opts] of Object.entries(PIPELINES)) {
  await patchSelectOptions('testOpportunite', name, opts);
}

// Re-color typePipeline with brand-ish colors
console.log('\n--- Re-coloring typePipeline ---');
await patchSelectOptions('testOpportunite', 'typePipeline', [
  ['APPRENTISSAGE',      'Apprentissage',         'blue'],
  ['FORMATION_PRO',      'Formation professionnelle', 'purple'],
  ['FORMATION_CONTINUE', 'Formation continue',    'turquoise'],
]);

console.log('\n--- Re-coloring apprenant.typeFormation (mirror) ---');
await patchSelectOptions('testApprenant', 'typeFormation', [
  ['APPRENTISSAGE', 'Apprentissage',         'blue'],
  ['CONTINUE',      'Formation continue',    'turquoise'],
  ['DIPLOMANTE',    'Formation diplômante',  'purple'],
]);

console.log('\n--- Re-coloring apprenant.statutActuel ---');
await patchSelectOptions('testApprenant', 'statutActuel', [
  ['ETUDIANT',         'Étudiant',           'sky'],
  ['DEMANDEUR_EMPLOI', "Demandeur d'emploi", 'orange'],
  ['SALARIE',          'Salarié',            'green'],
  ['INDEPENDANT',      'Indépendant',        'purple'],
  ['SANS_ACTIVITE',    'Sans activité',      'gray'],
]);

console.log('\n--- Re-coloring apprenant.commentNousAConnu ---');
await patchSelectOptions('testApprenant', 'commentNousAConnu', [
  ['GOOGLE',           'Google',                  'blue'],
  ['RESEAUX_SOCIAUX',  'Réseaux sociaux',         'pink'],
  ['LINKEDIN',         'LinkedIn',                'sky'],
  ['BOUCHE_A_OREILLE', 'Bouche-à-oreille',        'green'],
  ['PRESCRIPTEUR',     'Prescripteur / école',    'purple'],
  ['SALON',            'Salon / événement',       'orange'],
  ['SITE_WEB',         'Site web direct',         'turquoise'],
  ['AUTRE',            'Autre',                   'gray'],
]);

console.log('\n--- Re-coloring resultatFinal ---');
await patchSelectOptions('testOpportunite', 'resultatFinal', [
  ['DIPLOME',   'Diplômé / Formé',  'green'],
  ['ABANDON',   'Abandon',          'orange'],
  ['ECHEC',     'Échec',            'red'],
  ['NON_PLACE', 'Non placé',        'gray'],
]);

console.log('\n=== DONE ===');
