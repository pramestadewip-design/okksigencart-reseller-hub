import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { findLinkUrl } from "@/lib/links";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Markdown } from "@/components/Markdown";
import { Button } from "@/components/Button";

export const revalidate = 3600;

export async function generateStaticParams() {
  const products = await prisma.product.findMany({ where: { active: true }, select: { slug: true } });
  return products.map((p) => ({ slug: p.slug }));
}

async function getProduct(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      guides: { orderBy: { order: "asc" } },
    },
  });
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await getProduct(params.slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description.slice(0, 155),
  };
}

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug);
  if (!product || !product.active) notFound();

  const [orderBotUrl, claimBotUrl] = await Promise.all([findLinkUrl("Order"), findLinkUrl("Klaim")]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    category: product.category.name,
    description: product.description,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Nav />
      <main className="pb-24">
        <div className="flex items-center gap-2 border-b border-line px-6 py-4 text-[12.5px] text-ink-soft">
          <Link href="/produk">Produk</Link>
          <span className="text-line">/</span>
          <span className="font-semibold text-ink">{product.name}</span>
        </div>

        <div className="mx-auto max-w-3xl px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="h-[52px] w-[52px] flex-shrink-0 rounded-xl bg-ink" />
            <div>
              <span className="font-mono text-[10.5px] font-semibold uppercase tracking-wide text-ink-soft">
                {product.category.name}
              </span>
              <h1 className="mt-0.5 text-xl font-extrabold text-ink sm:text-2xl">{product.name}</h1>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-line bg-paper-raised p-[18px]">
            <Markdown className="text-[13px] text-ink-soft">{product.description}</Markdown>
          </div>

          {product.guides.length > 0 && (
            <div className="mt-7">
              <h2 className="mb-3 text-base font-bold text-ink">Cara Penggunaan</h2>
              <div className="flex flex-col gap-2.5">
                {product.guides.map((g, i) => (
                  <div key={g.id} className="flex items-start gap-2.5">
                    <div className="flex h-[22px] w-[22px] flex-shrink-0 items-center justify-center rounded-md bg-gold-tint font-mono text-[11px] font-semibold text-gold-ink">
                      {i + 1}
                    </div>
                    <div className="pt-0.5">
                      <div className="text-[13px] font-semibold text-ink">{g.title}</div>
                      <Markdown className="text-[13px] text-ink-soft">{g.content}</Markdown>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {product.troubleshooting && (
            <div className="mt-7">
              <h2 className="mb-3 text-base font-bold text-ink">Kendala & Solusi</h2>
              <div className="rounded-xl border border-line bg-paper-raised p-3.5">
                <Markdown className="text-[13px] text-ink-soft">{product.troubleshooting}</Markdown>
              </div>
            </div>
          )}

          <div className="mt-7 flex flex-col gap-2.5">
            <Link
              href={`/ketentuan?produk=${product.slug}`}
              className="flex items-center gap-3 rounded-2xl bg-ink p-[18px]"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="#a97c3f" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 flex-shrink-0">
                <path d="M12 2 3 6v6c0 5 4 8 9 10 5-2 9-5 9-10V6l-9-4z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
              <div>
                <div className="text-[13.5px] font-bold text-white">Lihat ketentuan & garansi</div>
                <div className="mt-0.5 text-xs text-[#c9beb6]">Khusus {product.name} →</div>
              </div>
            </Link>
            {product.warrantyPolicy && (
              <a
                href={claimBotUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-2xl border border-line bg-paper-raised p-[18px]"
              >
                <div className="text-[13.5px] font-bold text-ink">Ada masalah? Ajukan Klaim Garansi</div>
                <svg viewBox="0 0 24 24" fill="none" stroke="#7a2a38" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 flex-shrink-0">
                  <line x1="7" y1="17" x2="17" y2="7" />
                  <polyline points="7 7 17 7 17 17" />
                </svg>
              </a>
            )}
          </div>
        </div>

        <div className="fixed inset-x-0 bottom-0 flex items-center gap-2.5 border-t border-line bg-paper-raised px-6 py-3.5">
          <div className="flex-1">
            <div className="text-[11px] text-ink-faint">{product.name}</div>
            <div className="text-sm font-bold text-ink">Order sekarang</div>
          </div>
          <Button href={orderBotUrl}>Order via Bot</Button>
        </div>
      </main>
      <Footer />
    </>
  );
}
