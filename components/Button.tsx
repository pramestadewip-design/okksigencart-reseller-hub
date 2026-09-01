import Link from "next/link";
import { ReactNode } from "react";

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
};

// Satu-satunya warna CTA di seluruh situs: maroon solid (primary) atau
// outline maroon (secondary). Tidak ada varian warna lain.
export function Button({ href, children, variant = "primary", className = "" }: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-1.5 rounded-[10px] px-5 py-3 text-sm font-semibold transition-colors";
  const styles =
    variant === "primary"
      ? "bg-maroon text-white shadow-[0_4px_16px_rgba(122,42,56,0.28)] hover:bg-maroon-dark"
      : "border-[1.5px] border-maroon text-maroon hover:bg-maroon-tint";

  return (
    <Link href={href} className={`${base} ${styles} ${className}`}>
      {children}
    </Link>
  );
}
