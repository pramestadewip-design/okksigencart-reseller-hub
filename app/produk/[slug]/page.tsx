import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { findLinkUrl } from "@/lib/links";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Markdown } from "@/components/Markdown";
import { FaqAccordion } from "@/components/FaqAccordion";
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
      faqs: { orderBy: { order: "asc" } },
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

  const orderBotUrl = await findLinkUrl("Order");

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
            <div className="mb-1.5 text-sm font-bold text-ink">Apa produk ini?</div>
            <Markdown className="mb-4 text-[13px] text-ink-soft">{product.description}</Markdown>

            <div className="mb-2 text-sm font-bold text-ink">Benefit utama</div>
            <Markdown className="mb-4 text-[13px] text-ink-soft">{product.benefits}</Markdown>

            <div className="mb-1 text-sm font-bold text-ink">Cocok untuk siapa?</div>
            <Markdown className="text-[13px] text-ink-soft">{product.audience}</Markdown>
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

          {product.deviceSupport && (
            <div className="mt-7">
              <h2 className="mb-3 text-base font-bold text-ink">Device & Platform</h2>
              <Markdown className="text-[13px] text-ink-soft">{product.deviceSupport}</Markdown>
            </div>
          )}

          {product.limitations && (
            <div className="mt-7">
              <h2 className="mb-2.5 text-base font-bold text-ink">Limitasi</h2>
              <div className="rounded-xl border border-[#f4e4bd] bg-gold-tint p-3.5">
                <Markdown className="text-[13px] text-gold-ink">{product.limitations}</Markdown>
              </div>
            </div>
          )}

          {product.faqs.length > 0 && (
            <div className="mt-7">
              <h2 className="mb-3 text-base font-bold text-ink">FAQ</h2>
              <FaqAccordion items={product.faqs} />
            </div>
          )}

          <Link
            href={`/ketentuan?produk=${product.slug}`}
            className="mt-7 flex items-center gap-3 rounded-2xl bg-ink p-[18px]"
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
