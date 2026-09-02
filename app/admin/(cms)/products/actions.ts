"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser, requireOwner } from "@/lib/session";
import { requiredStr, optStr, bool, str } from "@/lib/form-utils";
import { slugify } from "@/lib/slug";

function fail(path: string, message: string): never {
  redirect(`${path}?error=${encodeURIComponent(message)}`);
}

function revalidatePublicProductPages(slug?: string) {
  revalidatePath("/");
  revalidatePath("/produk");
  revalidatePath("/ketentuan");
  revalidatePath("/reseller");
  if (slug) revalidatePath(`/produk/${slug}`);
}

// Kategori dibuat on-the-fly dari form produk — tidak butuh halaman admin
// tersendiri. `categoryId` berisi id existing, atau literal "__new__" kalau
// admin mengetik nama kategori baru di `newCategoryName`. `onFailPath` dipakai
// untuk redirect balik dengan pesan error yang jelas kalau input tidak valid,
// alih-alih melempar Error mentah (yang cuma tampil sebagai halaman digest
// generik di production).
async function resolveCategoryId(formData: FormData, onFailPath: string): Promise<string> {
  const categoryId = str(formData, "categoryId");
  if (!categoryId) fail(onFailPath, "Kategori wajib dipilih.");
  if (categoryId !== "__new__") return categoryId;

  const name = str(formData, "newCategoryName");
  if (!name) fail(onFailPath, 'Nama kategori baru wajib diisi kalau memilih "+ Kategori baru...".');
  const slug = slugify(name);
  const existing = await prisma.category.findFirst({ where: { OR: [{ name }, { slug }] } });
  if (existing) return existing.id;

  const count = await prisma.category.count();
  const created = await prisma.category.create({ data: { name, slug, order: count } });
  return created.id;
}

export async function createProduct(formData: FormData) {
  await requireUser();

  const name = requiredStr(formData, "name");
  const slug = slugify(name);
  const categoryId = await resolveCategoryId(formData, "/admin/products/new");

  const existingSlug = await prisma.product.findUnique({ where: { slug } });
  if (existingSlug) fail("/admin/products/new", `Produk dengan nama "${name}" sudah ada (slug bentrok).`);

  const product = await prisma.product.create({
    data: {
      name,
      slug,
      categoryId,
      active: bool(formData, "active"),
      description: requiredStr(formData, "description"),
      terms: requiredStr(formData, "terms"),
      troubleshooting: optStr(formData, "troubleshooting"),
      warrantyPolicy: optStr(formData, "warrantyPolicy"),
    },
  });

  revalidatePublicProductPages(product.slug);
  redirect(`/admin/products/${product.id}`);
}

export async function updateProduct(id: string, formData: FormData) {
  await requireUser();

  const name = requiredStr(formData, "name");
  const slug = slugify(name);
  const categoryId = await resolveCategoryId(formData, `/admin/products/${id}`);

  const clash = await prisma.product.findFirst({ where: { slug, NOT: { id } } });
  if (clash) fail(`/admin/products/${id}`, `Produk lain sudah memakai slug "${slug}".`);

  const before = await prisma.product.findUnique({ where: { id } });

  await prisma.product.update({
    where: { id },
    data: {
      name,
      slug,
      categoryId,
      active: bool(formData, "active"),
      description: requiredStr(formData, "description"),
      terms: requiredStr(formData, "terms"),
      troubleshooting: optStr(formData, "troubleshooting"),
      warrantyPolicy: optStr(formData, "warrantyPolicy"),
    },
  });

  revalidatePublicProductPages(before?.slug);
  revalidatePublicProductPages(slug);
  redirect(`/admin/products/${id}?saved=1`);
}

// Hapus konten dibatasi OWNER — ADMIN tidak boleh hapus (ditegakkan di
// sini, di server, bukan cuma disembunyikan di UI).
export async function deleteProduct(id: string) {
  await requireOwner();
  const product = await prisma.product.delete({ where: { id } });
  revalidatePublicProductPages(product.slug);
  redirect("/admin/products");
}

export async function addProductGuide(productId: string, formData: FormData) {
  await requireUser();
  const count = await prisma.productGuide.count({ where: { productId } });
  await prisma.productGuide.create({
    data: {
      productId,
      title: requiredStr(formData, "title"),
      content: requiredStr(formData, "content"),
      order: count,
    },
  });
  const product = await prisma.product.findUnique({ where: { id: productId } });
  revalidatePublicProductPages(product?.slug);
  redirect(`/admin/products/${productId}?tab=guide`);
}

export async function updateProductGuide(productId: string, guideId: string, formData: FormData) {
  await requireUser();
  await prisma.productGuide.update({
    where: { id: guideId },
    data: {
      title: requiredStr(formData, "title"),
      content: requiredStr(formData, "content"),
    },
  });
  const product = await prisma.product.findUnique({ where: { id: productId } });
  revalidatePublicProductPages(product?.slug);
  redirect(`/admin/products/${productId}?tab=guide`);
}

export async function deleteProductGuide(productId: string, guideId: string) {
  await requireOwner();
  await prisma.productGuide.delete({ where: { id: guideId } });
  const product = await prisma.product.findUnique({ where: { id: productId } });
  revalidatePublicProductPages(product?.slug);
  redirect(`/admin/products/${productId}?tab=guide`);
}
