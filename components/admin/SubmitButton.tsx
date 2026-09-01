"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({
  children,
  pendingText,
  className,
}: {
  children: React.ReactNode;
  pendingText?: string;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={`${className ?? "rounded-md bg-maroon px-4 py-2 text-sm font-semibold text-white hover:bg-maroon-dark"} disabled:cursor-not-allowed disabled:opacity-50`}
    >
      {pending ? pendingText ?? "Menyimpan..." : children}
    </button>
  );
}
