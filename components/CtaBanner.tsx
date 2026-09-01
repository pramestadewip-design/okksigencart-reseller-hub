import { Button } from "./Button";

type CtaBannerProps = {
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  dark?: boolean;
};

// Kartu full-width kontras tinggi. Penutup Home & Warranty and Terms.
export function CtaBanner({ title, subtitle, ctaLabel, ctaHref, dark = false }: CtaBannerProps) {
  return (
    <div
      className={`relative mx-5 mt-8 overflow-hidden rounded-2xl ${
        dark ? "bg-ink px-6 py-6 text-center" : "bg-ink px-[22px] py-[26px]"
      }`}
    >
      {!dark && (
        <div className="pointer-events-none absolute -bottom-10 -right-8 h-36 w-36 rounded-full bg-maroon opacity-25" />
      )}
      <div className="relative">
        <div className="font-display text-lg font-bold leading-snug text-white">{title}</div>
        <div className={`text-[13px] text-[#cbb9ae] ${dark ? "mb-4 mt-1.5" : "mb-[18px] mt-2"}`}>{subtitle}</div>
        <Button href={ctaHref} className={dark ? "bg-gold text-ink shadow-none hover:bg-gold" : ""}>
          {ctaLabel}
        </Button>
      </div>
    </div>
  );
}
