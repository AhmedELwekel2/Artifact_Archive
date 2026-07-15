import Link from "next/link";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const artifacts = await prisma.artifact.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { media: true } } },
  });

  return (
    <div>
      <header className="bar">
        <h1>Admin · Artifacts</h1>
        <Link className="btn" href="/admin/new">+ Add artifact</Link>
      </header>
      <div className="container">
        <div className="card">
          <table>
            <thead>
              <tr>
                <th>QR</th>
                <th>Name (EN)</th>
                <th>Name (AR)</th>
                <th>Category</th>
                <th>Links</th>
              </tr>
            </thead>
            <tbody>
              {artifacts.map((a) => (
                <tr key={a.id}>
                  <td><code>{a.qrCode}</code></td>
                  <td>{a.nameEn}</td>
                  <td dir="rtl">{a.nameAr}</td>
                  <td>{a.category ?? "—"}</td>
                  <td>
                    <Link href={`/artifact/${a.qrCode}`}>view</Link>{" · "}
                    <Link href={`/api/artifacts/${a.qrCode}/qr`}>QR</Link>
                  </td>
                </tr>
              ))}
              {artifacts.length === 0 && (
                <tr><td colSpan={5} style={{ color: "var(--muted)" }}>No artifacts yet. Add one.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
