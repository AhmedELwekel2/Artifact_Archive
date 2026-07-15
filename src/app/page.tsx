import Link from "next/link";

export default function Home() {
  return (
    <div className="container">
      <div className="card">
        <h1 className="title">Artifact Digital Archive</h1>
        <p className="subtitle">
          Scan an artifact&apos;s QR code with your phone camera to open its page,
          or browse the archive below.
        </p>
        <p>
          <Link className="btn" href="/admin">Admin dashboard</Link>{" "}
          <Link className="btn secondary" href="/admin">Browse artifacts</Link>
        </p>
        <p style={{ color: "var(--muted)", fontSize: ".9rem" }}>
          A QR code encodes a URL like <code>/artifact/art-0001</code>. When scanned,
          the phone opens that page and the app loads the artifact from PostgreSQL.
        </p>
      </div>
    </div>
  );
}
