"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser, requireOwner } from "@/lib/session";
import { requiredStr, optStr, bool } from "@/lib/form-utils";
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
// admin mengetik nama kategori baru di `newCategoryName`.
async function resolveCategoryId(formData: FormData): Promise<string> {
  const categoryId = requiredStr(formData, "categoryId");
  if (categoryId !== "__new__") return categoryId;

  const name = requiredStr(formData, "newCategoryName");
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
  const categoryId = await resolveCategoryId(formData);

  const existingSlug = await prisma.product.findUnique({ where: { slug } });
  if (existingSlug) fail("/admin/products/new", `Produk dengan nama "${name}" sudah ada (slug bentrok).`);

  const product = await prisma.product.create({
    data: {
      name,
      slug,
      categoryId,
      active: bool(formData, "active"),
      description: requiredStr(formData, "description"),
      benefits: requiredStr(formData, "benefits"),
      audience: requiredStr(formData, "audience"),
      limitations: optStr(formData, "limitations"),
      deviceSupport: optStr(formData, "deviceSupport"),
      terms: optStr(formData, "terms"),
      warrantyPolicy: optStr(formData, "warrantyPolicy"),
      marketingExplanation: optStr(formData, "marketingExplanation"),
    },
  });

  revalidatePublicProductPages(product.slug);
  redirect(`/admin/products/${product.id}`);
}

export async function updateProduct(id: string, formData: FormData) {
  await requireUser();

  const name = requiredStr(formData, "name");
  const slug = slugify(name);
  const categoryId = await resolveCategoryId(formData);

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
      benefits: requiredStr(formData, "benefits"),
      audience: requiredStr(formData, "audience"),
      limitations: optStr(formData, "limitations"),
      deviceSupport: optStr(formData, "deviceSupport"),
      terms: optStr(formData, "terms"),
      warrantyPolicy: optStr(formData, "warrantyPolicy"),
      marketingExplanation: optStr(formData, "marketingExplanation"),
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

export async function addProductFaq(productId: string, formData: FormData) {
  await requireUser();
  const count = await prisma.productFAQ.count({ where: { productId } });
  await prisma.productFAQ.create({
    data: {
      productId,
      question: requiredStr(formData, "question"),
      answer: requiredStr(formData, "answer"),
      order: count,
    },
  });
  const product = await prisma.product.findUnique({ where: { id: productId } });
  revalidatePublicProductPages(product?.slug);
  redirect(`/admin/products/${productId}?tab=faq`);
}

export async function deleteProductFaq(productId: string, faqId: string) {
  await requireOwner();
  await prisma.productFAQ.delete({ where: { id: faqId } });
  const product = await prisma.product.findUnique({ where: { id: productId } });
  revalidatePublicProductPages(product?.slug);
  redirect(`/admin/products/${productId}?tab=faq`);
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

export async function deleteProductGuide(productId: string, guideId: string) {
  await requireOwner();
  await prisma.productGuide.delete({ where: { id: guideId } });
  const product = await prisma.product.findUnique({ where: { id: productId } });
  revalidatePublicProductPages(product?.slug);
  redirect(`/admin/products/${productId}?tab=guide`);
}
