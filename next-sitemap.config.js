const { PrismaClient } = require("@prisma/client");

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  generateRobotsTxt: true,
  exclude: ["/admin", "/admin/*"],
  robotsTxtOptions: {
    policies: [
      { userAgent: "*", allow: "/", disallow: "/admin" },
    ],
  },
  // Rute /produk/[slug] tidak dinamis-difilekan Next.js sitemap default —
  // ambil langsung dari database supaya produk baru otomatis masuk sitemap.
  additionalPaths: async () => {
    const prisma = new PrismaClient();
    try {
      const products = await prisma.product.findMany({
        where: { active: true },
        select: { slug: true, updatedAt: true },
      });
      return products.map((p) => ({
        loc: `/produk/${p.slug}`,
        lastmod: p.updatedAt.toISOString(),
      }));
    } finally {
      await prisma.$disconnect();
    }
  },
};
