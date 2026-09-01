// Jaring pengaman kalau OWNER lupa password total dan tidak bisa login sama
// sekali (halaman /admin/account butuh login dulu, jadi tidak menolong di
// kasus ini). Jalankan manual dari terminal:
//   npx tsx --env-file=.env scripts/reset-password.ts <email> <password-baru>
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const [email, newPassword] = process.argv.slice(2);
  if (!email || !newPassword) {
    throw new Error("Pakai: npx tsx --env-file=.env scripts/reset-password.ts <email> <password-baru>");
  }
  if (newPassword.length < 8) {
    throw new Error("Password baru minimal 8 karakter.");
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);
  const user = await prisma.user.update({
    where: { email },
    data: { passwordHash },
  });

  console.log(`Password untuk ${user.email} berhasil direset.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
