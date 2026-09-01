const TYPE_LABEL: Record<string, string> = {
  POSTER: "Poster",
  CAPTION: "Caption",
  BANNER: "Banner",
  IDEA: "Ide",
};

const TYPE_GRADIENT: Record<string, string> = {
  POSTER: "from-ink to-[#4a332c]",
  CAPTION: "from-maroon to-maroon-dark",
  BANNER: "from-gold to-gold-ink",
  IDEA: "from-[#6e5b52] to-ink",
};

// Grid kartu di Reseller Center.
export function MarketingAssetCard({
  type,
  title,
  fileUrl,
}: {
  type: string;
  title: string;
  fileUrl?: string | null;
}) {
  const inner = fileUrl ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={fileUrl} alt={title} className="h-[88px] w-full object-cover" />
  ) : (
    <div className={`flex h-[88px] items-center justify-center bg-gradient-to-br font-mono text-[10px] text-white ${TYPE_GRADIENT[type] ?? "from-ink to-maroon"}`}>
      {TYPE_LABEL[type] ?? type}
    </div>
  );

  return (
    <div className="overflow-hidden rounded-xl border border-line">
      {inner}
      <div className="bg-paper-raised px-2.5 py-2 text-[11.5px] font-semibold text-ink">{title}</div>
    </div>
  );
}
