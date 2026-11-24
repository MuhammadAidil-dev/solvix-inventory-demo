export function PageHeading({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: React.ReactNode }) {
  return (
    <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#536985]">{eyebrow}</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-[#0d2340] sm:text-4xl">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#536985]">{description}</p>
      </div>
      {action}
    </div>
  );
}
