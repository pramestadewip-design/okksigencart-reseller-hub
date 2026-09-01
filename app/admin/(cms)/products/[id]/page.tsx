import { notFound } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { findLinkUrl } from "@/lib/links";
import { ErrorBanner } from "@/components/admin/ErrorBanner";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { Field, TextArea } from "@/components/admin/Field";
import { ProductDetailFields } from "../ProductDetailFields";
import { updateProduct, deleteProduct, addProductGuide, deleteProductGuide } from "../actions";

const TABS = [
  { key: "detail", label: "Detail" },
  { key: "guide", label: "Cara Penggunaan" },
];

export default async function EditProductPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { tab?: string; error?: string; saved?: string };
}) {
  const [product, categories, session, claimBotUrl] = await Promise.all([
    prisma.product.findUnique({
      where: { id: params.id },
      include: { guides: { orderBy: { order: "asc" } } },
    }),
    prisma.category.findMany({ orderBy: { order: "asc" } }),
    getServerSession(authOptions),
    findLinkUrl("Klaim"),
  ]);
  if (!product) notFound();

  const isOwner = session?.user.role === "OWNER";
  const tab = searchParams.tab ?? "detail";
  const updateProductWithId = updateProduct.bind(null, product.id);
  const addGuideWithId = addProductGuide.bind(null, product.id);

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-ink">{product.name}</h1>
        {isOwner && (
          <form action={deleteProduct.bind(null, product.id)}>
            <button type="submit" className="text-sm font-semibold text-maroon">
              Hapus Produk
            </button>
          </form>
        )}
      </div>

      <ErrorBanner message={searchParams.error} />
      {searchParams.saved && <p className="mb-4 text-sm text-gold-ink">Perubahan disimpan.</p>}

      <div className="mt-3 flex gap-4 border-b border-line">
        {TABS.map((t) => (
          <Link
            key={t.key}
            href={`/admin/products/${product.id}?tab=${t.key}`}
            className={`-mb-px border-b-2 px-1 pb-2 text-sm font-semibold ${
              tab === t.key ? "border-maroon text-maroon" : "border-transparent text-ink-soft"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      {tab === "detail" && (
        <form action={updateProductWithId} className="mt-5 flex flex-col gap-4">
          <ProductDetailFields categories={categories} product={product} claimBotUrl={claimBotUrl} />
          <SubmitButton>Simpan Perubahan</SubmitButton>
        </form>
      )}

      {tab === "guide" && (
        <div className="mt-5">
          <div className="flex flex-col gap-2">
            {product.guides.map((guide) => (
              <div key={guide.id} className="rounded-md border border-line p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="font-semibold text-ink">{guide.title}</div>
                  {isOwner && (
                    <form action={deleteProductGuide.bind(null, product.id, guide.id)}>
                      <button type="submit" className="text-xs font-semibold text-maroon">
                        Hapus
                      </button>
                    </form>
                  )}
                </div>
                <div className="mt-1 whitespace-pre-wrap text-sm text-ink-soft">{guide.content}</div>
              </div>
            ))}
            {product.guides.length === 0 && <p className="text-sm text-ink-faint">Belum ada langkah penggunaan.</p>}
          </div>

          <form action={addGuideWithId} className="mt-5 flex flex-col gap-3 rounded-md border border-line p-4">
            <div className="text-sm font-semibold text-ink">Tambah Langkah</div>
            <Field label="Judul Langkah" name="title" required />
            <TextArea label="Isi" name="content" required rows={3} />
            <SubmitButton>Tambah</SubmitButton>
          </form>
        </div>
      )}
    </div>
  );
}
