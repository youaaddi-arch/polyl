#!/usr/bin/env bash
# Integration BOAMP reel dans agent-ao
# Cree les fichiers, teste l'API, commit et push.

set -e

V='\033[0;32m'; J='\033[0;33m'; R='\033[0;31m'; G='\033[1m'; N='\033[0m'
ok(){ echo -e "${V}OK${N} $1"; }
warn(){ echo -e "${J}!${N} $1"; }
fail(){ echo -e "${R}X${N} $1"; exit 1; }
titre(){ echo; echo -e "${G}=== $1 ===${N}"; }

cd ~/Projects/agent-ao || fail "Dossier ~/Projects/agent-ao introuvable"
source .venv/bin/activate || fail "venv introuvable, fais 'python3.11 -m venv .venv' d'abord"

titre "1/6 Creation src/sources/"
mkdir -p src/sources
touch src/sources/__init__.py
ok "src/sources/ cree"

titre "2/6 Creation cpv_formation.py"
cat > src/sources/cpv_formation.py <<'PYEOF'
"""Codes CPV (Common Procurement Vocabulary) lies a la formation/education.

Division 80 = Services d'education et de formation. Reference :
https://simap.ted.europa.eu/cpv

Note : pour BOAMP, on filtre par descripteur_libelle="Formation" qui est
plus fiable que les codes CPV (souvent absents ou imprecis). Cette liste
est conservee pour reference et pour cross-checking dans extraction.
"""

CPV_FORMATION = [
    "80100000", "80110000", "80130000",
    "80200000", "80210000", "80211000", "80212000",
    "80300000", "80310000", "80320000",
    "80400000", "80410000", "80411000", "80412000", "80413000",
    "80414000", "80415000", "80420000", "80422000", "80423000",
    "80424000",
    "80500000", "80510000", "80511000", "80512000", "80513000",
    "80520000", "80521000", "80522000", "80530000", "80531000",
    "80531100", "80531200", "80532000", "80533000", "80533100",
    "80533200", "80540000", "80550000", "80560000", "80561000",
    "80562000", "80570000", "80580000", "80590000",
    "80600000", "80610000", "80620000", "80630000", "80640000",
    "80650000", "80660000",
]
PYEOF
ok "cpv_formation.py cree"

titre "3/6 Creation boamp.py"
cat > src/sources/boamp.py <<'PYEOF'
"""Fetcher BOAMP via l'API Opendatasoft (publique, gratuite, sans auth).

Filtre par descripteur_libelle="Formation" - couvre 21k+ AO formation
historiques + nouveaux quotidiens (env. 50/semaine).

Doc API : https://boamp-datadila.opendatasoft.com/api/explore/v2.1/
"""
from __future__ import annotations
from datetime import datetime, timedelta
import httpx

from src.state import AOBrut

API_BASE = (
    "https://boamp-datadila.opendatasoft.com"
    "/api/explore/v2.1/catalog/datasets/boamp/records"
)


def fetch_boamp(jours: int = 7, limit_total: int = 100) -> list[AOBrut]:
    """Recupere les AO formation BOAMP des N derniers jours.

    Args:
        jours : profondeur historique (defaut 7)
        limit_total : nombre max d'AO (defaut 100)

    Returns:
        Liste d'AOBrut

    Raises:
        RuntimeError si API inaccessible.
    """
    date_min = (datetime.now() - timedelta(days=jours)).strftime("%Y-%m-%d")
    ao_bruts: list[AOBrut] = []
    offset = 0
    PAGE_SIZE = 100

    while len(ao_bruts) < limit_total:
        params = {
            "refine": "descripteur_libelle:Formation",
            "where": f"dateparution >= date'{date_min}'",
            "order_by": "dateparution desc",
            "limit": min(PAGE_SIZE, limit_total - len(ao_bruts)),
            "offset": offset,
        }
        try:
            r = httpx.get(API_BASE, params=params, timeout=30.0)
            r.raise_for_status()
        except (httpx.HTTPError, httpx.TimeoutException) as e:
            raise RuntimeError(f"BOAMP API error: {e}") from e

        data = r.json()
        results = data.get("results", [])
        if not results:
            break

        for rec in results:
            ao = _convert(rec)
            if ao is not None:
                ao_bruts.append(ao)

        if len(results) < PAGE_SIZE:
            break
        offset += PAGE_SIZE

    return ao_bruts


def _convert(rec: dict) -> AOBrut | None:
    """Convertit un record BOAMP en AOBrut."""
    idweb = rec.get("idweb")
    if not idweb:
        return None

    objet = (rec.get("objet") or "").strip()
    acheteur = (rec.get("nomacheteur") or "").strip()
    date_pub = rec.get("dateparution") or ""
    date_lim_raw = rec.get("datelimitereponse") or ""
    url = rec.get("url_avis") or f"https://www.boamp.fr/pages/avis/?q=idweb:{idweb}"

    if date_lim_raw:
        try:
            dt = datetime.fromisoformat(date_lim_raw.replace("Z", "+00:00"))
            date_lim = dt.strftime("%Y-%m-%d")
        except (ValueError, AttributeError):
            date_lim = date_lim_raw[:10]
    else:
        date_lim = (datetime.now() + timedelta(days=30)).strftime("%Y-%m-%d")

    parties = [
        f"Objet : {objet}" if objet else "",
        f"Acheteur : {acheteur}" if acheteur else "",
        f"Date publication : {date_pub}" if date_pub else "",
        f"Date limite reponse : {date_lim_raw}" if date_lim_raw else "",
        f"Source : BOAMP (idweb {idweb})",
        f"URL : {url}",
    ]
    nature = (rec.get("nature_libelle") or "").strip()
    if nature:
        parties.append(f"Nature : {nature}")
    procedure = (rec.get("procedure_libelle") or "").strip()
    if procedure:
        parties.append(f"Procedure : {procedure}")
    dept = rec.get("code_departement") or []
    if dept:
        dept_str = ", ".join(dept) if isinstance(dept, list) else str(dept)
        parties.append(f"Departements : {dept_str}")

    contenu = "\n".join(p for p in parties if p)

    return AOBrut(
        id=f"BOAMP-{idweb}",
        source="BOAMP",
        titre=objet[:200] if objet else f"AO BOAMP {idweb}",
        url=url,
        date_publication=date_pub or datetime.now().strftime("%Y-%m-%d"),
        date_limite=date_lim,
        contenu_brut=contenu,
    )
PYEOF
ok "boamp.py cree"

titre "4/6 Modification veille.py"
python <<'PYEOF'
from pathlib import Path
import re

p = Path("src/nodes/veille.py")
content = p.read_text(encoding="utf-8")

new_veille = '''def veille(state: AgentState) -> AgentState:
    mode = state.get("mode", "test")
    console.print(f"\\n[bold cyan]Noeud 1 - Veille[/bold cyan] (mode={mode})")

    if mode == "prod":
        try:
            from src.sources.boamp import fetch_boamp
            console.print("  [yellow]-> Recuperation BOAMP en cours...[/yellow]")
            ao_bruts = fetch_boamp(jours=7, limit_total=100)
            console.print(f"  -> [green]{len(ao_bruts)} AO BOAMP recuperes[/green]")
        except Exception as e:
            console.print(f"  [red]Erreur BOAMP: {e}[/red]")
            console.print("  [yellow]Fallback sur les mocks[/yellow]")
            ao_bruts = list(MOCK_AO)
    else:
        ao_bruts = list(MOCK_AO)
        console.print(f"  -> [green]{len(ao_bruts)} AO mockes[/green]")

    for ao in ao_bruts[:10]:
        console.print(f"    - [{ao.source}] {ao.id} - {ao.titre[:80]}")
    if len(ao_bruts) > 10:
        console.print(f"    ... et {len(ao_bruts)-10} autres")

    return {"ao_bruts": ao_bruts}
'''

pattern = re.compile(r'def veille\(state.*?(?=\Z|\n(?:def |class ))', re.DOTALL)
if pattern.search(content):
    content = pattern.sub(new_veille, content)
    p.write_text(content, encoding="utf-8")
    print("OK veille.py modifie")
else:
    p.write_text(content.rstrip() + "\n\n\n" + new_veille, encoding="utf-8")
    print("OK veille.py modifie (ajout en fin)")
PYEOF
ok "veille.py modifie"

titre "5/6 Test du fetch BOAMP (live)"
python -c "
from src.sources.boamp import fetch_boamp
print('Recuperation des AO formation BOAMP (14 derniers jours, limite 5)...')
ao = fetch_boamp(jours=14, limit_total=5)
print(f'>>> {len(ao)} AO recuperes <<<')
for a in ao:
    print(f'  [{a.source}] {a.id}')
    print(f'    Titre: {a.titre[:100]}')
    print(f'    Deadline: {a.date_limite}')
print()
print('OK BOAMP API fonctionne')
"

titre "6/6 Commit + push"
git add -A
echo "Fichiers modifies/ajoutes :"
git status --short
git commit -m "feat: integration BOAMP Opendatasoft API (descripteur_libelle:Formation, ~50 AO/sem)"
git push

echo
echo -e "${V}${G}========================================${N}"
echo -e "${V}${G}  BOAMP INTEGRE ET PUSHE !${N}"
echo -e "${V}${G}========================================${N}"
echo
echo "Pour lancer avec les VRAIS AO formation :"
echo -e "  ${G}python -m src.agent run --mode prod${N}"
echo
echo "(coute ~2-5 EUR car ~50 AO * 5 appels Claude chacun)"
echo
echo "Pour le dashboard :"
echo -e "  ${G}streamlit run dashboard.py${N}"
