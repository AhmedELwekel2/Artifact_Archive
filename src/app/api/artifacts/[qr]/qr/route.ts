import QRCode from "qrcode";

// GET /api/artifacts/:qr/qr -> PNG QR code that points at the public page.
export async function GET(_req: Request, { params }: { params: Promise<{ qr: string }> }) {
  const { qr } = await params;
  const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const target = `${base}/artifact/${qr}`;
  const png = await QRCode.toBuffer(target, { width: 512, margin: 2 });
  return new Response(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Content-Disposition": `inline; filename="${qr}.png"`,
    },
  });
}
