// One-shot refactor (CDC Personne v3):
// - testApprenant : remove marketing + 3 stages + modalite + ville/CP/dpt/region + age + linkedinUrl + formationVisee + secteurVise
//                   add adresse(ADDRESS), dernierDiplome, statutActuel, commentNousAConnu, typeFormation, centreSouhaite, formationSouhaitee(REL)
// - testOpportunite : new object with 3 stage pipelines + relations to apprenant/formation/entite
// - testFormation : add prix, objectifs, duree, niveau ; rename name→Intitulé
// - company (native ext) : add siret, financementSouhaite, formationSouhaitee(REL)

import fs from 'node:fs';
const env = Object.fromEntries(
  fs.readFileSync('.env','utf8').split('\n').filter(Boolean).map(l=>{const i=l.indexOf('=');return [l.slice(0,i).trim(),l.slice(i+1).trim()];})
);
const BASE = env.TWENTY_API_BASE;
const H = { Authorization: 'Bearer '+env.TWENTY_API_KEY, 'Content-Type':'application/json' };

async function api(method, path, body) {
  // Auto-assign positions on SELECT options to satisfy Twenty validator
  if (body && body.type === 'SELECT' && Array.isArray(body.options)) {
    body.options = body.options.map((o, i) => ({ position: i, ...o }));
  }
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
const O = name => objs.find(o => o.nameSingular === name);
let fields = await pagedFields();
const F = (objName, fname) => fields.find(f => f.objectMetadataId === O(objName).id && f.name === fname);
const refresh = async () => { fields = await pagedFields(); };

// ============= 1. testApprenant : DELETE old fields =============
const TO_DROP = ['stageAlternance','stageFcDiplomante','stageFcCourte','modalite',
  'utmSource','utmMedium','utmCampaign','canalSource','scoreQualite',
  'formationVisee','secteurVise','rentreeVisee','mobiliteKm',
  'age','ville','codePostal','departement','region','linkedinUrl'];

console.log('--- 1. Deleting old fields on testApprenant ---');
for (const fname of TO_DROP) {
  const f = F('testApprenant', fname);
  if (!f) { console.log('  skip',fname,'(not present)'); continue; }
  await api('DELETE','/rest/metadata/fields/'+f.id);
  console.log('  - del',fname);
}
await refresh();

// ============= 2. testApprenant : ADD new fields =============
console.log('\n--- 2. Adding new fields on testApprenant ---');
const aprId = O('testApprenant').id;
const VILLES = ['Paris','Marseille','Lyon','Toulouse','Nice','Nantes','Montpellier','Strasbourg',
  'Bordeaux','Lille','Rennes','Reims','Saint-Étienne','Le Havre','Toulon','Grenoble','Dijon',
  'Angers','Nîmes','Villeurbanne','Aix-en-Provence','Brest','Le Mans','Tours','Amiens','Limoges',
  'Clermont-Ferrand','Besançon','Orléans','Metz','Rouen','Mulhouse','Perpignan','Caen','Nancy'];

const apprenantNewFields = [
  { name:'adresse', label:'Adresse', type:'ADDRESS' },
  { name:'dernierDiplome', label:'Dernier diplôme validé', type:'SELECT',
    options:[
      { value:'SANS',        label:'Sans diplôme',      color:'gray' },
      { value:'CAP_BEP',     label:'CAP / BEP',          color:'pink' },
      { value:'BAC',         label:'Bac',                color:'yellow' },
      { value:'BAC_PLUS_2',  label:'Bac+2 (BTS / BUT)',  color:'blue' },
      { value:'BAC_PLUS_3',  label:'Bac+3 (Licence / Bachelor)', color:'sky' },
      { value:'BAC_PLUS_5',  label:'Bac+5 (Master / Ingénieur)', color:'purple' },
      { value:'BAC_PLUS_8',  label:'Bac+8 (Doctorat)',   color:'green' },
    ]
  },
  { name:'statutActuel', label:'Statut actuel', type:'SELECT',
    options:[
      { value:'ETUDIANT',         label:'Étudiant',          color:'blue' },
      { value:'DEMANDEUR_EMPLOI', label:"Demandeur d'emploi", color:'orange' },
      { value:'SALARIE',          label:'Salarié',           color:'green' },
      { value:'INDEPENDANT',      label:'Indépendant',       color:'purple' },
      { value:'SANS_ACTIVITE',    label:'Sans activité',     color:'gray' },
    ]
  },
  { name:'commentNousAConnu', label:'Comment nous a connu', type:'SELECT',
    options:[
      { value:'GOOGLE',           label:'Google',                 color:'blue' },
      { value:'RESEAUX_SOCIAUX',  label:'Réseaux sociaux',        color:'pink' },
      { value:'LINKEDIN',         label:'LinkedIn',               color:'sky' },
      { value:'BOUCHE_A_OREILLE', label:'Bouche-à-oreille',       color:'green' },
      { value:'PRESCRIPTEUR',     label:'Prescripteur / école',   color:'purple' },
      { value:'SALON',            label:'Salon / événement',      color:'orange' },
      { value:'SITE_WEB',         label:'Site web direct',        color:'yellow' },
      { value:'AUTRE',            label:'Autre',                  color:'gray' },
    ]
  },
  { name:'typeFormation', label:'Type de formation', type:'SELECT',
    options:[
      { value:'APPRENTISSAGE', label:'Apprentissage',         color:'blue' },
      { value:'CONTINUE',      label:'Formation continue',    color:'green' },
      { value:'DIPLOMANTE',    label:'Formation diplômante',  color:'purple' },
    ]
  },
  { name:'centreSouhaite', label:'Centre souhaité (ville)', type:'SELECT',
    options: VILLES.map((v,i)=>({
      value: v.normalize('NFD').replace(/[̀-ͯ]/g,'').toUpperCase().replace(/[^A-Z0-9]+/g,'_').replace(/^_|_$/g,''),
      label: v,
      color: ['blue','sky','purple','pink','orange','yellow','green','gray'][i%8]
    }))
  },
];
for (const f of apprenantNewFields) {
  if (F('testApprenant', f.name)) { console.log('  skip',f.name,'(exists)'); continue; }
  await api('POST','/rest/metadata/fields', { ...f, objectMetadataId: aprId });
  console.log('  + field',f.name);
}
await refresh();

// ============= 3. Create testOpportunite =============
console.log('\n--- 3. Creating testOpportunite ---');
let opp = O('testOpportunite');
if (!opp) {
  const r = await api('POST','/rest/metadata/objects', {
    nameSingular: 'testOpportunite',
    namePlural:   'testOpportunites',
    labelSingular: '[TEST] Opportunité',
    labelPlural:   '[TEST] Opportunités',
    description: 'Candidature avec parcours pipeline. Une personne peut avoir plusieurs opportunités (différentes formations / années).',
    icon: 'IconTarget',
  });
  opp = r; objs.push(r);
  console.log('  + object testOpportunite');
} else {
  console.log('  skip testOpportunite (exists)');
}

const oppId = opp.id;
const PIPE_APPRENTISSAGE = [
  ['DEMANDE_RENSEIGNEMENT', 'Demande de renseignement', 'gray'],
  ['CANDIDATURE',           'Candidature',              'blue'],
  ['ENTRETIEN_TELEPHONIQUE','Entretien téléphonique',   'sky'],
  ['ENTRETIEN_PHYSIQUE',    'Entretien physique',       'purple'],
  ['JOB_DATING',            'Job dating',               'pink'],
  ['PLACE',                 'Placé',                    'orange'],
  ['CONTRAT_SAISI',         'Contrat saisi',            'yellow'],
  ['CONTRAT_ACCORDE',       'Contrat accordé',          'green'],
  ['ENTREE_EN_FORMATION',   'Entrée en formation',      'green'],
  ['FIN_DE_FORMATION',      'Fin de formation',         'gray'],
];
const PIPE_FORMATION_PRO = [
  ['DEMANDE_RENSEIGNEMENT',   'Demande de renseignement',         'gray'],
  ['CANDIDATURE',             'Candidature',                       'blue'],
  ['ENTRETIEN_TELEPHONIQUE',  'Entretien téléphonique',            'sky'],
  ['DEVIS_ENVOYE',            'Devis envoyé',                      'purple'],
  ['DEVIS_VALIDE',            'Devis validé',                      'pink'],
  ['DEMANDE_FINANCEMENT_ENVOYEE',  'Demande de financement envoyée', 'orange'],
  ['DEMANDE_FINANCEMENT_ACCORDEE', 'Demande de financement accordée','yellow'],
  ['ENTREE_EN_FORMATION',     'Entrée en formation',               'green'],
  ['FIN_DE_FORMATION',        'Fin de formation',                  'gray'],
];
const PIPE_FORMATION_CONTINUE = [
  ['DEMANDE_RENSEIGNEMENT',   'Demande de renseignement',          'gray'],
  ['ENTRETIEN_TELEPHONIQUE',  'Entretien téléphonique',            'sky'],
  ['DEVIS_ENVOYE',            'Devis envoyé',                      'purple'],
  ['DEMANDE_FINANCEMENT_ENVOYEE',  'Demande de financement envoyée', 'orange'],
  ['DEMANDE_FINANCEMENT_ACCORDEE', 'Demande de financement accordée','yellow'],
  ['ENTREE_EN_FORMATION',     'Entrée en formation',               'green'],
  ['FIN_DE_FORMATION',        'Fin de formation',                  'gray'],
];
const toOpts = arr => arr.map(([v,l,c])=>({ value:v, label:l, color:c }));

const oppFields = [
  { name:'typePipeline', label:'Type de pipeline', type:'SELECT',
    options:[
      { value:'APPRENTISSAGE', label:'Apprentissage',         color:'blue' },
      { value:'FORMATION_PRO', label:'Formation professionnelle', color:'green' },
      { value:'FORMATION_CONTINUE', label:'Formation continue', color:'purple' },
    ]
  },
  { name:'stageApprentissage',     label:'Étape — Apprentissage',           type:'SELECT', options: toOpts(PIPE_APPRENTISSAGE), defaultValue: "'DEMANDE_RENSEIGNEMENT'" },
  { name:'stageFormationPro',      label:'Étape — Formation pro',           type:'SELECT', options: toOpts(PIPE_FORMATION_PRO),  defaultValue: "'DEMANDE_RENSEIGNEMENT'" },
  { name:'stageFormationContinue', label:'Étape — Formation continue',      type:'SELECT', options: toOpts(PIPE_FORMATION_CONTINUE), defaultValue: "'DEMANDE_RENSEIGNEMENT'" },
  { name:'dateOuverture',          label:"Date d'ouverture",                type:'DATE_TIME' },
  { name:'dateEntreeEnFormation',  label:"Date d'entrée en formation",      type:'DATE_TIME', description: 'Date de bascule prospect → client.' },
  { name:'dateCloture',            label:'Date de clôture',                 type:'DATE_TIME' },
  { name:'resultatFinal',          label:'Résultat final',                  type:'SELECT',
    options:[
      { value:'DIPLOME',    label:'Diplômé / Formé',  color:'green' },
      { value:'ABANDON',    label:'Abandon',          color:'orange' },
      { value:'ECHEC',      label:'Échec',            color:'red' },
      { value:'NON_PLACE',  label:'Non placé',        color:'gray' },
    ]
  },
];
console.log('\n--- 4. Adding fields to testOpportunite ---');
await refresh();
for (const f of oppFields) {
  if (F('testOpportunite', f.name)) { console.log('  skip',f.name,'(exists)'); continue; }
  await api('POST','/rest/metadata/fields', { ...f, objectMetadataId: oppId });
  console.log('  + field',f.name);
}
await refresh();

// Relations testOpportunite → testApprenant / testFormation / testEntite
console.log('\n--- 5. Adding relations on testOpportunite ---');
const RELS = [
  { name:'apprenant', label:'Apprenant',  target:'testApprenant', plural:'opportunites', pluralLabel:'Opportunités' },
  { name:'formation', label:'Formation',  target:'testFormation', plural:'opportunites', pluralLabel:'Opportunités' },
  { name:'entite',    label:'Centre administratif', target:'testEntite', plural:'opportunites', pluralLabel:'Opportunités' },
];
for (const r of RELS) {
  if (F('testOpportunite', r.name)) { console.log('  skip',r.name,'(exists)'); continue; }
  await api('POST','/rest/metadata/fields', {
    name: r.name, label: r.label, type:'RELATION',
    objectMetadataId: oppId,
    relationCreationPayload: {
      type:'MANY_TO_ONE',
      targetObjectMetadataId: O(r.target).id,
      targetFieldLabel: r.pluralLabel,
      targetFieldIcon: 'IconTarget',
    },
  });
  console.log('  + rel testOpportunite.'+r.name+' → '+r.target);
}
await refresh();

// Also add apprenant → formationSouhaitee relation
console.log('\n--- 6. Adding apprenant.formationSouhaitee → testFormation ---');
if (!F('testApprenant','formationSouhaitee')) {
  await api('POST','/rest/metadata/fields',{
    name:'formationSouhaitee', label:'Formation souhaitée', type:'RELATION',
    objectMetadataId: aprId,
    relationCreationPayload: {
      type:'MANY_TO_ONE',
      targetObjectMetadataId: O('testFormation').id,
      targetFieldLabel: 'Prospects intéressés',
      targetFieldIcon: 'IconUserCircle',
    },
  });
  console.log('  + rel testApprenant.formationSouhaitee → testFormation');
} else {
  console.log('  skip formationSouhaitee (exists)');
}
await refresh();

// ============= 7. testFormation : add prix, objectifs, duree, niveau =============
console.log('\n--- 7. Adding fields on testFormation ---');
const fmId = O('testFormation').id;
const fmFields = [
  { name:'prix',      label:'Prix (€)',  type:'NUMBER' },
  { name:'objectifs', label:'Objectifs', type:'TEXT' },
  { name:'duree',     label:'Durée',     type:'TEXT', description:'Format libre : "12 mois", "350 heures", etc.' },
  { name:'niveau',    label:'Niveau',    type:'SELECT',
    options:[
      { value:'BAC',         label:'Bac',          color:'yellow' },
      { value:'BAC_PLUS_2',  label:'Bac+2',        color:'blue' },
      { value:'BAC_PLUS_3',  label:'Bac+3',        color:'sky' },
      { value:'BAC_PLUS_5',  label:'Bac+5',        color:'purple' },
      { value:'NON_DIPLOMANTE', label:'Non diplômante', color:'gray' },
    ]
  },
];
for (const f of fmFields) {
  if (F('testFormation', f.name)) { console.log('  skip',f.name,'(exists)'); continue; }
  await api('POST','/rest/metadata/fields', { ...f, objectMetadataId: fmId });
  console.log('  + field testFormation.'+f.name);
}

// ============= 8. Company native : siret + financementSouhaite + formationSouhaitee =============
console.log('\n--- 8. Adding fields on company (native) ---');
const companyId = objs.find(o=>o.nameSingular==='company').id;
const compFields = [
  { name:'siret', label:'SIRET', type:'TEXT' },
  { name:'financementSouhaite', label:'Financement souhaité', type:'SELECT',
    options:[
      { value:'OPCO',          label:'OPCO',                  color:'blue' },
      { value:'POLE_EMPLOI',   label:'Pôle Emploi',           color:'sky' },
      { value:'FRANCE_TRAVAIL',label:'France Travail',        color:'purple' },
      { value:'CPF',           label:'CPF',                   color:'pink' },
      { value:'FONDS_PROPRES', label:'Fonds propres',         color:'green' },
      { value:'AUTRE',         label:'Autre',                 color:'gray' },
    ]
  },
];
await refresh();
for (const f of compFields) {
  if (F('company', f.name)) { console.log('  skip company.'+f.name,'(exists)'); continue; }
  await api('POST','/rest/metadata/fields', { ...f, objectMetadataId: companyId });
  console.log('  + field company.'+f.name);
}
if (!F('company','formationSouhaitee')) {
  await api('POST','/rest/metadata/fields',{
    name:'formationSouhaitee', label:'Formation souhaitée', type:'RELATION',
    objectMetadataId: companyId,
    relationCreationPayload: {
      type:'MANY_TO_ONE',
      targetObjectMetadataId: O('testFormation').id,
      targetFieldLabel: 'Entreprises intéressées',
      targetFieldIcon: 'IconBuilding',
    },
  });
  console.log('  + rel company.formationSouhaitee → testFormation');
} else {
  console.log('  skip company.formationSouhaitee (exists)');
}

// ============= 9. Fix labels : testFormation.name → "Intitulé", new field labels FR =============
console.log('\n--- 9. Final label tweaks ---');
await refresh();
const fmName = F('testFormation','name');
if (fmName && fmName.label !== 'Intitulé') {
  await api('PATCH','/rest/metadata/fields/'+fmName.id, { label:'Intitulé', isLabelSyncedWithName:false });
  console.log('  testFormation.name label → Intitulé');
}
// Translate system fields on testOpportunite
const FR_SYS = { name:'Nom', attachments:'Pièces jointes', timelineActivities:'Activités', noteTargets:'Notes', taskTargets:'Tâches' };
const oppFieldsAll = fields.filter(f => f.objectMetadataId === oppId);
for (const [fname, frLabel] of Object.entries(FR_SYS)) {
  const f = oppFieldsAll.find(x => x.name === fname);
  if (f && f.label !== frLabel) {
    await api('PATCH','/rest/metadata/fields/'+f.id,{ label: frLabel, isLabelSyncedWithName:false });
    console.log('  testOpportunite.'+fname+' → '+frLabel);
  }
}

console.log('\n=== DONE ===');
