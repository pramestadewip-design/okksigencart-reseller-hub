import { prisma } from "@/lib/prisma";
import { findLinkUrl } from "@/lib/links";
import { ErrorBanner } from "@/components/admin/ErrorBanner";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { ProductDetailFields } from "../ProductDetailFields";
import { createProduct } from "../actions";

export default async function NewProductPage({ searchParams }: { searchParams: { error?: string } }) {
  const [categories, claimBotUrl] = await Promise.all([
    prisma.category.findMany({ orderBy: { order: "asc" } }),
    findLinkUrl("Klaim"),
  ]);

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-bold text-ink">Tambah Produk</h1>
      <ErrorBanner message={searchParams.error} />

      <form action={createProduct} className="mt-4 flex flex-col gap-4">
        <ProductDetailFields categories={categories} claimBotUrl={claimBotUrl} />
        <SubmitButton>Simpan Produk</SubmitButton>
      </form>
    </div>
  );
}
