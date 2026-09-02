"use client";

import { useState } from "react";
import { SubmitButton } from "./SubmitButton";

// Toggle inline antara tampilan ringkas (+ tombol Edit/Hapus) dan form edit
// (+ tombol Simpan/Batal) — dipakai di semua daftar admin (FAQ, Announcement,
// Links, dst) supaya tidak perlu hapus-lalu-buat-ulang kalau ada salah ketik.
export function EditableCard({
  summary,
  formFields,
  updateAction,
  deleteAction,
  isOwner,
}: {
  summary: React.ReactNode;
  formFields: React.ReactNode;
  updateAction: (formData: FormData) => Promise<void>;
  deleteAction?: (formData: FormData) => Promise<void>;
  isOwner: boolean;
}) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <form action={updateAction} className="flex flex-col gap-3 rounded-md border border-maroon p-3">
        {formFields}
        <div className="flex items-center gap-4">
          <SubmitButton className="rounded-md bg-maroon px-3 py-1.5 text-xs font-semibold text-white hover:bg-maroon-dark">
            Simpan
          </SubmitButton>
          <button type="button" onClick={() => setEditing(false)} className="text-xs font-semibold text-ink-faint">
            Batal
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="rounded-md border border-line p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">{summary}</div>
        <div className="flex flex-shrink-0 gap-3">
          <button type="button" onClick={() => setEditing(true)} className="text-xs font-semibold text-ink-soft hover:text-ink">
            Edit
          </button>
          {isOwner && deleteAction && (
            <form action={deleteAction}>
              <button type="submit" className="text-xs font-semibold text-maroon">
                Hapus
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
