"use client";

export function Toast({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div role="alert" className="rounded-md border border-[#cdd9e8] bg-[#eaf2fc] px-3 py-2 text-sm text-[#0d2340]">
      {message}
    </div>
  );
}
