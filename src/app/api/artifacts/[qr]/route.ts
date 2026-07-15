import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/artifacts/:qr -> single artifact with relations
export async function GET(_req: Request, { params }: { params: Promise<{ qr: string }> }) {
  const { qr } = await params;
  const artifact = await prisma.artifact.findUnique({
    where: { qrCode: qr },
    include: { media: true, conditionReports: true, movements: true, documents: true },
  });
  if (!artifact) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(artifact);
}
