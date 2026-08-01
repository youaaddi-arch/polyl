// Simplify the sidebar per Yousra's request:
// KEEP: testApprenant, testOpportunite, testFormation, testOffreAlternance
//      + natives (company, person, tasks, dashboards, inbox, calendar, notifications)
// DELETE: testEntite, testActionDeFormation, testContrat, testDossierFinancement,
//         testDocumentApprenant
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
const allFields = await pagedFields();
const F = (objName, fName) => {
  const o = O(objName);
  if (!o) return null;
  return allFields.find(f => f.objectMetadataId === o.id && f.name === fName);
};

// Step 1: drop relations on kept objects that point to doomed ones
const RELATIONS_TO_DROP = [
  ['testApprenant',     'entite'],
  ['testApprenant',     'contrats'],
  ['testApprenant',     'dossiersDeFinancement'],
  ['testApprenant',     'documents'],
  ['testFormation',     'entite'],
  ['testFormation',     'actionsDeFormation'],
  ['testOpportunite',   'entite'],
  ['testOffreAlternance','entite'],
  ['company',           'contratsAlternants'],
  ['company',           'nbContratsSignes'],   // denormalized counter (delete with contrats)
];

console.log('--- Step 1: drop dependent relations ---');
for (const [obj, fname] of RELATIONS_TO_DROP) {
  const f = F(obj, fname);
  if (!f) { console.log('  skip',obj+'.'+fname,'(not found)'); continue; }
  try {
    await api('DELETE','/rest/metadata/fields/'+f.id);
    console.log('  -',obj+'.'+fname);
  } catch (e) {
    console.log('  FAIL',obj+'.'+fname,'→',e.message.slice(0,160));
  }
}

// Step 2: delete the 5 doomed objects
const DOOMED = ['testEntite','testActionDeFormation','testContrat','testDossierFinancement','testDocumentApprenant'];
console.log('\n--- Step 2: delete objects ---');
for (const name of DOOMED) {
  const o = O(name);
  if (!o) { console.log('  skip',name,'(not found)'); continue; }
  // First, soft-delete: deactivate so it's gone from sidebar immediately
  try {
    await api('PATCH','/rest/metadata/objects/'+o.id, { isActive: false });
    await api('DELETE','/rest/metadata/objects/'+o.id);
    console.log('  -',name);
  } catch (e) {
    console.log('  FAIL',name,'→',e.message.slice(0,200));
  }
}

console.log('\n=== DONE ===');
console.log('Sidebar after this run will show:');
console.log('  Natives: Entreprises (company), Personnes (person), Tâches, Notes, Dashboard, etc.');
console.log('  Custom : [TEST] Apprenants, [TEST] Opportunités, [TEST] Formations, [TEST] Offres alternance');
