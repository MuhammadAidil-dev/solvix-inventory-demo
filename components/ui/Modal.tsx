"use client";

import { useEffect } from "react";

export function Modal({ title, subtitle, onClose, children }: { title: string; subtitle: string; onClose: () => void; children: React.ReactNode }) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#0d2340]/45 p-0 sm:items-center sm:p-5" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section role="dialog" aria-modal="true" aria-labelledby="modal-title" className="max-h-[92dvh] w-full overflow-y-auto rounded-t-xl border border-[#d8e3f1] bg-white sm:max-w-xl sm:rounded-xl">
        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-[#d8e3f1] bg-white px-4 py-4 sm:px-7">
          <div><h2 id="modal-title" className="text-lg font-semibold text-[#0d2340]">{title}</h2><p className="mt-1 text-sm leading-5 text-[#536985]">{subtitle}</p></div>
          <button type="button" aria-label="Tutup" onClick={onClose} className="grid size-8 place-items-center rounded-lg text-lg text-[#536985] hover:bg-[#eaf2fc]">×</button>
        </div>
        <div className="px-4 py-4 sm:px-7 sm:py-6">{children}</div>
      </section>
    </div>
  );
}
