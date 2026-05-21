import { NextRequest, NextResponse } from "next/server";
import { chercherEntreprisesParNom } from "@/lib/insee";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") ?? "";
  const results = await chercherEntreprisesParNom(q, 10);
  return NextResponse.json({ results });
}
