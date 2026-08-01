// Import all 110 formations from formation-ia-site/src/data/programmes.json
// into testFormation. modalite='FC_COURTE', niveau='NON_DIPLOMANTE'.
// Idempotent: skips formations whose 'name' already exists.
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

const SRC = JSON.parse(fs.readFileSync('/home/user/formation-ia-site/src/data/programmes.json','utf8'));
const programmes = SRC.programmes;
console.log('Source: '+Object.keys(programmes).length+' formations');

// Existing formations (paginate via order_by + GT cursor on createdAt)
async function allExisting() {
  let all=[], lastCursor=null;
  while(true){
    const url = '/rest/testFormations?limit=100&order_by=createdAt[AscNullsFirst]'
      + (lastCursor?`&filter=createdAt[gt]:${encodeURIComponent(lastCursor)}`:'');
    const r = await api('GET', url);
    const arr = r.data?.testFormations || [];
    if(!arr.length) break;
    all = all.concat(arr);
    if(arr.length<100) break;
    lastCursor = arr[arr.length-1].createdAt;
  }
  return all;
}
const existing = await allExisting();
const existingNames = new Set(existing.map(f => f.name));
console.log('Already in CRM: '+existing.length+' formations');

let added = 0, skipped = 0, failed = 0;
for (const [code, p] of Object.entries(programmes)) {
  const name = p.nom;
  if (existingNames.has(name)) { skipped++; continue; }
  const heures = p.duree?.heures ?? null;
  const jours  = p.duree?.jours ?? null;
  const duree  = (jours && heures) ? `${jours}j / ${heures}h` : (heures ? `${heures}h` : (jours ? `${jours}j` : ''));
  const objectifs = (Array.isArray(p.objectifs_pedagogiques) && p.objectifs_pedagogiques.length)
    ? p.objectifs_pedagogiques.slice(0,3).map(o => '• '+o).join('\n')
    : (p.accroche || '');
  const payload = {
    name,
    code: code.toUpperCase(),
    prix: p.tarif_ht || 0,
    duree,
    objectifs,
    niveau: 'NON_DIPLOMANTE',
    modalite: 'FC_COURTE',
    actif: true,
  };
  try {
    await api('POST','/rest/testFormations', payload);
    added++;
    if (added % 10 === 0) console.log('  ... '+added+' ajoutées');
  } catch (e) {
    failed++;
    console.log('  FAIL '+name+' →', e.message.slice(0,200));
  }
}

console.log('\n=== DONE ===');
console.log('Added :',added);
console.log('Skipped:',skipped,'(already present)');
console.log('Failed :',failed);
