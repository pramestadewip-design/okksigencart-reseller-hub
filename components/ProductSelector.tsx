"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type SelectorProduct = {
  slug: string;
  name: string;
  categoryName: string;
};

const ICON_TONES = ["bg-ink", "bg-maroon", "bg-gold"];
function iconTone(slug: string) {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) hash = (hash * 31 + slug.charCodeAt(i)) >>> 0;
  return ICON_TONES[hash % ICON_TONES.length];
}

// Komponen paling kompleks di sitemap: trigger + search input + daftar
// dikelompokkan per kategori. Dibangun reusable & siap 50+ produk —
// filtering di client (satu payload produk ringan, bukan query per keystroke).
export function ProductSelector({
  products,
  selectedSlug,
  basePath = "/ketentuan",
}: {
  products: SelectorProduct[];
  selectedSlug?: string;
  basePath?: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = products.find((p) => p.slug === selectedSlug) ?? null;

  const grouped = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q ? products.filter((p) => p.name.toLowerCase().includes(q)) : products;
    const groups = new Map<string, SelectorProduct[]>();
    for (const p of filtered) {
      const list = groups.get(p.categoryName) ?? [];
      list.push(p);
      groups.set(p.categoryName, list);
    }
    return Array.from(groups.entries());
  }, [products, query]);

  function choose(slug: string) {
    setOpen(false);
    setQuery("");
    router.push(`${basePath}?produk=${slug}`);
  }

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={`flex w-full items-center justify-between rounded-xl border-[1.5px] bg-paper-raised px-4 py-3.5 ${
          open ? "border-maroon" : "border-line"
        }`}
      >
        <span className="flex items-center gap-2.5">
          {selected ? (
            <>
              <span className={`h-[26px] w-[26px] flex-shrink-0 rounded-md ${iconTone(selected.slug)}`} />
              <span className="text-[13.5px] font-bold text-ink">{selected.name}</span>
            </>
          ) : (
            <span className="text-[13.5px] font-semibold text-ink-faint">Pilih produk…</span>
          )}
        </span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="#7a2a38"
          strokeWidth={2.4}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`h-4 w-4 flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-10 mt-1.5 w-full overflow-hidden rounded-2xl border border-line bg-paper-raised shadow-[0_16px_36px_rgba(46,31,27,0.16)]">
          <div className="flex items-center gap-2 border-b border-line-soft px-4 py-3">
            <svg viewBox="0 0 24 24" fill="none" stroke="#a3948b" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" className="h-[17px] w-[17px] flex-shrink-0">
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari produk…"
              className="w-full bg-transparent text-[13px] text-ink placeholder:text-ink-faint-2 focus:outline-none"
            />
          </div>

          <div className="max-h-[340px] overflow-y-auto">
            {grouped.length === 0 && (
              <div className="px-4 py-6 text-center text-[12.5px] text-ink-faint-2">Produk tidak ditemukan.</div>
            )}
            {grouped.map(([categoryName, items]) => (
              <div key={categoryName}>
                <div className="border-t border-line-soft px-4 pb-1.5 pt-2.5 font-mono text-[10px] font-semibold uppercase tracking-wide text-ink-faint-2 first:border-t-0">
                  {categoryName}
                </div>
                {items.map((p) => {
                  const isSelected = p.slug === selectedSlug;
                  return (
                    <button
                      key={p.slug}
                      type="button"
                      onClick={() => choose(p.slug)}
                      className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-[13px] font-medium ${
                        isSelected ? "bg-maroon text-white" : "text-ink hover:bg-paper"
                      }`}
                    >
                      {p.name}
                      {isSelected && (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 flex-shrink-0">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
