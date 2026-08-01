// Add `montant` CURRENCY field on testOpportunite, backfill from formation.prix,
// show on the 3 Kanban cards.
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
  if (!r.ok) throw new Error(method+' '+path+' → '+r.status+' '+t.slice(0,500));
  return j;
}

const objs = (await api('GET','/rest/metadata/objects')).data;
const opp = objs.find(o => o.nameSingular === 'testOpportunite');

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

// 1. Create montant CURRENCY field on testOpportunite (if missing)
let oppFields = (await pagedFields()).filter(f => f.objectMetadataId === opp.id);
let montantField = oppFields.find(f => f.name === 'montant');
if (!montantField) {
  montantField = await api('POST','/rest/metadata/fields', {
    name: 'montant',
    label: 'Montant',
    type: 'CURRENCY',
    objectMetadataId: opp.id,
    description: "Reprend automatiquement le prix de la formation liée (synchronisé à la création/update).",
    defaultValue: { amountMicros: null, currencyCode: "'EUR'" },
  });
  console.log('+ field testOpportunite.montant (CURRENCY)');
} else {
  console.log('skip montant field (exists)');
}

// 2. Backfill: for each opportunity, read formation.prix and write opportunite.montant
const opps = (await api('GET','/rest/testOpportunites?limit=100')).data?.testOpportunites || [];
const formations = (await api('GET','/rest/testFormations?limit=100')).data?.testFormations || [];
const formationPrice = Object.fromEntries(formations.map(f => [f.id, f.prix]));
console.log('\nBackfilling montant on '+opps.length+' opportunities:');
for (const o of opps) {
  const price = o.formationId ? formationPrice[o.formationId] : null;
  if (price == null) { console.log('  -',o.name,'no formation/prix'); continue; }
  if (o.montant && o.montant.amountMicros) { console.log('  skip',o.name,'(montant set)'); continue; }
  await api('PATCH','/rest/testOpportunites/'+o.id, {
    montant: { amountMicros: price * 1_000_000, currencyCode: 'EUR' },
  });
  console.log('  +',o.name,'→ €'+price);
}

// 3. Add montant to the 3 Kanban view cards
const allViews = await api('GET','/rest/metadata/views');
const kanbanViews = allViews.filter(v => v.objectMetadataId === opp.id && v.type === 'KANBAN');
console.log('\nAdding montant to '+kanbanViews.length+' Kanban views:');
for (const v of kanbanViews) {
  const has = (v.viewFields||[]).some(vf => vf.fieldMetadataId === montantField.id);
  if (has) { console.log('  skip',v.name,'(already on card)'); continue; }
  await api('POST','/rest/metadata/viewFields', {
    viewId: v.id,
    fieldMetadataId: montantField.id,
    isVisible: true,
    size: 120,
    position: 4,
  });
  console.log('  +',v.name);
}

console.log('\n=== DONE ===');
console.log("Note: la synchro automatique montant ← formation.prix sera un workflow Twenty (à venir).");
console.log("Pour l'instant, à la création d'une opportunité dans l'UI, il faudra cliquer une fois sur le bouton 'Actualiser' (ou je relance ce script).");
