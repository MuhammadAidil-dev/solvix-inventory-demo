import type { InputHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

type Props = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: Props) {
  return (
    <input
      className={cn(
        "w-full rounded-md border border-[#cdd9e8] bg-white px-3 py-2.5 text-sm text-[#193858] outline-none focus:border-[#1767c2] focus:ring-2 focus:ring-[#1767c2]/10",
        className
      )}
      {...props}
    />
  );
}
