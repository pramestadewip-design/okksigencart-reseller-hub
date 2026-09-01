import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { FaqTabs } from "./FaqTabs";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Pertanyaan yang sering ditanyakan customer dan reseller OkksigenCart.",
};

export default async function FaqPage() {
  const faqs = await prisma.generalFAQ.findMany({ orderBy: { order: "asc" } });
  const customerFaqs = faqs.filter((f) => f.audience === "CUSTOMER");
  const resellerFaqs = faqs.filter((f) => f.audience === "RESELLER");

  return (
    <>
      <Nav />
      <main className="mx-auto max-w-3xl px-6 py-7">
        <h1 className="text-2xl font-extrabold text-ink">FAQ</h1>
        <p className="mt-2.5 text-[13.5px] text-ink-soft">Pertanyaan yang sering ditanyakan — dari sisi customer dan reseller.</p>
        <FaqTabs customerFaqs={customerFaqs} resellerFaqs={resellerFaqs} />
      </main>
      <Footer />
    </>
  );
}
