export function PageHeading({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: React.ReactNode }) {
  return (
    <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#78877a]">{eyebrow}</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-[#1e2a22] sm:text-[38px]">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#748078]">{description}</p>
      </div>
      {action}
    </div>
  );
}
