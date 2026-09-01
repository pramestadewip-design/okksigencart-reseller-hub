import { ReactNode } from "react";

type TwoToneInfoCardProps = {
  tone: "gold" | "maroon";
  icon: ReactNode;
  title: string;
  children: ReactNode;
};

// Tint gold (positif) vs tint maroon (negatif/perhatian) — dipakai di
// Tanggung Jawab & Cakupan Garansi. Dua tone dari satu palet, bukan dua
// warna kontras baru.
export function TwoToneInfoCard({ tone, icon, title, children }: TwoToneInfoCardProps) {
  const isGold = tone === "gold";
  return (
    <div className={`rounded-xl p-4 ${isGold ? "bg-gold-tint" : "bg-maroon-tint"}`}>
      <div className={`mb-2 flex items-center gap-2 text-[13.5px] font-bold ${isGold ? "text-gold-ink" : "text-maroon"}`}>
        {icon}
        {title}
      </div>
      <div className={`text-[12.5px] leading-relaxed ${isGold ? "text-[#6e5539]" : "text-[#6e4448]"}`}>
        {children}
      </div>
    </div>
  );
}
