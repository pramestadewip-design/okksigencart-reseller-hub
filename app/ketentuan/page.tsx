import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { findLinkUrl } from "@/lib/links";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ProductSelector } from "@/components/ProductSelector";
import { TwoToneInfoCard } from "@/components/TwoToneInfoCard";
import { NumberedStep } from "@/components/NumberedStep";
import { Markdown } from "@/components/Markdown";
import { Button } from "@/components/Button";

export const metadata: Metadata = {
  title: "Ketentuan & Garansi",
  description: "Syarat, tanggung jawab, dan cara klaim garansi produk OkksigenCart.",
};

const CheckIcon = (props: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" className={props.className}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const XIcon = (props: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" className={props.className}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export default async function WarrantyPage({ searchParams }: { searchParams: { produk?: string } }) {
  const [products, selected, claimBotUrl] = await Promise.all([
    prisma.product.findMany({
      where: { active: true },
      include: { category: true },
      orderBy: [{ category: { order: "asc" } }, { name: "asc" }],
    }),
    searchParams.produk
      ? prisma.product.findUnique({ where: { slug: searchParams.produk } })
      : Promise.resolve(null),
    findLinkUrl("Klaim"),
  ]);

  const selectorProducts = products.map((p) => ({ slug: p.slug, name: p.name, categoryName: p.category.name }));

  return (
    <>
      <Nav />
      <main className="mx-auto max-w-3xl px-6 py-7">
        <h1 className="text-2xl font-extrabold text-ink">Ketentuan & Garansi</h1>
        <p className="mt-2.5 text-[13.5px] leading-relaxed text-ink-soft">
          Kami mau kamu paham sistemnya dari awal — bukan baru baca syarat pas komplain. Cari produkmu di bawah untuk lihat detailnya.
        </p>

        <div className="mt-5">
          <div className="mb-1.5 font-display text-[11.5px] font-bold text-ink-faint">Pilih Produk</div>
          <ProductSelector products={selectorProducts} selectedSlug={searchParams.produk} />
        </div>

        {selected && (selected.terms || selected.warrantyPolicy) && (
          <div className="mt-4 rounded-xl border border-line bg-paper-raised p-4">
            <div className="mb-2 text-[13.5px] font-bold text-ink">Ketentuan Khusus — {selected.name}</div>
            {selected.terms && <Markdown className="mb-2 text-[12.5px] text-ink-soft">{selected.terms}</Markdown>}
            {selected.warrantyPolicy && <Markdown className="text-[12.5px] text-ink-soft">{selected.warrantyPolicy}</Markdown>}
          </div>
        )}

        <div className="mt-7">
          <h2 className="mb-3 text-base font-bold text-ink">Siapa Bertanggung Jawab atas Apa</h2>
          <div className="flex flex-col gap-2.5">
            <div className="rounded-xl border border-line border-l-[3px] border-l-gold bg-paper-raised p-4">
              <div className="mb-2 text-[13.5px] font-bold text-ink">Tanggung Jawab Kami</div>
              <ul className="flex flex-col gap-1.5 text-[12.5px] leading-relaxed text-ink-soft">
                {[
                  "Akun aktif & bisa login saat diserahkan",
                  "Data sesuai yang dijanjikan (durasi, kapasitas layar)",
                  "Ganti akun kalau gagal login dari awal",
                ].map((t) => (
                  <li key={t} className="flex gap-1.5">
                    <CheckIcon className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-gold" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-line border-l-[3px] border-l-maroon bg-paper-raised p-4">
              <div className="mb-2 text-[13.5px] font-bold text-ink">Tanggung Jawab Kamu</div>
              <ul className="flex flex-col gap-1.5 text-[12.5px] leading-relaxed text-ink-soft">
                {[
                  "Tidak ubah email/password/nama profil",
                  "Gunakan sesuai jumlah layar yang dibeli",
                  "Laporkan masalah dalam masa garansi",
                ].map((t) => (
                  <li key={t} className="flex gap-1.5">
                    <CheckIcon className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-maroon" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-7">
          <h2 className="mb-3 text-base font-bold text-ink">Apa yang Ditanggung</h2>
          <div className="flex flex-col gap-2.5">
            <TwoToneInfoCard tone="gold" title="Bisa Dibantu" icon={<CheckIcon className="h-4 w-4" />}>
              Akun gagal login sejak awal terima, kapasitas layar tidak sesuai, akun ternyata sudah dipakai orang lain.
            </TwoToneInfoCard>
            <TwoToneInfoCard tone="maroon" title="Di Luar Garansi" icon={<XIcon className="h-4 w-4" />}>
              Lupa password sendiri setelah login, akun kena banned karena melanggar aturan platform, klaim lewat batas waktu.
            </TwoToneInfoCard>
          </div>
        </div>

        <div className="mt-7">
          <h2 className="mb-3 text-base font-bold text-ink">Cara Klaim</h2>
          <div className="flex flex-col gap-2.5">
            <NumberedStep number={1}>Buka Bot Klaim Garansi lewat Telegram.</NumberedStep>
            <NumberedStep number={2}>Kirim kode order &amp; screenshot masalahnya.</NumberedStep>
            <NumberedStep number={3}>Tim verifikasi, akun diganti kalau memenuhi syarat.</NumberedStep>
          </div>
        </div>

        <div className="mt-7 rounded-2xl bg-ink p-[22px] text-center">
          <div className="mb-1.5 text-base font-bold text-white">Ada masalah dengan akunmu?</div>
          <div className="mb-4 text-[12.5px] text-[#cbb9ae]">Ajukan klaim, tim kami proses cepat.</div>
          <Button href={claimBotUrl} className="bg-gold text-ink shadow-none hover:bg-gold">
            Ajukan Klaim Garansi
          </Button>
        </div>
      </main>
      <Footer />
    </>
  );
}
