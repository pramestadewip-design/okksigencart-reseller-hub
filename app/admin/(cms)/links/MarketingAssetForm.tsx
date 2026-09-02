"use client";

import { useState } from "react";
import { upload } from "@vercel/blob/client";
import { Field, Select, TextArea } from "@/components/admin/Field";
import { addMarketingAsset } from "./actions";

const MARKETING_TYPE_LABEL: Record<string, string> = {
  POSTER: "Poster",
  CAPTION: "Caption",
  BANNER: "Banner",
  IDEA: "Ide",
};

export function MarketingAssetForm() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    const file = formData.get("file") as File | null;

    setUploading(true);
    try {
      if (file && file.size > 0) {
        const blob = await upload(file.name, file, {
          access: "public",
          handleUploadUrl: "/api/marketing-upload",
        });
        formData.set("fileUrl", blob.url);
      }
      formData.delete("file");
      await addMarketingAsset(formData);
    } catch (err) {
      // redirect() dari Server Action muncul sebagai "error" khusus Next.js
      // (digest diawali "NEXT_REDIRECT") — biarkan lewat supaya navigasinya
      // tetap jalan normal, jangan ditangkap sebagai error asli.
      const digest = (err as { digest?: string })?.digest;
      if (digest?.startsWith("NEXT_REDIRECT")) throw err;
      setError(err instanceof Error ? err.message : "Gagal mengunggah file.");
      setUploading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3 rounded-md border border-line p-4">
      <div className="text-sm font-semibold text-ink">Tambah Materi</div>
      {error && <p className="text-sm text-maroon">{error}</p>}
      <Select
        label="Tipe"
        name="type"
        defaultValue="POSTER"
        options={Object.entries(MARKETING_TYPE_LABEL).map(([value, label]) => ({ value, label }))}
      />
      <Field label="Judul" name="title" required />
      <label className="block">
        <span className="mb-1 block text-sm font-semibold text-ink">File Gambar (opsional)</span>
        <input
          type="file"
          name="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm file:mr-3 file:rounded file:border-0 file:bg-paper file:px-2.5 file:py-1 file:text-xs file:font-semibold"
        />
      </label>
      <TextArea label="Isi Caption (opsional)" name="content" rows={2} />
      <button
        type="submit"
        disabled={uploading}
        className="rounded-md bg-maroon px-4 py-2 text-sm font-semibold text-white hover:bg-maroon-dark disabled:cursor-not-allowed disabled:opacity-50"
      >
        {uploading ? "Mengunggah..." : "Tambah"}
      </button>
    </form>
  );
}
