import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Markdown } from "@/components/Markdown";

export const metadata: Metadata = {
  title: "Update",
  description: "Update produk baru, perubahan aturan, promo, dan info maintenance OkksigenCart.",
};

const CATEGORY_LABEL: Record<string, string> = {
  NEW_PRODUCT: "Produk Baru",
  RULE_CHANGE: "Perubahan Aturan",
  PROMO: "Promo",
  MAINTENANCE: "Maintenance",
};

const CATEGORY_TONE: Record<string, string> = {
  NEW_PRODUCT: "bg-gold-tint text-gold-ink",
  RULE_CHANGE: "bg-maroon-tint text-maroon",
  PROMO: "bg-gold-tint text-gold-ink",
  MAINTENANCE: "bg-maroon-tint text-maroon",
};

export default async function UpdatePage() {
  const announcements = await prisma.announcement.findMany({
    orderBy: [{ pinned: "desc" }, { publishedAt: "desc" }],
  });

  return (
    <>
      <Nav />
      <main className="mx-auto max-w-3xl px-6 py-7">
        <h1 className="text-2xl font-extrabold text-ink">Update</h1>
        <p className="mt-2.5 text-[13.5px] text-ink-soft">Produk baru, perubahan aturan, promo, dan info maintenance — kronologis.</p>

        <div className="mt-6 flex flex-col gap-3">
          {announcements.map((a) => (
            <article key={a.id} className="rounded-xl border border-line bg-paper-raised p-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${CATEGORY_TONE[a.category]}`}>
                  {CATEGORY_LABEL[a.category]}
                </span>
                {a.pinned && (
                  <span className="rounded-full bg-ink px-2.5 py-1 text-[11px] font-semibold text-white">Disematkan</span>
                )}
                <span className="text-[11.5px] text-ink-faint">
                  {new Intl.DateTimeFormat("id-ID", { dateStyle: "long" }).format(a.publishedAt)}
                </span>
              </div>
              <h2 className="mt-2 text-[15px] font-bold text-ink">{a.title}</h2>
              <Markdown className="mt-1.5 text-[13px] text-ink-soft">{a.body}</Markdown>
            </article>
          ))}
          {announcements.length === 0 && <p className="text-sm text-ink-faint">Belum ada update.</p>}
        </div>
      </main>
      <Footer />
    </>
  );
}
