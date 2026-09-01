import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "./auth";

export async function requireUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/admin/login");
  }
  return session.user;
}

// OWNER penuh; ADMIN tanpa hapus konten dan tanpa kelola akun lain.
// Dipanggil di dalam Server Action sebelum operasi delete/manage-user —
// bukan cuma disembunyikan di UI.
export async function requireOwner() {
  const user = await requireUser();
  if (user.role !== "OWNER") {
    throw new Error("Hanya OWNER yang bisa melakukan aksi ini.");
  }
  return user;
}
