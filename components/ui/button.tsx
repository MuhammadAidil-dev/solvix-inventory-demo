import type { ButtonHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

type Props = ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ className, ...props }: Props) {
  return (
    <button
      className={cn(
        "rounded-md bg-[#155eb5] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#124f99] disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}
