// Pill kecil + ikon check, warna gold-tint. Home & Product page.
export function TrustBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-gold-tint px-2.5 py-1.5 text-[11.5px] font-semibold text-gold-ink">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3 flex-shrink-0">
        <polyline points="20 6 9 17 4 12" />
      </svg>
      {label}
    </span>
  );
}
