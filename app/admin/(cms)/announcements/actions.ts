"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser, requireOwner } from "@/lib/session";
import { requiredStr, bool } from "@/lib/form-utils";
import type { AnnouncementCategory } from "@prisma/client";

export async function createAnnouncement(formData: FormData) {
  const user = await requireUser();

  await prisma.announcement.create({
    data: {
      title: requiredStr(formData, "title"),
      body: requiredStr(formData, "body"),
      category: requiredStr(formData, "category") as AnnouncementCategory,
      pinned: bool(formData, "pinned"),
      authorId: user.id,
    },
  });

  revalidatePath("/update");
  revalidatePath("/");
  redirect("/admin/announcements");
}

export async function deleteAnnouncement(id: string) {
  await requireOwner();
  await prisma.announcement.delete({ where: { id } });
  revalidatePath("/update");
  revalidatePath("/");
  redirect("/admin/announcements");
}
