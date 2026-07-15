import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/artifacts  -> list
export async function GET() {
  const artifacts = await prisma.artifact.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(artifacts);
}

// POST /api/artifacts -> create
export async function POST(req: Request) {
  try {
    const data = await req.json();
    if (!data.qrCode || !data.nameEn || !data.nameAr) {
      return NextResponse.json({ error: "qrCode, nameEn and nameAr are required" }, { status: 400 });
    }
    const artifact = await prisma.artifact.create({
      data: {
        qrCode: data.qrCode,
        nameEn: data.nameEn,
        nameAr: data.nameAr,
        category: data.category || null,
        publicDescriptionEn: data.publicDescriptionEn || null,
        publicDescriptionAr: data.publicDescriptionAr || null,
        keywords: Array.isArray(data.keywords) ? data.keywords : [],
        historicalPeriod: data.historicalPeriod || null,
        material: data.material || null,
      },
    });
    return NextResponse.json(artifact, { status: 201 });
  } catch (e: any) {
    if (e?.code === "P2002") {
      return NextResponse.json({ error: "That QR code already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
