import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Field, Select, TextArea } from "@/components/admin/Field";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { EditableCard } from "@/components/admin/EditableCard";
import { createAnnouncement, updateAnnouncement, deleteAnnouncement } from "./actions";

const CATEGORY_LABEL: Record<string, string> = {
  NEW_PRODUCT: "Produk Baru",
  RULE_CHANGE: "Perubahan Aturan",
  PROMO: "Promo",
  MAINTENANCE: "Maintenance",
};

export default async function AdminAnnouncementsPage() {
  const [announcements, session] = await Promise.all([
    prisma.announcement.findMany({ orderBy: [{ pinned: "desc" }, { publishedAt: "desc" }] }),
    getServerSession(authOptions),
  ]);
  const isOwner = session?.user.role === "OWNER";

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-bold text-ink">Manage Announcement</h1>

      <div className="mt-4 flex flex-col gap-2">
        {announcements.map((a) => (
          <EditableCard
            key={a.id}
            isOwner={isOwner}
            updateAction={updateAnnouncement.bind(null, a.id)}
            deleteAction={deleteAnnouncement.bind(null, a.id)}
            summary={
              <>
                <span className="mr-2 rounded-full bg-gold-tint px-2 py-0.5 text-[10px] font-semibold text-gold-ink">
                  {CATEGORY_LABEL[a.category]}
                </span>
                {a.pinned && (
                  <span className="mr-2 rounded-full bg-ink px-2 py-0.5 text-[10px] font-semibold text-white">Disematkan</span>
                )}
                <span className="font-semibold text-ink">{a.title}</span>
                <div className="mt-1 whitespace-pre-wrap text-sm text-ink-soft">{a.body}</div>
              </>
            }
            formFields={
              <>
                <Field label="Judul" name="title" defaultValue={a.title} required />
                <Select
                  label="Kategori"
                  name="category"
                  defaultValue={a.category}
                  options={Object.entries(CATEGORY_LABEL).map(([value, label]) => ({ value, label }))}
                />
                <TextArea label="Isi" name="body" defaultValue={a.body} required rows={4} hint="Mendukung Markdown." />
                <label className="flex items-center gap-2 text-sm font-semibold text-ink">
                  <input type="checkbox" name="pinned" defaultChecked={a.pinned} className="h-4 w-4 accent-maroon" />
                  Sematkan di atas
                </label>
              </>
            }
          />
        ))}
        {announcements.length === 0 && <p className="text-sm text-ink-faint">Belum ada update.</p>}
      </div>

      <form action={createAnnouncement} className="mt-6 flex flex-col gap-3 rounded-md border border-line p-4">
        <div className="text-sm font-semibold text-ink">Tambah Update</div>
        <Field label="Judul" name="title" required />
        <Select
          label="Kategori"
          name="category"
          defaultValue="NEW_PRODUCT"
          options={Object.entries(CATEGORY_LABEL).map(([value, label]) => ({ value, label }))}
        />
        <TextArea label="Isi" name="body" required rows={4} hint="Mendukung Markdown." />
        <label className="flex items-center gap-2 text-sm font-semibold text-ink">
          <input type="checkbox" name="pinned" className="h-4 w-4 accent-maroon" />
          Sematkan di atas
        </label>
        <SubmitButton>Publikasikan</SubmitButton>
      </form>
    </div>
  );
}
