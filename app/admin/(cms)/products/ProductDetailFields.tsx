"use client";

import { useState } from "react";
import { Field, TextArea } from "@/components/admin/Field";
import type { Category, Product } from "@prisma/client";

export function ProductDetailFields({
  categories,
  product,
  claimBotUrl,
}: {
  categories: Category[];
  product?: Product;
  claimBotUrl?: string;
}) {
  // Kalau belum ada kategori sama sekali (situs baru), dropdown cuma punya
  // opsi "+ Kategori baru..." dan browser otomatis memilihnya — state ini
  // harus ikut mulai true, atau input "Nama Kategori Baru" tidak muncul
  // padahal formData categoryId sudah "__new__".
  const [newCategory, setNewCategory] = useState(categories.length === 0);

  return (
    <>
      <Field label="Nama Produk" name="name" defaultValue={product?.name} required />

      <label className="block">
        <span className="mb-1 block text-sm font-semibold text-ink">Kategori</span>
        <select
          name="categoryId"
          defaultValue={product?.categoryId ?? categories[0]?.id}
          onChange={(e) => setNewCategory(e.target.value === "__new__")}
          className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-maroon"
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
          <option value="__new__">+ Kategori baru…</option>
        </select>
      </label>

      {newCategory && (
        <Field label="Nama Kategori Baru" name="newCategoryName" required />
      )}
      {!newCategory && <input type="hidden" name="newCategoryName" value="" />}

      <label className="flex items-center gap-2 text-sm font-semibold text-ink">
        <input type="checkbox" name="active" defaultChecked={product?.active ?? true} className="h-4 w-4 accent-maroon" />
        Aktif (tampil di situs publik)
      </label>

      <TextArea
        label="Deskripsi Produk"
        name="description"
        defaultValue={product?.description}
        required
        rows={5}
        hint="Mendukung Markdown. Tulis semuanya di sini — apa produknya, benefit, cocok untuk siapa, device yang didukung, dll."
      />
      <TextArea
        label="Syarat dan Ketentuan Produk"
        name="terms"
        defaultValue={product?.terms}
        required
        rows={4}
        hint="Ditampilkan di halaman Ketentuan & Garansi saat produk ini dipilih."
      />
      <TextArea
        label="Kendala & Solusi"
        name="troubleshooting"
        defaultValue={product?.troubleshooting}
        rows={4}
        hint="Contoh: '**Gagal login?** Cek email/password persis huruf besar-kecil.' — satu kendala per paragraf."
      />
      <div>
        <TextArea label="Panduan Garansi" name="warrantyPolicy" defaultValue={product?.warrantyPolicy} rows={4} />
        {claimBotUrl && (
          <a href={claimBotUrl} target="_blank" rel="noopener noreferrer" className="mt-1.5 inline-block text-xs font-semibold text-maroon">
            → Buka Bot Klaim Garansi (untuk dicek/dites)
          </a>
        )}
      </div>
    </>
  );
}
