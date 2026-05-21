import { NextRequest, NextResponse } from "next/server";
import { chercherEntrepriseParSiret } from "@/lib/insee";

export async function GET(req: NextRequest) {
  const siret = req.nextUrl.searchParams.get("siret") ?? "";
  const data = await chercherEntrepriseParSiret(siret);
  if (!data) return NextResponse.json({ found: false }, { status: 404 });
  return NextResponse.json({ found: true, entreprise: data });
}
