import { PrismaClient } from "@prisma/client";
import { ENTITES } from "../src/lib/entites";
import { CATALOGUE } from "../src/lib/formations-catalogue";

const prisma = new PrismaClient();

async function main() {
  console.log("Seed: nettoyage…");
  await prisma.communication.deleteMany();
  await prisma.document.deleteMany();
  await prisma.tache.deleteMany();
  await prisma.contrat.deleteMany();
  await prisma.actionFormation.deleteMany();
  await prisma.offreAlternance.deleteMany();
  await prisma.contact.deleteMany();
  await prisma.evenement.deleteMany();
  await prisma.candidat.deleteMany();
  await prisma.entreprise.deleteMany();
  await prisma.formation.deleteMany();
  await prisma.entite.deleteMany();
  await prisma.veille.deleteMany();

  console.log("Seed: 6 entités du groupe…");
  const entites: Record<string, string> = {};
  for (const e of ENTITES) {
    const created = await prisma.entite.create({ data: e });
    entites[e.code] = created.id;
  }

  console.log("Seed: catalogue formations…");
  for (const f of CATALOGUE) {
    await prisma.formation.create({
      data: {
        intitule: f.intitule,
        niveau: f.niveau,
        type: f.type,
        voieAcces: f.voieAcces,
        secteurs: f.secteurs,
        metiers: f.metiers,
        dureeMois: f.dureeMois,
        entiteId: entites[f.entiteCode],
        financements: "OPCO, CPF, France Travail, employeur",
      },
    });
  }

  console.log("Seed: candidats de démonstration…");
  const formations = await prisma.formation.findMany();
  const fByCode = (code: string, level?: string) =>
    formations.find((f) => f.entiteId === entites[code] && (!level || f.niveau.includes(level)));

  const demoCandidats = [
    { prenom: "Léa",     nom: "Martin",    persona: "C1", entite: "PBA",   formation: fByCode("PBA"),   etape: 3,  ville: "Paris" },
    { prenom: "Yanis",   nom: "Bouhamed",  persona: "C1", entite: "PNFF",  formation: fByCode("PNFF"),  etape: 7,  ville: "Saint-Denis" },
    { prenom: "Sarah",   nom: "Diop",      persona: "C2", entite: "DBS",   formation: fByCode("DBS","Bac+2"), etape: 9,  ville: "Lyon" },
    { prenom: "Thomas",  nom: "Lefèvre",   persona: "C3", entite: "PNBS",  formation: fByCode("PNBS","Bac+5"), etape: 11, ville: "Paris" },
    { prenom: "Inès",    nom: "Garcia",    persona: "C2", entite: "ORCEA", formation: fByCode("ORCEA","Bac"),  etape: 13, ville: "Amiens" },
    { prenom: "Kevin",   nom: "Petit",     persona: "C1", entite: "PNFB",  formation: fByCode("PNFB"),  etape: 15, ville: "Paris" },
    { prenom: "Aïcha",   nom: "Koné",      persona: "C2", entite: "PBA",   formation: fByCode("PBA"),   etape: 5,  ville: "Bobigny" },
    { prenom: "Romain",  nom: "Dubois",    persona: "C3", entite: "DBS",   formation: fByCode("DBS","Bac+5"),  etape: 8,  ville: "Paris" },
  ];

  for (const c of demoCandidats) {
    await prisma.candidat.create({
      data: {
        prenom: c.prenom,
        nom: c.nom,
        email: `${c.prenom.toLowerCase()}.${c.nom.toLowerCase()}@example.com`,
        telephone: "06 12 34 56 78",
        ville: c.ville,
        persona: c.persona,
        etapePipeline: c.etape,
        statut: c.etape >= 13 ? "place" : "en_cours",
        sourceEntree: "Formulaire site web",
        entiteId: entites[c.entite],
        formationId: c.formation?.id,
        scorePositionnement: 60 + Math.floor(Math.random() * 40),
      },
    });
  }

  console.log("Seed: entreprises de démonstration…");
  const demoEntreprises = [
    { raison: "Boulangerie Augustin",      siret: "12345678900011", taille: "PME", persona: "E1", secteur: "Restauration",   ville: "Paris",       etape: 3,  entite: "PNFF" },
    { raison: "Carrefour Express Lyon 6",  siret: "23456789000022", taille: "GE",  persona: "E3", secteur: "Distribution",    ville: "Lyon",        etape: 8,  entite: "DBS"  },
    { raison: "Maison Sephora — Paris",    siret: "34567890000033", taille: "ETI", persona: "E3", secteur: "Cosmétique",      ville: "Paris",       etape: 12, entite: "PBA"  },
    { raison: "Crèche Les P'tits Pas",     siret: "45678900000044", taille: "PME", persona: "E1", secteur: "Petite enfance",  ville: "Saint-Denis", etape: 5,  entite: "PBA"  },
    { raison: "BTP Construct SARL",        siret: "56789000000055", taille: "PME", persona: "E1", secteur: "Bâtiment",        ville: "Paris",       etape: 10, entite: "PNFB" },
    { raison: "Hôtel Marriott Champs",     siret: "67890000000066", taille: "ETI", persona: "E3", secteur: "Hôtellerie",      ville: "Paris",       etape: 15, entite: "PNFF" },
    { raison: "Decathlon Amiens",          siret: "78900000000077", taille: "GE",  persona: "E2", secteur: "Distribution",    ville: "Amiens",      etape: 16, entite: "ORCEA"},
    { raison: "Cabinet Conseil Pro",       siret: "89000000000088", taille: "PME", persona: "E2", secteur: "Conseil",         ville: "Paris",       etape: 6,  entite: "PNBS" },
  ];

  for (const e of demoEntreprises) {
    const ent = await prisma.entreprise.create({
      data: {
        raisonSociale: e.raison,
        siret: e.siret,
        taille: e.taille,
        persona: e.persona,
        secteur: e.secteur,
        ville: e.ville,
        etapePipeline: e.etape,
        statut: e.etape >= 15 ? "partenaire_actif" : "prospect",
        scorePotentiel: 50 + Math.floor(Math.random() * 50),
        sourceDetection: ["Indeed", "France Travail", "LinkedIn Jobs", "HelloWork"][Math.floor(Math.random()*4)],
        entiteId: entites[e.entite],
      },
    });
    await prisma.contact.create({
      data: {
        prenom: "Marie",
        nom: "Dupont",
        email: `contact@${e.raison.toLowerCase().replace(/[^a-z0-9]/g, "")}.fr`,
        telephone: "01 23 45 67 89",
        fonction: e.taille === "PME" ? "Dirigeant" : "Responsable RH",
        entrepriseId: ent.id,
      },
    });
  }

  console.log("Seed: tâches commerciales…");
  const candidats = await prisma.candidat.findMany();
  const entreprises = await prisma.entreprise.findMany();

  for (const c of candidats.slice(0, 4)) {
    await prisma.tache.create({
      data: {
        titre: `Appel de qualification — ${c.prenom} ${c.nom}`,
        type: "appel",
        priorite: "haute",
        candidatId: c.id,
        echeance: new Date(Date.now() + 24 * 3600 * 1000),
      },
    });
  }
  for (const e of entreprises.slice(0, 4)) {
    await prisma.tache.create({
      data: {
        titre: `Suivi commercial — ${e.raisonSociale}`,
        type: "email",
        priorite: "normale",
        entrepriseId: e.id,
        echeance: new Date(Date.now() + 48 * 3600 * 1000),
      },
    });
  }

  console.log("Seed: événements…");
  await prisma.evenement.create({
    data: {
      titre: "Job Dating Commerce — Paris",
      type: "job_dating",
      date: new Date(Date.now() + 14 * 24 * 3600 * 1000),
      lieu: "DBS Paris — 75009",
      entiteId: entites["DBS"],
    },
  });
  await prisma.evenement.create({
    data: {
      titre: "Journée d'information collective — Petite Enfance",
      type: "jic",
      date: new Date(Date.now() + 7 * 24 * 3600 * 1000),
      lieu: "PBA Paris",
      entiteId: entites["PBA"],
    },
  });

  console.log("Seed: veille réglementaire…");
  await prisma.veille.createMany({
    data: [
      { titre: "Revalorisation des aides employeur pour l'apprentissage 2025", source: "Ministère du Travail", theme: "Aides", niveauImpact: "important" },
      { titre: "Nouveau RNCP — Titre Conseiller Commercial mis à jour",       source: "France Compétences",  theme: "RNCP",  niveauImpact: "info" },
      { titre: "Barèmes OCAPIAT 2025 publiés",                                source: "OPCO OCAPIAT",        theme: "OPCO",  niveauImpact: "important" },
    ],
  });

  console.log("✅ Seed terminé.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
