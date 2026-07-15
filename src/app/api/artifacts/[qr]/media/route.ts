import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/db";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const MAX_BYTES = 15 * 1024 * 1024; // 15 MB
const ALLOWED: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/avif": ".avif",
};

// GET /api/artifacts/:qr/media -> list media for an artifact
export async function GET(_req: Request, { params }: { params: Promise<{ qr: string }> }) {
  const { qr } = await params;
  const artifact = await prisma.artifact.findUnique({
    where: { qrCode: qr },
    include: { media: { orderBy: { sortOrder: "asc" } } },
  });
  if (!artifact) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(artifact.media);
}

// POST /api/artifacts/:qr/media -> upload an image file and attach it to the artifact.
// Expects multipart/form-data with fields: file (required), captionEn, captionAr (optional).
export async function POST(req: Request, { params }: { params: Promise<{ qr: string }> }) {
  const { qr } = await params;

  const artifact = await prisma.artifact.findUnique({ where: { qrCode: qr } });
  if (!artifact) return NextResponse.json({ error: "Artifact not found" }, { status: 404 });

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File too large (max 15 MB)" }, { status: 413 });
  }
  const ext = ALLOWED[file.type];
  if (!ext) {
    return NextResponse.json(
      { error: "Unsupported file type. Use JPG, PNG, WebP, GIF or AVIF." },
      { status: 415 },
    );
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const filename = `${qr}-${randomUUID()}${ext}`;
  await mkdir(UPLOAD_DIR, { recursive: true });
  await writeFile(path.join(UPLOAD_DIR, filename), bytes);

  // Public URL served by Next from the /public folder.
  const url = `/uploads/${filename}`;

  // Append after any existing media.
  const last = await prisma.media.findFirst({
    where: { artifactId: artifact.id },
    orderBy: { sortOrder: "desc" },
  });

  const media = await prisma.media.create({
    data: {
      artifactId: artifact.id,
      type: "IMAGE",
      url,
      captionEn: (form.get("captionEn") as string) || null,
      captionAr: (form.get("captionAr") as string) || null,
      sortOrder: (last?.sortOrder ?? -1) + 1,
    },
  });

  return NextResponse.json(media, { status: 201 });
}
