import Link from "next/link";

type ProductCardProps = {
  slug: string;
  name: string;
  categoryName: string;
};

const ICON_TONES = ["bg-ink", "bg-maroon", "bg-gold"];

// Warna blok ikon dipilih deterministik dari slug — variasi visual tanpa
// perlu field warna terpisah di schema (admin tidak perlu mengurusnya).
function iconTone(slug: string) {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) hash = (hash * 31 + slug.charCodeAt(i)) >>> 0;
  return ICON_TONES[hash % ICON_TONES.length];
}

// Icon block + nama + tag singkat + chevron. Home & /produk.
export function ProductCard({ slug, name, categoryName }: ProductCardProps) {
  return (
    <Link
      href={`/produk/${slug}`}
      className="flex items-center gap-3 rounded-xl border border-line bg-paper-raised p-3.5 hover:border-line-soft"
    >
      <div className={`h-11 w-11 flex-shrink-0 rounded-[10px] ${iconTone(slug)}`} />
      <div className="flex-1">
        <div className="text-[14.5px] font-bold text-ink">{name}</div>
        <div className="text-xs text-ink-soft">{categoryName}</div>
      </div>
      <svg viewBox="0 0 24 24" fill="none" stroke="#93857c" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 flex-shrink-0">
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </Link>
  );
}
