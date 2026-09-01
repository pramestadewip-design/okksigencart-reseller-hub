import { prisma } from "./prisma";

// CTA "Order via Bot" / "Ajukan Klaim Garansi" di halaman publik menautkan
// ke URL yang dikelola admin lewat /admin/links (ImportantLink), bukan
// hardcode — supaya admin bisa ganti bot/link tanpa redeploy kode.
// Dicari berdasarkan potongan label (case-insensitive), fallback "/links"
// kalau admin belum mengisinya.
export async function findLinkUrl(labelContains: string): Promise<string> {
  const link = await prisma.importantLink.findFirst({
    where: { label: { contains: labelContains, mode: "insensitive" } },
    orderBy: { order: "asc" },
  });
  return link?.url ?? "/links";
}

export const ORDER_BOT_LABEL_HINT = "Order";
export const CLAIM_BOT_LABEL_HINT = "Klaim";
