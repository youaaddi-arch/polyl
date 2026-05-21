import { NextRequest, NextResponse } from "next/server";
import { chercherEmailsParDomaine, hunterConfigure, estContactRH } from "@/lib/hunter";

export async function GET(req: NextRequest) {
  if (!hunterConfigure()) {
    return NextResponse.json(
      { error: "Hunter.io non configuré. Ajoute HUNTER_API_KEY dans .env (gratuit après inscription sur hunter.io)" },
      { status: 400 },
    );
  }

  const domain = req.nextUrl.searchParams.get("domain") ?? "";
  if (!domain) return NextResponse.json({ error: "domain requis" }, { status: 400 });

  try {
    const contacts = await chercherEmailsParDomaine(domain);
    // Trie : RH/Formation d'abord, puis Direction, puis le reste, par confiance décroissante
    contacts.sort((a, b) => {
      const aRH = estContactRH(a) ? 0 : a.service === "Direction" ? 1 : 2;
      const bRH = estContactRH(b) ? 0 : b.service === "Direction" ? 1 : 2;
      if (aRH !== bRH) return aRH - bRH;
      return b.confiance - a.confiance;
    });
    return NextResponse.json({ contacts });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Erreur Hunter" }, { status: 500 });
  }
}
