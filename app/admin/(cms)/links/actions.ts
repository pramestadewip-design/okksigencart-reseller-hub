"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser, requireOwner } from "@/lib/session";
import { requiredStr, optStr } from "@/lib/form-utils";
import type { MarketingAssetType, ReplyCategory } from "@prisma/client";

function revalidateLinksPages() {
  revalidatePath("/links");
  revalidatePath("/reseller");
  revalidatePath("/");
}

// ---- Important Links ----

export async function addImportantLink(formData: FormData) {
  await requireUser();
  const group = requiredStr(formData, "group");
  const count = await prisma.importantLink.count({ where: { group } });
  await prisma.importantLink.create({
    data: {
      label: requiredStr(formData, "label"),
      url: requiredStr(formData, "url"),
      group,
      order: count,
    },
  });
  revalidateLinksPages();
  redirect("/admin/links?tab=links");
}

export async function deleteImportantLink(id: string) {
  await requireOwner();
  await prisma.importantLink.delete({ where: { id } });
  revalidateLinksPages();
  redirect("/admin/links?tab=links");
}

// ---- Panduan Reseller (GuideSection) ----

export async function addGuideSection(formData: FormData) {
  await requireUser();
  const count = await prisma.guideSection.count();
  await prisma.guideSection.create({
    data: {
      title: requiredStr(formData, "title"),
      content: requiredStr(formData, "content"),
      order: count,
    },
  });
  revalidateLinksPages();
  redirect("/admin/links?tab=guide");
}

export async function deleteGuideSection(id: string) {
  await requireOwner();
  await prisma.guideSection.delete({ where: { id } });
  revalidateLinksPages();
  redirect("/admin/links?tab=guide");
}

// ---- Template Reply ----

export async function addReplyTemplate(formData: FormData) {
  await requireUser();
  await prisma.replyTemplate.create({
    data: {
      category: requiredStr(formData, "category") as ReplyCategory,
      title: requiredStr(formData, "title"),
      templateReply: requiredStr(formData, "templateReply"),
      productId: optStr(formData, "productId"),
    },
  });
  revalidateLinksPages();
  redirect("/admin/links?tab=template");
}

export async function deleteReplyTemplate(id: string) {
  await requireOwner();
  await prisma.replyTemplate.delete({ where: { id } });
  revalidateLinksPages();
  redirect("/admin/links?tab=template");
}

// ---- Marketing Kit ----

export async function addMarketingAsset(formData: FormData) {
  await requireUser();
  await prisma.marketingAsset.create({
    data: {
      type: requiredStr(formData, "type") as MarketingAssetType,
      title: requiredStr(formData, "title"),
      fileUrl: optStr(formData, "fileUrl"),
      content: optStr(formData, "content"),
    },
  });
  revalidateLinksPages();
  redirect("/admin/links?tab=marketing");
}

export async function deleteMarketingAsset(id: string) {
  await requireOwner();
  await prisma.marketingAsset.delete({ where: { id } });
  revalidateLinksPages();
  redirect("/admin/links?tab=marketing");
}
