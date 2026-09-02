"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser, requireOwner } from "@/lib/session";
import { requiredStr } from "@/lib/form-utils";
import type { FaqAudience } from "@prisma/client";

export async function addGeneralFaq(formData: FormData) {
  await requireUser();
  const audience = requiredStr(formData, "audience") as FaqAudience;
  const count = await prisma.generalFAQ.count({ where: { audience } });

  await prisma.generalFAQ.create({
    data: {
      audience,
      question: requiredStr(formData, "question"),
      answer: requiredStr(formData, "answer"),
      order: count,
    },
  });

  revalidatePath("/faq");
  redirect("/admin/faq");
}

export async function updateGeneralFaq(id: string, formData: FormData) {
  await requireUser();
  await prisma.generalFAQ.update({
    where: { id },
    data: {
      audience: requiredStr(formData, "audience") as FaqAudience,
      question: requiredStr(formData, "question"),
      answer: requiredStr(formData, "answer"),
    },
  });
  revalidatePath("/faq");
  redirect("/admin/faq");
}

export async function deleteGeneralFaq(id: string) {
  await requireOwner();
  await prisma.generalFAQ.delete({ where: { id } });
  revalidatePath("/faq");
  redirect("/admin/faq");
}
