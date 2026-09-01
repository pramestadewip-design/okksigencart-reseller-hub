"use client";

import Link from "next/link";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/produk", label: "Produk" },
  { href: "/ketentuan", label: "Ketentuan & Garansi" },
  { href: "/faq", label: "FAQ" },
  { href: "/reseller", label: "Reseller Center" },
  { href: "/links", label: "Important Links" },
  { href: "/update", label: "Update" },
];

export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="sticky top-0 z-30 bg-paper-raised border-b border-line">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
        <Link href="/" className="font-display text-lg font-extrabold text-ink" onClick={() => setOpen(false)}>
          OkksigenCart
        </Link>
        <button
          type="button"
          aria-label="Buka menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-8 w-8 flex-col items-center justify-center gap-[5px]"
        >
          <span className={`block h-[2px] w-5 bg-ink transition-transform ${open ? "translate-y-[7px] rotate-45" : ""}`} />
          <span className={`block h-[2px] w-5 bg-ink transition-opacity ${open ? "opacity-0" : ""}`} />
          <span className={`block h-[2px] w-5 bg-ink transition-transform ${open ? "-translate-y-[7px] -rotate-45" : ""}`} />
        </button>
      </div>

      {open && (
        <nav className="border-t border-line bg-paper-raised px-5 py-3">
          <ul className="mx-auto flex max-w-5xl flex-col divide-y divide-line-soft">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block py-3 text-sm font-semibold text-ink"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}
