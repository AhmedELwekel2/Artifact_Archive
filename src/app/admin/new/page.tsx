"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewArtifact() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    const body = Object.fromEntries(form.entries());
    // The image file is handled separately (multipart), not as JSON.
    const image = form.get("image") as File | null;
    delete (body as any).image;
    // keywords: comma-separated -> array
    (body as any).keywords = String(body.keywords || "")
      .split(",").map((s) => s.trim()).filter(Boolean);

    const res = await fetch("/api/artifacts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      setSaving(false);
      setError((await res.json()).error ?? "Failed to save");
      return;
    }
    const a = await res.json();

    // If a picture was chosen, upload it and attach it to the new artifact.
    if (image && image.size > 0) {
      const fd = new FormData();
      fd.append("file", image);
      const up = await fetch(`/api/artifacts/${a.qrCode}/media`, { method: "POST", body: fd });
      if (!up.ok) {
        setSaving(false);
        setError("Artifact saved, but image upload failed: " + ((await up.json()).error ?? "unknown"));
        return;
      }
    }

    setSaving(false);
    router.push(`/artifact/${a.qrCode}`);
  }

  return (
    <div>
      <header className="bar"><h1>Add artifact</h1></header>
      <div className="container">
        <div className="card">
          <form className="stack" onSubmit={onSubmit}>
            <label className="f">QR code / slug (unique)
              <input name="qrCode" required placeholder="art-0001" />
            </label>
            <label className="f">Name (English)
              <input name="nameEn" required placeholder="Bronze oil lamp" />
            </label>
            <label className="f">Name (Arabic)
              <input name="nameAr" required dir="rtl" placeholder="مصباح زيت برونزي" />
            </label>
            <label className="f">Category
              <input name="category" placeholder="Lighting / Pottery / ..." />
            </label>
            <label className="f">Public description (English)
              <textarea name="publicDescriptionEn" rows={3} />
            </label>
            <label className="f">Public description (Arabic)
              <textarea name="publicDescriptionAr" rows={3} dir="rtl" />
            </label>
            <label className="f">Keywords (comma separated)
              <input name="keywords" placeholder="bronze, roman, lamp" />
            </label>
            <label className="f">Historical period
              <input name="historicalPeriod" placeholder="Roman period" />
            </label>
            <label className="f">Material
              <input name="material" placeholder="Bronze" />
            </label>
            <label className="f">Picture (optional)
              <input name="image" type="file" accept="image/*" />
            </label>
            {error && <p style={{ color: "#b00" }}>{error}</p>}
            <button className="btn" disabled={saving}>{saving ? "Saving…" : "Save artifact"}</button>
          </form>
        </div>
      </div>
    </div>
  );
}
