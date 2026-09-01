import { ReactNode } from "react";

type ValuePropItemProps = {
  icon: ReactNode;
  title: string;
  description: string;
  tone?: "gold" | "maroon";
};

// Why Choose OkksigenCart di Home — 5 item. Cuma dua tone dari satu palet
// (gold-tint / maroon-tint), bukan warna kontras baru per item.
export function ValuePropItem({ icon, title, description, tone = "gold" }: ValuePropItemProps) {
  const bg = tone === "gold" ? "bg-gold-tint" : "bg-maroon-tint";
  const iconColor = tone === "gold" ? "text-gold-ink" : "text-maroon";

  return (
    <div className="flex gap-3">
      <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-[10px] ${bg} ${iconColor}`}>
        {icon}
      </div>
      <div>
        <div className="text-sm font-bold text-ink">{title}</div>
        <div className="mt-0.5 text-[12.5px] text-ink-soft">{description}</div>
      </div>
    </div>
  );
}
