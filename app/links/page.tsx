import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Important Links",
  description: "Link penting OkksigenCart — order bot, klaim garansi, grup komunitas, dan kontak admin.",
};

export default async function LinksPage() {
  const links = await prisma.importantLink.findMany({ orderBy: { order: "asc" } });

  const groups = new Map<string, typeof links>();
  for (const link of links) {
    const list = groups.get(link.group) ?? [];
    list.push(link);
    groups.set(link.group, list);
  }

  return (
    <>
      <Nav />
      <main className="mx-auto max-w-3xl px-6 py-7">
        <h1 className="text-2xl font-extrabold text-ink">Important Links</h1>
        <p className="mt-2.5 text-[13.5px] text-ink-soft">Semua link penting, dikelompokkan supaya gampang dicari.</p>

        <div className="mt-6 flex flex-col gap-7">
          {Array.from(groups.entries()).map(([group, items]) => (
            <div key={group}>
              <h2 className="mb-3 text-base font-bold text-ink">{group}</h2>
              <div className="flex flex-col gap-2">
                {items.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-xl border border-line bg-paper-raised px-4 py-3 text-sm font-semibold text-ink"
                  >
                    {link.label}
                    <svg viewBox="0 0 24 24" fill="none" stroke="#93857c" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-[15px] w-[15px] flex-shrink-0">
                      <line x1="7" y1="17" x2="17" y2="7" />
                      <polyline points="7 7 17 7 17 17" />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          ))}
          {links.length === 0 && <p className="text-sm text-ink-faint">Belum ada link — kelola di /admin/links.</p>}
        </div>
      </main>
      <Footer />
    </>
  );
}
