import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Field, Select, TextArea } from "@/components/admin/Field";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { MarketingAssetForm } from "./MarketingAssetForm";
import {
  addImportantLink,
  deleteImportantLink,
  addGuideSection,
  deleteGuideSection,
  addReplyTemplate,
  deleteReplyTemplate,
  deleteMarketingAsset,
} from "./actions";

const SUB_TABS = [
  { key: "links", label: "Important Links" },
  { key: "guide", label: "Panduan Reseller" },
  { key: "template", label: "Template Reply" },
  { key: "marketing", label: "Marketing Kit" },
];

const REPLY_CATEGORY_LABEL: Record<string, string> = {
  LOGIN: "Kendala Login",
  PAYMENT: "Pembayaran",
  RENEWAL: "Perpanjangan",
  WARRANTY: "Garansi",
  GENERAL: "Umum",
};

const MARKETING_TYPE_LABEL: Record<string, string> = {
  POSTER: "Poster",
  CAPTION: "Caption",
  BANNER: "Banner",
  IDEA: "Ide",
};

export default async function AdminLinksPage({ searchParams }: { searchParams: { tab?: string } }) {
  const tab = searchParams.tab ?? "links";
  const session = await getServerSession(authOptions);
  const isOwner = session?.user.role === "OWNER";

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-bold text-ink">Manage Links</h1>

      <div className="mt-3 flex gap-4 overflow-x-auto border-b border-line">
        {SUB_TABS.map((t) => (
          <Link
            key={t.key}
            href={`/admin/links?tab=${t.key}`}
            className={`-mb-px whitespace-nowrap border-b-2 px-1 pb-2 text-sm font-semibold ${
              tab === t.key ? "border-maroon text-maroon" : "border-transparent text-ink-soft"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      {tab === "links" && <ImportantLinksTab isOwner={isOwner} />}
      {tab === "guide" && <GuideSectionTab isOwner={isOwner} />}
      {tab === "template" && <ReplyTemplateTab isOwner={isOwner} />}
      {tab === "marketing" && <MarketingKitTab isOwner={isOwner} />}
    </div>
  );
}

async function ImportantLinksTab({ isOwner }: { isOwner: boolean }) {
  const links = await prisma.importantLink.findMany({ orderBy: [{ group: "asc" }, { order: "asc" }] });
  return (
    <div className="mt-5">
      <div className="flex flex-col gap-2">
        {links.map((l) => (
          <div key={l.id} className="flex items-center justify-between rounded-md border border-line p-3">
            <div>
              <span className="mr-2 rounded-full bg-paper px-2 py-0.5 text-[10px] font-semibold uppercase text-ink-faint">{l.group}</span>
              <span className="font-semibold text-ink">{l.label}</span>
              <div className="text-xs text-ink-faint">{l.url}</div>
            </div>
            {isOwner && (
              <form action={deleteImportantLink.bind(null, l.id)}>
                <button type="submit" className="text-xs font-semibold text-maroon">Hapus</button>
              </form>
            )}
          </div>
        ))}
        {links.length === 0 && <p className="text-sm text-ink-faint">Belum ada link.</p>}
      </div>

      <form action={addImportantLink} className="mt-6 flex flex-col gap-3 rounded-md border border-line p-4">
        <div className="text-sm font-semibold text-ink">Tambah Link</div>
        <Field label="Label" name="label" required />
        <Field label="URL" name="url" type="url" required />
        <Field label="Grup (mis. Order & Transaksi / Komunitas / Bantuan)" name="group" required />
        <SubmitButton>Tambah</SubmitButton>
      </form>
    </div>
  );
}

async function GuideSectionTab({ isOwner }: { isOwner: boolean }) {
  const guides = await prisma.guideSection.findMany({ orderBy: { order: "asc" } });
  return (
    <div className="mt-5">
      <div className="flex flex-col gap-2">
        {guides.map((g) => (
          <div key={g.id} className="rounded-md border border-line p-3">
            <div className="flex items-start justify-between gap-3">
              <div className="font-semibold text-ink">{g.title}</div>
              {isOwner && (
                <form action={deleteGuideSection.bind(null, g.id)}>
                  <button type="submit" className="text-xs font-semibold text-maroon">Hapus</button>
                </form>
              )}
            </div>
            <div className="mt-1 whitespace-pre-wrap text-sm text-ink-soft">{g.content}</div>
          </div>
        ))}
        {guides.length === 0 && <p className="text-sm text-ink-faint">Belum ada panduan.</p>}
      </div>

      <form action={addGuideSection} className="mt-6 flex flex-col gap-3 rounded-md border border-line p-4">
        <div className="text-sm font-semibold text-ink">Tambah Bagian Panduan</div>
        <Field label="Judul" name="title" required />
        <TextArea label="Isi" name="content" required rows={4} hint="Mendukung Markdown." />
        <SubmitButton>Tambah</SubmitButton>
      </form>
    </div>
  );
}

async function ReplyTemplateTab({ isOwner }: { isOwner: boolean }) {
  const [templates, products] = await Promise.all([
    prisma.replyTemplate.findMany({ orderBy: { createdAt: "desc" }, include: { product: true } }),
    prisma.product.findMany({ orderBy: { name: "asc" } }),
  ]);
  return (
    <div className="mt-5">
      <div className="flex flex-col gap-2">
        {templates.map((t) => (
          <div key={t.id} className="rounded-md border border-line p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="mr-2 rounded-full bg-paper px-2 py-0.5 text-[10px] font-semibold uppercase text-ink-faint">
                  {REPLY_CATEGORY_LABEL[t.category]}
                </span>
                <span className="font-semibold text-ink">{t.title}</span>
                {t.product && <span className="ml-2 text-xs text-ink-faint">({t.product.name})</span>}
              </div>
              {isOwner && (
                <form action={deleteReplyTemplate.bind(null, t.id)}>
                  <button type="submit" className="text-xs font-semibold text-maroon">Hapus</button>
                </form>
              )}
            </div>
            <div className="mt-1 whitespace-pre-wrap text-sm italic text-ink-soft">{t.templateReply}</div>
          </div>
        ))}
        {templates.length === 0 && <p className="text-sm text-ink-faint">Belum ada template.</p>}
      </div>

      <form action={addReplyTemplate} className="mt-6 flex flex-col gap-3 rounded-md border border-line p-4">
        <div className="text-sm font-semibold text-ink">Tambah Template</div>
        <Select
          label="Kategori"
          name="category"
          defaultValue="GENERAL"
          options={Object.entries(REPLY_CATEGORY_LABEL).map(([value, label]) => ({ value, label }))}
        />
        <Field label="Judul" name="title" required />
        <TextArea label="Isi Balasan" name="templateReply" required rows={3} />
        <Select
          label="Produk terkait (opsional)"
          name="productId"
          defaultValue=""
          options={[{ value: "", label: "— Umum, tidak terikat produk —" }, ...products.map((p) => ({ value: p.id, label: p.name }))]}
        />
        <SubmitButton>Tambah</SubmitButton>
      </form>
    </div>
  );
}

async function MarketingKitTab({ isOwner }: { isOwner: boolean }) {
  const assets = await prisma.marketingAsset.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <div className="mt-5">
      <div className="flex flex-col gap-2">
        {assets.map((a) => (
          <div key={a.id} className="flex items-center justify-between rounded-md border border-line p-3">
            <div>
              <span className="mr-2 rounded-full bg-paper px-2 py-0.5 text-[10px] font-semibold uppercase text-ink-faint">
                {MARKETING_TYPE_LABEL[a.type]}
              </span>
              <span className="font-semibold text-ink">{a.title}</span>
            </div>
            {isOwner && (
              <form action={deleteMarketingAsset.bind(null, a.id)}>
                <button type="submit" className="text-xs font-semibold text-maroon">Hapus</button>
              </form>
            )}
          </div>
        ))}
        {assets.length === 0 && <p className="text-sm text-ink-faint">Belum ada materi marketing.</p>}
      </div>

      <MarketingAssetForm />
    </div>
  );
}
