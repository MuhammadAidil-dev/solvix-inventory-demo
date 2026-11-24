"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="space-y-3 rounded-lg border border-[#cdd9e8] bg-[#eaf2fc] p-4">
      <h2 className="font-semibold text-[#0d2340]">Terjadi kesalahan</h2>
      <p className="text-sm text-[#38516f]">{error.message}</p>
      <button
        onClick={reset}
        className="rounded-md bg-[#155eb5] px-3 py-1.5 text-sm text-white hover:bg-[#124f99]"
      >
        Coba lagi
      </button>
    </div>
  );
}
