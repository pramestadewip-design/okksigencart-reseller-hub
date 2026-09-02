"use client";

import { useState } from "react";
import { Markdown } from "./Markdown";

type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  return (
    <div className="flex flex-col gap-2">
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div key={item.id} className="rounded-xl border border-line bg-paper-raised p-3.5">
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? null : item.id)}
              className="flex w-full items-center justify-between gap-3 text-left text-[13px] font-bold text-ink"
              aria-expanded={isOpen}
            >
              {item.question}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`h-4 w-4 flex-shrink-0 text-ink-soft transition-transform ${isOpen ? "rotate-180" : ""}`}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            {isOpen && <Markdown className="mt-2 text-[12.5px] text-ink-soft">{item.answer}</Markdown>}
          </div>
        );
      })}
    </div>
  );
}
