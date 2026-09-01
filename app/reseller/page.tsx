import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { MarketingAssetCard } from "@/components/MarketingAssetCard";
import { FaqAccordion } from "@/components/FaqAccordion";

export const metadata: Metadata = {
  title: "Reseller Center",
  description: "Panduan, materi promosi, dan template reply — semua amunisi jualan reseller OkksigenCart.",
};

function LinkRow({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between gap-3 rounded-xl border border-line bg-paper-raised p-4"
    >
      <div>
        <div className="text-sm font-bold text-ink">{label}</div>
      </div>
      <svg viewBox="0 0 24 24" fill="none" stroke="#93857c" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 flex-shrink-0">
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </Link>
  );
}

export default async function ResellerCenterPage() {
  const [guides, marketingAssets, replyTemplates] = await Promise.all([
    prisma.guideSection.findMany({ orderBy: { order: "asc" } }),
    prisma.marketingAsset.findMany({ orderBy: { createdAt: "desc" }, take: 6 }),
    prisma.replyTemplate.findMany({ orderBy: { createdAt: "desc" }, take: 6 }),
  ]);

  return (
    <>
      <Nav />
      <main>
        <div className="bg-ink px-6 py-8">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-wide text-[#e0a98f]">Untuk Reseller</span>
          <h1 className="mt-2.5 text-2xl font-extrabold text-white">Semua amunisi jualan, satu tempat.</h1>
          <p className="mt-2 max-w-[52ch] text-[13px] text-[#c9beb6]">
            Panduan, materi promosi, dan template — supaya kamu jelasin produk seperti tim OkksigenCart sendiri.
          </p>
        </div>

        <div className="mx-auto max-w-3xl px-6 py-7">
          <div className="flex flex-col gap-2.5">
            <LinkRow href="/produk" label="Product Knowledge — data sama dengan halaman Produk" />
            <LinkRow href="/faq" label="FAQ Reseller" />
            <LinkRow href="/links" label="Important Links" />
          </div>

          {guides.length > 0 && (
            <div className="mt-8">
              <h2 className="mb-3 text-base font-bold text-ink">Panduan Mulai Jualan</h2>
              <FaqAccordion items={guides.map((g) => ({ id: g.id, question: g.title, answer: g.content }))} />
            </div>
          )}

          {marketingAssets.length > 0 && (
            <div className="mt-8">
              <h2 className="mb-3 text-base font-bold text-ink">Marketing Kit</h2>
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                {marketingAssets.map((a) => (
                  <MarketingAssetCard key={a.id} type={a.type} title={a.title} fileUrl={a.fileUrl} />
                ))}
              </div>
            </div>
          )}

          {replyTemplates.length > 0 && (
            <div className="mt-8">
              <h2 className="mb-3 text-base font-bold text-ink">Template Reply Customer</h2>
              <FaqAccordion
                items={replyTemplates.map((t) => ({ id: t.id, question: t.title, answer: t.templateReply }))}
              />
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
