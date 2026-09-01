import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ErrorBanner } from "@/components/admin/ErrorBanner";
import { Field } from "@/components/admin/Field";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { updateAccount } from "./actions";

export default async function AccountPage({ searchParams }: { searchParams: { error?: string; saved?: string } }) {
  const session = await getServerSession(authOptions);
  const user = session!.user;

  return (
    <div className="max-w-md">
      <h1 className="text-xl font-bold text-ink">Account</h1>
      <p className="mt-1 text-sm text-ink-soft">
        Ganti nama atau password login kamu sendiri kapan pun — tanpa perlu akses database.
      </p>

      <ErrorBanner message={searchParams.error} />
      {searchParams.saved && <p className="mb-4 text-sm text-gold-ink">Perubahan disimpan.</p>}

      <form action={updateAccount} className="mt-4 flex flex-col gap-4">
        <Field label="Nama" name="name" defaultValue={user.name} required />
        <div className="rounded-md bg-paper px-3 py-2 text-sm text-ink-soft">Email: {user.email}</div>

        <hr className="border-line" />

        <Field label="Password saat ini" name="currentPassword" type="password" required />
        <Field label="Password baru (kosongkan kalau tidak diganti)" name="newPassword" type="password" />
        <Field label="Konfirmasi password baru" name="confirmPassword" type="password" />

        <SubmitButton>Simpan Perubahan</SubmitButton>
      </form>
    </div>
  );
}
