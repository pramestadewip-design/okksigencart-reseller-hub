import Link from "next/link";

const FOOTER_LINKS = [
  { href: "/produk", label: "Produk" },
  { href: "/ketentuan", label: "Ketentuan & Garansi" },
  { href: "/faq", label: "FAQ" },
  { href: "/reseller", label: "Reseller Center" },
  { href: "/links", label: "Important Links" },
];

export function Footer() {
  return (
    <footer className="mx-auto max-w-5xl px-5 py-9">
      <div className="font-display text-base font-extrabold text-ink">OkksigenCart</div>
      <p className="mt-2 max-w-[32ch] text-[12.5px] text-ink-soft">
        Digital subscription store — produk, garansi, dan panduan reseller dalam satu tempat.
      </p>
      <div className="mt-4 flex flex-col gap-2 text-sm font-semibold sm:flex-row sm:flex-wrap sm:gap-5">
        {FOOTER_LINKS.map((link) => (
          <Link key={link.href} href={link.href} className="text-ink hover:text-maroon">
            {link.label}
          </Link>
        ))}
      </div>
      <div className="mt-6 border-t border-line pt-3.5 text-[11.5px] text-ink-faint">
        © {new Date().getFullYear()} OkksigenCart. Semua hak dilindungi.
      </div>
    </footer>
  );
}
