import Link from "next/link";
import { prisma } from "@/lib/db";
import { normalizeLang, dir, t, type Lang } from "@/lib/i18n";

type Params = { params: Promise<{ qr: string }>; searchParams: Promise<{ lang?: string }> };

function Field({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="field">
      <div className="label">{label}</div>
      <div className="value">{value}</div>
    </div>
  );
}

export default async function ArtifactPage({ params, searchParams }: Params) {
  const { qr } = await params;
  const { lang: langParam } = await searchParams;
  const lang: Lang = normalizeLang(langParam);
  const tr = t(lang);

  const artifact = await prisma.artifact.findUnique({
    where: { qrCode: qr },
    include: { media: { orderBy: { sortOrder: "asc" } } },
  });

  if (!artifact) {
    return (
      <div className="container">
        <div className="card">
          <h1 className="title">{tr.notFound}</h1>
          <p className="subtitle">{qr}</p>
          <Link className="btn" href="/">{tr.archive}</Link>
        </div>
      </div>
    );
  }

  const pick = (en?: string | null, ar?: string | null) =>
    (lang === "ar" ? ar : en) || en || ar || undefined;

  const images = artifact.media.filter((m) => m.type === "IMAGE" || m.type === "IMAGE_360");
  const otherLang = lang === "ar" ? "en" : "ar";

  return (
    <div dir={dir(lang)}>
      <header className="bar">
        <h1>{tr.archive}</h1>
        <Link href={`?lang=${otherLang}`}>{tr.switchLang}</Link>
      </header>

      <div className="container">
        <div className="card">
          <h1 className="title">{pick(artifact.nameEn, artifact.nameAr)}</h1>
          <p className="subtitle">
            {tr.artifactId}: {artifact.qrCode}
            {artifact.category ? ` · ${artifact.category}` : ""}
          </p>
          <p>{pick(artifact.publicDescriptionEn, artifact.publicDescriptionAr)
            ?? pick(artifact.descriptionEn, artifact.descriptionAr)}</p>
          {artifact.keywords.length > 0 && (
            <div>{artifact.keywords.map((k) => <span key={k} className="tag">{k}</span>)}</div>
          )}
        </div>

        {images.length > 0 && (
          <div className="card">
            <p className="section-title">{tr.media}</p>
            <div className="gallery">
              {images.map((m) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={m.id} src={m.url} alt={pick(m.captionEn, m.captionAr) ?? ""} />
              ))}
            </div>
          </div>
        )}

        <div className="card">
          <p className="section-title">{tr.historical}</p>
          <div className="grid">
            <Field label={tr.period} value={artifact.historicalPeriod} />
            <Field label={tr.date} value={artifact.date} />
            <Field label={tr.origin} value={artifact.origin} />
          </div>
          <p style={{ marginTop: 12 }}>
            {pick(artifact.historicalBackgroundEn, artifact.historicalBackgroundAr)}
          </p>
        </div>

        <div className="card">
          <p className="section-title">{tr.physical}</p>
          <div className="grid">
            <Field label={tr.dimensions} value={artifact.dimensions} />
            <Field label={tr.weight} value={artifact.weight} />
            <Field label={tr.material} value={artifact.material} />
            <Field label={tr.color} value={artifact.color} />
            <Field label={tr.condition} value={artifact.condition} />
          </div>
        </div>

        <div className="card">
          <p className="section-title">{tr.location}</p>
          <div className="grid">
            <Field label="Building" value={artifact.building} />
            <Field label="Floor" value={artifact.floor} />
            <Field label="Room" value={artifact.room} />
            <Field label="Display case" value={artifact.displayCase} />
            <Field label="Shelf" value={artifact.shelfPosition} />
          </div>
        </div>

        {artifact.audioTourUrl && (
          <div className="card">
            <p className="section-title">{tr.media}</p>
            <audio controls src={artifact.audioTourUrl} style={{ width: "100%" }} />
          </div>
        )}
      </div>
    </div>
  );
}
