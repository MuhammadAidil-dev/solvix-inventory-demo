export function StatusPill({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "good" | "warning" | "danger" }) {
  const tones = {
    neutral: "bg-[#f0f4fa] text-[#38516f]",
    good: "bg-[#eaf2fc] text-[#155eb5]",
    warning: "bg-[#dceaff] text-[#123f78]",
    danger: "bg-[#dceaff] text-[#0d2340]",
  };
  return <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold ${tones[tone]}`}>{children}</span>;
}
