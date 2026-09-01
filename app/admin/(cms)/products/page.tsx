import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ErrorBanner } from "@/components/admin/ErrorBanner";

const PAGE_SIZE = 20;

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: { q?: string; kategori?: string; page?: string; error?: string };
}) {
  const session = await getServerSession(authOptions);
  const isOwner = session?.user.role === "OWNER";

  const page = Math.max(1, Number(searchParams.page) || 1);
  const q = searchParams.q?.trim();
  const categoryId = searchParams.kategori;

  const where = {
    ...(q ? { name: { contains: q, mode: "insensitive" as const } } : {}),
    ...(categoryId ? { categoryId } : {}),
  };

  const [products, total, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.product.count({ where }),
    prisma.category.findMany({ orderBy: { order: "asc" } }),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-ink">Manage Product</h1>
        <Link href="/admin/products/new" className="rounded-md bg-maroon px-4 py-2 text-sm font-semibold text-white hover:bg-maroon-dark">
          + Tambah Produk
        </Link>
      </div>

      <ErrorBanner message={searchParams.error} />

      <form className="mt-4 flex flex-wrap gap-2" method="get">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Cari nama produk…"
          className="w-56 rounded-md border border-line px-3 py-2 text-sm"
        />
        <select name="kategori" defaultValue={categoryId} className="rounded-md border border-line bg-white px-3 py-2 text-sm">
          <option value="">Semua kategori</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <button type="submit" className="rounded-md border border-line px-4 py-2 text-sm font-semibold text-ink">
          Filter
        </button>
      </form>

      <div className="mt-4 overflow-x-auto rounded-lg border border-line">
        <table className="w-full text-sm">
          <thead className="bg-paper text-left text-xs font-semibold uppercase tracking-wide text-ink-faint">
            <tr>
              <th className="px-4 py-2.5">Nama</th>
              <th className="px-4 py-2.5">Kategori</th>
              <th className="px-4 py-2.5">Status</th>
              <th className="px-4 py-2.5" />
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t border-line">
                <td className="px-4 py-2.5 font-medium text-ink">{p.name}</td>
                <td className="px-4 py-2.5 text-ink-soft">{p.category.name}</td>
                <td className="px-4 py-2.5">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${p.active ? "bg-gold-tint text-gold-ink" : "bg-paper text-ink-faint"}`}>
                    {p.active ? "Aktif" : "Nonaktif"}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-right">
                  <Link href={`/admin/products/${p.id}`} className="text-sm font-semibold text-maroon">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-ink-faint">
                  Tidak ada produk yang cocok.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <Link
              key={n}
              href={`/admin/products?${q ? `q=${q}&` : ""}${categoryId ? `kategori=${categoryId}&` : ""}page=${n}`}
              className={`rounded-md px-3 py-1.5 text-sm font-semibold ${n === page ? "bg-ink text-white" : "border border-line text-ink-soft"}`}
            >
              {n}
            </Link>
          ))}
        </div>
      )}

      {!isOwner && (
        <p className="mt-4 text-xs text-ink-faint">Akun ADMIN tidak bisa menghapus produk — hubungi OWNER.</p>
      )}
    </div>
  );
}
