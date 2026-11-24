export function StatusPill({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "good" | "warning" | "danger" }) {
  const tones = {
    neutral: "bg-[#edf0eb] text-[#59665c]",
    good: "bg-[#e8f4e8] text-[#357047]",
    warning: "bg-[#fff3d6] text-[#946915]",
    danger: "bg-[#fde8e4] text-[#a3483a]",
  };
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${tones[tone]}`}>{children}</span>;
}
