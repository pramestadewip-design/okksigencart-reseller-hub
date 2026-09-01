"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { requiredStr, str } from "@/lib/form-utils";

function fail(message: string): never {
  redirect(`/admin/account?error=${encodeURIComponent(message)}`);
}

export async function updateAccount(formData: FormData) {
  const sessionUser = await requireUser();
  const user = await prisma.user.findUniqueOrThrow({ where: { id: sessionUser.id } });

  const name = requiredStr(formData, "name");
  const currentPassword = requiredStr(formData, "currentPassword");
  const newPassword = str(formData, "newPassword");
  const confirmPassword = str(formData, "confirmPassword");

  const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!isValid) fail("Password saat ini salah.");

  if (newPassword && newPassword !== confirmPassword) {
    fail("Konfirmasi password baru tidak cocok.");
  }
  if (newPassword && newPassword.length < 8) {
    fail("Password baru minimal 8 karakter.");
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      name,
      ...(newPassword ? { passwordHash: await bcrypt.hash(newPassword, 10) } : {}),
    },
  });

  redirect("/admin/account?saved=1");
}
