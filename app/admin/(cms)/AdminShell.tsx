"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import type { UserRole } from "@prisma/client";

const NAV = [
  { href: "/admin/products", label: "Manage Product" },
  { href: "/admin/faq", label: "Manage FAQ" },
  { href: "/admin/announcements", label: "Manage Announcement" },
  { href: "/admin/links", label: "Manage Links" },
];

export function AdminShell({
  children,
  userName,
  role,
}: {
  children: React.ReactNode;
  userName: string;
  role: UserRole;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-paper">
      <div className="border-b border-line bg-paper-raised">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
          <div className="flex items-center gap-6">
            <span className="font-display text-sm font-extrabold text-ink">OkksigenCart Admin</span>
            <nav className="hidden gap-4 sm:flex">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-semibold ${
                    pathname.startsWith(item.href) ? "text-maroon" : "text-ink-soft hover:text-ink"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin/account" className="text-xs text-ink-faint hover:text-ink">
              {userName} <span className="rounded bg-paper px-1.5 py-0.5 font-mono text-[10px]">{role}</span>
            </Link>
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/admin/login" })}
              className="text-xs font-semibold text-maroon"
            >
              Keluar
            </button>
          </div>
        </div>
        <nav className="flex gap-4 overflow-x-auto px-5 pb-3 sm:hidden">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`whitespace-nowrap text-sm font-semibold ${
                pathname.startsWith(item.href) ? "text-maroon" : "text-ink-soft"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="mx-auto max-w-6xl px-5 py-6">{children}</div>
    </div>
  );
}
