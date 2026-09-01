type CategoryPillProps = {
  label: string;
  active?: boolean;
  href?: string;
};

import Link from "next/link";

// Dipakai di filter /produk dan kategori di dalam product selector.
export function CategoryPill({ label, active = false, href }: CategoryPillProps) {
  const classes = `inline-flex items-center rounded-full px-3.5 py-1.5 text-[13px] font-semibold ${
    active ? "bg-ink text-white" : "border border-line bg-paper-raised text-ink-soft"
  }`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {label}
      </Link>
    );
  }
  return <span className={classes}>{label}</span>;
}
