// 1. Add 'domaine' SELECT field on testFormation (13 options from catalogue.json)
// 2. Import 8 titres professionnels (RNCP) as testFormation modalite=FC_DIPLOMANTE
// 3. Backfill 'domaine' on all existing formations based on code prefix or name
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

const CAT = JSON.parse(fs.readFileSync('/home/user/formation-ia-site/src/data/catalogue.json','utf8'));
const TP  = JSON.parse(fs.readFileSync('/home/user/formation-ia-site/src/data/titres-pros.json','utf8'));

// Map code prefix → domaine id (from programmes.json keys like 'ia-01' / 'mgt-03')
const PREFIX_TO_DOMAINE = {
  'IA':'IA', 'MGT':'MANAGEMENT', 'COM':'COMMERCE', 'RH':'RH', 'BUR':'BUREAUTIQUE',
  'CYB':'CYBER', 'ANG':'ANGLAIS', 'SEC':'SECURITE', 'BTP':'BTP', 'ELE':'ELECTRICITE',
  'EST':'ESTHETIQUE', 'HCR':'HCR', 'INC':'INCLUSION',
};
const COLOR = ['blue','sky','purple','pink','orange','yellow','green','red','gray'];

// ----- 1. Add 'domaine' SELECT field if missing -----
const objs = (await api('GET','/rest/metadata/objects')).data;
const fmObj = objs.find(o => o.nameSingular === 'testFormation');

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
const fmFields = (await pagedFields()).filter(f => f.objectMetadataId === fmObj.id);
let domaineField = fmFields.find(f => f.name === 'domaine');
if (!domaineField) {
  domaineField = await api('POST','/rest/metadata/fields', {
    name: 'domaine',
    label: 'Domaine',
    type: 'SELECT',
    objectMetadataId: fmObj.id,
    options: CAT.domaines.map((d,i) => ({
      value: d.id.toUpperCase(),
      label: d.nom,
      color: COLOR[i % COLOR.length],
      position: i,
    })),
  });
  console.log('+ field testFormation.domaine (SELECT, '+CAT.domaines.length+' domaines)');
} else {
  console.log('skip domaine field (exists)');
}

// ----- 2. Import 8 titres professionnels -----
async function allFormations() {
  let all=[], cursor=null;
  while(true){
    const url = '/rest/testFormations?limit=100&order_by=createdAt[AscNullsFirst]'
      + (cursor?`&filter=createdAt[gt]:${encodeURIComponent(cursor)}`:'');
    const r = await api('GET', url);
    const arr = r.data?.testFormations || [];
    if(!arr.length) break;
    all = all.concat(arr);
    if(arr.length<100) break;
    cursor = arr[arr.length-1].createdAt;
  }
  return all;
}
let existing = await allFormations();
const existingNames = new Set(existing.map(f => f.name));

const NIVEAU_MAP = { 4:'BAC', 5:'BAC_PLUS_2', 6:'BAC_PLUS_3', 7:'BAC_PLUS_5', 8:'BAC_PLUS_5' };
const TITRE_DOMAINE = { // map titre.tag → domaine value
  'Tech':'IA',     // closest match in catalog (no dedicated Tech)
  'RH':'RH',
  'Commerce':'COMMERCE',
  'Comptabilité':'RH',  // approx, no Compta domain
  'Management':'MANAGEMENT',
};

console.log('\n--- Importing 8 titres pros ---');
let added = 0;
for (const t of TP.titres) {
  if (existingNames.has(t.titre)) { console.log('  skip',t.titre,'(exists)'); continue; }
  const objectifs = (t.objectifs_pedagogiques||[]).slice(0,3).map(o=>'• '+o).join('\n') || t.description?.slice(0,400) || '';
  const payload = {
    name: t.titre,
    code: t.code_rncp,
    rncpCode: t.code_rncp,
    prix: t.tarif_ht || 0,
    duree: t.duree + (t.duree_heures ? ` (${t.duree_heures}h)` : ''),
    objectifs,
    niveau: NIVEAU_MAP[t.niveau_code] || 'BAC_PLUS_2',
    modalite: 'FC_DIPLOMANTE',
    actif: true,
    domaine: TITRE_DOMAINE[t.tag] || null,
  };
  try {
    await api('POST','/rest/testFormations', payload);
    added++;
    console.log('  +',t.titre,'('+t.code_rncp+', €'+(t.tarif_ht||0)+')');
  } catch (e) {
    console.log('  FAIL',t.titre,'→',e.message.slice(0,200));
  }
}
console.log('Titres ajoutés:', added);

// ----- 3. Backfill domaine on existing formations from code prefix -----
existing = await allFormations(); // refresh
console.log('\n--- Backfilling domaine on '+existing.length+' formations ---');
let updated = 0, skipped = 0;
for (const f of existing) {
  if (f.domaine) { skipped++; continue; }
  if (!f.code) continue;
  const prefix = f.code.split('-')[0].toUpperCase();
  const dom = PREFIX_TO_DOMAINE[prefix];
  if (!dom) continue;
  try {
    await api('PATCH','/rest/testFormations/'+f.id, { domaine: dom });
    updated++;
  } catch (e) {
    console.log('  FAIL',f.name,'→',e.message.slice(0,200));
  }
}
console.log('Updated:', updated, '| Already set:', skipped);

console.log('\n=== DONE ===');
