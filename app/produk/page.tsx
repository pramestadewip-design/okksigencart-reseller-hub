import { prisma } from "@/lib/prisma";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { CategoryPill } from "@/components/CategoryPill";
import { ProductCard } from "@/components/ProductCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Produk",
  description: "Daftar lengkap produk digital OkksigenCart — Netflix, Disney+, ChatGPT, dan lainnya.",
};

const PAGE_SIZE = 24;

export default async function ProductListPage({
  searchParams,
}: {
  searchParams: { kategori?: string; page?: string };
}) {
  const page = Math.max(1, Number(searchParams.page) || 1);
  const categorySlug = searchParams.kategori;

  const [categories, products, total] = await Promise.all([
    prisma.category.findMany({ orderBy: { order: "asc" } }),
    prisma.product.findMany({
      where: {
        active: true,
        ...(categorySlug ? { category: { slug: categorySlug } } : {}),
      },
      include: { category: true },
      orderBy: [{ category: { order: "asc" } }, { name: "asc" }],
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.product.count({
      where: {
        active: true,
        ...(categorySlug ? { category: { slug: categorySlug } } : {}),
      },
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <>
      <Nav />
      <main className="mx-auto max-w-5xl px-6 py-8">
        <h1 className="text-2xl font-extrabold text-ink">Produk</h1>
        <p className="mt-1.5 text-[13.5px] text-ink-soft">Semua produk digital yang tersedia, dikelompokkan per kategori.</p>

        <div className="mt-5 flex flex-wrap gap-2">
          <CategoryPill label="Semua" href="/produk" active={!categorySlug} />
          {categories.map((c) => (
            <CategoryPill key={c.id} label={c.name} href={`/produk?kategori=${c.slug}`} active={categorySlug === c.slug} />
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p.id} slug={p.slug} name={p.name} categoryName={p.category.name} />
          ))}
        </div>

        {products.length === 0 && (
          <p className="mt-8 text-center text-sm text-ink-faint">Belum ada produk di kategori ini.</p>
        )}

        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <a
                key={n}
                href={`/produk?${categorySlug ? `kategori=${categorySlug}&` : ""}page=${n}`}
                className={`rounded-lg px-3 py-1.5 text-sm font-semibold ${
                  n === page ? "bg-ink text-white" : "border border-line text-ink-soft"
                }`}
              >
                {n}
              </a>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
