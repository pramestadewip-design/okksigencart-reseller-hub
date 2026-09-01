import { prisma } from "@/lib/prisma";
import { findLinkUrl } from "@/lib/links";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/Button";
import { ProductCard } from "@/components/ProductCard";
import { ValuePropItem } from "@/components/ValuePropItem";
import { NumberedStep } from "@/components/NumberedStep";
import { CtaBanner } from "@/components/CtaBanner";

const VALUE_PROPS: { title: string; description: string; tone: "gold" | "maroon" }[] = [
  { title: "Proses mudah", description: "Produk digital premium, order tanpa ribet.", tone: "gold" },
  { title: "Sistem order otomatis", description: "Diproses bot, bukan antre balasan admin.", tone: "maroon" },
  { title: "Informasi transparan", description: "Tiap produk punya halaman detail sendiri.", tone: "gold" },
  { title: "Support & garansi jelas", description: "Syarat klaim ditulis dari awal, bukan dadakan.", tone: "maroon" },
  { title: "Mendukung reseller berkembang", description: "Resource lengkap, bukan cuma akses order.", tone: "gold" },
];

export default async function HomePage() {
  const [featuredProducts, orderBotUrl] = await Promise.all([
    prisma.product.findMany({
      where: { active: true },
      orderBy: { createdAt: "asc" },
      take: 3,
      include: { category: true },
    }),
    findLinkUrl("Order"),
  ]);

  return (
    <>
      <Nav />
      <main>
        {/* HERO */}
        <div className="relative overflow-hidden px-6 pb-9 pt-10">
          <div className="pointer-events-none absolute -right-20 -top-16 h-56 w-56 rounded-full bg-[radial-gradient(circle,#7a2a38_0%,rgba(122,42,56,0)_70%)] opacity-20" />
          <div className="relative mx-auto max-w-5xl">
            <span className="rounded-full bg-gold-tint px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-wide text-gold-ink">
              Digital Subscription Store
            </span>
            <h1 className="mt-4 text-[30px] font-extrabold leading-tight text-ink sm:text-4xl">
              Langganan premium, proses yang jelas.
            </h1>
            <p className="mt-2.5 max-w-[46ch] text-[14.5px] leading-relaxed text-ink-soft">
              Netflix, Disney+, ChatGPT, dan produk digital lain — dijelaskan transparan, dikirim otomatis, digaransi jelas.
            </p>
            <div className="mt-5 flex flex-wrap gap-2.5">
              <Button href={orderBotUrl}>Order via Bot</Button>
              <Button href="/produk" variant="secondary">Lihat Produk</Button>
            </div>
          </div>
        </div>

        {/* PRODUK UNGGULAN */}
        <div className="mx-auto max-w-5xl px-6 pb-2 pt-3">
          <h2 className="text-[19px] font-bold text-ink">Produk Unggulan</h2>
          <p className="mt-1 text-[13px] text-ink-soft">Sebagian dari yang tersedia — lengkapnya di halaman Produk.</p>
          <div className="mt-4 flex flex-col gap-2.5 sm:grid sm:grid-cols-3 sm:gap-3">
            {featuredProducts.map((p) => (
              <ProductCard key={p.id} slug={p.slug} name={p.name} categoryName={p.category.name} />
            ))}
            {featuredProducts.length === 0 && (
              <p className="text-sm text-ink-faint">Belum ada produk aktif — kelola di /admin/products.</p>
            )}
          </div>
        </div>

        {/* WHY CHOOSE */}
        <div className="mx-auto max-w-5xl px-6 pb-2 pt-8">
          <h2 className="mb-4 text-[19px] font-bold text-ink">Why Choose OkksigenCart</h2>
          <div className="flex flex-col gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-3">
            {VALUE_PROPS.map((v) => (
              <ValuePropItem
                key={v.title}
                tone={v.tone}
                title={v.title}
                description={v.description}
                icon={
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M9 12l2 2 4-4" />
                  </svg>
                }
              />
            ))}
          </div>
        </div>

        {/* CARA ORDER */}
        <div className="mx-auto max-w-5xl px-6 pb-2 pt-8">
          <h2 className="mb-4 text-[19px] font-bold text-ink">Cara Order</h2>
          <div className="flex flex-col gap-3 sm:grid sm:grid-cols-2 lg:grid-cols-4">
            <NumberedStep number={1}>Buka Bot Order lewat Telegram — tanpa daftar.</NumberedStep>
            <NumberedStep number={2}>Pilih produk, baca Ketentuan & Garansi-nya.</NumberedStep>
            <NumberedStep number={3}>Bayar, bot memproses otomatis.</NumberedStep>
            <NumberedStep number={4}>Akun terkirim — siap dipakai.</NumberedStep>
          </div>
        </div>

        <CtaBanner
          title="Siap mulai langganan?"
          subtitle="Bot aktif 24 jam, proses otomatis hari itu juga."
          ctaLabel="Order via Bot →"
          ctaHref={orderBotUrl}
        />
        <div className="mt-4" />
      </main>
      <Footer />
    </>
  );
}
