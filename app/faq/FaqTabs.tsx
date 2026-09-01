"use client";

import { useState } from "react";
import { FaqAccordion } from "@/components/FaqAccordion";

type Faq = { id: string; question: string; answer: string };

export function FaqTabs({ customerFaqs, resellerFaqs }: { customerFaqs: Faq[]; resellerFaqs: Faq[] }) {
  const [tab, setTab] = useState<"CUSTOMER" | "RESELLER">("CUSTOMER");
  const items = tab === "CUSTOMER" ? customerFaqs : resellerFaqs;

  return (
    <div className="mt-5">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setTab("CUSTOMER")}
          className={`rounded-full px-4 py-2 text-sm font-semibold ${tab === "CUSTOMER" ? "bg-ink text-white" : "border border-line text-ink-soft"}`}
        >
          Customer
        </button>
        <button
          type="button"
          onClick={() => setTab("RESELLER")}
          className={`rounded-full px-4 py-2 text-sm font-semibold ${tab === "RESELLER" ? "bg-ink text-white" : "border border-line text-ink-soft"}`}
        >
          Reseller
        </button>
      </div>
      <div className="mt-4">
        {items.length === 0 ? (
          <p className="text-sm text-ink-faint">Belum ada FAQ untuk kategori ini.</p>
        ) : (
          <FaqAccordion items={items} />
        )}
      </div>
    </div>
  );
}
