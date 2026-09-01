"use client";

import { useState } from "react";
import { Field, TextArea } from "@/components/admin/Field";
import type { Category, Product } from "@prisma/client";

export function ProductDetailFields({
  categories,
  product,
}: {
  categories: Category[];
  product?: Product;
}) {
  const [newCategory, setNewCategory] = useState(false);

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

      <TextArea label="Apa produk ini? (description)" name="description" defaultValue={product?.description} required rows={3} hint="Mendukung Markdown." />
      <TextArea label="Benefit utama" name="benefits" defaultValue={product?.benefits} required rows={3} hint="Mendukung Markdown — satu poin per baris dengan '- '." />
      <TextArea label="Cocok untuk siapa? (audience)" name="audience" defaultValue={product?.audience} required rows={2} />
      <TextArea label="Device & Platform" name="deviceSupport" defaultValue={product?.deviceSupport} rows={2} />
      <TextArea label="Limitasi" name="limitations" defaultValue={product?.limitations} rows={2} />
      <TextArea label="Ketentuan khusus (terms)" name="terms" defaultValue={product?.terms} rows={3} hint="Ditampilkan di halaman Ketentuan & Garansi saat produk ini dipilih." />
      <TextArea label="Kebijakan garansi khusus" name="warrantyPolicy" defaultValue={product?.warrantyPolicy} rows={3} />
      <TextArea label="Catatan marketing (internal)" name="marketingExplanation" defaultValue={product?.marketingExplanation} rows={2} hint="Referensi tim, tidak tampil di publik." />
    </>
  );
}
