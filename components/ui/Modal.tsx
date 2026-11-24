"use client";

export function Modal({ title, subtitle, onClose, children }: { title: string; subtitle: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#101a14]/50 p-0 backdrop-blur-[2px] sm:items-center sm:p-5" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section role="dialog" aria-modal="true" aria-labelledby="modal-title" className="max-h-[92vh] w-full overflow-y-auto rounded-t-3xl bg-[#fbfcf9] shadow-2xl sm:max-w-xl sm:rounded-3xl">
        <div className="flex items-start justify-between border-b border-[#e5e9e2] px-6 py-5 sm:px-7">
          <div><h2 id="modal-title" className="text-lg font-semibold text-[#1e2a22]">{title}</h2><p className="mt-1 text-xs leading-5 text-[#78847b]">{subtitle}</p></div>
          <button type="button" aria-label="Tutup" onClick={onClose} className="grid size-8 place-items-center rounded-lg text-lg text-[#78847b] hover:bg-[#edf0eb]">×</button>
        </div>
        <div className="px-6 py-6 sm:px-7">{children}</div>
      </section>
    </div>
  );
}
