import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AdminShell } from "./AdminShell";

// Semua route di grup ini (products, faq, announcements, links) butuh
// session — dijamin oleh middleware.ts (matcher: /admin kecuali /admin/login).
export default async function CmsLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  const user = session!.user;

  return (
    <AdminShell userName={user.name ?? user.email ?? "Admin"} role={user.role}>
      {children}
    </AdminShell>
  );
}
