// Cara Order (Home), Cara Penggunaan (Product), Cara Klaim (Warranty).
export function NumberedStep({ number, children }: { number: number; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-[26px] w-[26px] flex-shrink-0 items-center justify-center rounded-lg bg-ink font-mono text-xs font-semibold text-white">
        {number}
      </div>
      <div className="pt-[3px] text-[13.5px] leading-relaxed text-ink-soft">{children}</div>
    </div>
  );
}
