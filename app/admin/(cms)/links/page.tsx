import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Field, Select, TextArea } from "@/components/admin/Field";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { EditableCard } from "@/components/admin/EditableCard";
import { MarketingAssetForm } from "./MarketingAssetForm";
import { MarketingAssetItem } from "./MarketingAssetItem";
import {
  addImportantLink,
  updateImportantLink,
  deleteImportantLink,
  addGuideSection,
  updateGuideSection,
  deleteGuideSection,
  addReplyTemplate,
  updateReplyTemplate,
  deleteReplyTemplate,
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
          <EditableCard
            key={l.id}
            isOwner={isOwner}
            updateAction={updateImportantLink.bind(null, l.id)}
            deleteAction={deleteImportantLink.bind(null, l.id)}
            summary={
              <>
                <span className="mr-2 rounded-full bg-paper px-2 py-0.5 text-[10px] font-semibold uppercase text-ink-faint">{l.group}</span>
                <span className="font-semibold text-ink">{l.label}</span>
                <div className="text-xs text-ink-faint">{l.url}</div>
              </>
            }
            formFields={
              <>
                <Field label="Label" name="label" defaultValue={l.label} required />
                <Field label="URL" name="url" type="url" defaultValue={l.url} required />
                <Field label="Grup (mis. Order & Transaksi / Komunitas / Bantuan)" name="group" defaultValue={l.group} required />
              </>
            }
          />
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
          <EditableCard
            key={g.id}
            isOwner={isOwner}
            updateAction={updateGuideSection.bind(null, g.id)}
            deleteAction={deleteGuideSection.bind(null, g.id)}
            summary={
              <>
                <div className="font-semibold text-ink">{g.title}</div>
                <div className="mt-1 whitespace-pre-wrap text-sm text-ink-soft">{g.content}</div>
              </>
            }
            formFields={
              <>
                <Field label="Judul" name="title" defaultValue={g.title} required />
                <TextArea label="Isi" name="content" defaultValue={g.content} required rows={4} hint="Mendukung Markdown." />
              </>
            }
          />
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
  const productOptions = [{ value: "", label: "— Umum, tidak terikat produk —" }, ...products.map((p) => ({ value: p.id, label: p.name }))];

  return (
    <div className="mt-5">
      <div className="flex flex-col gap-2">
        {templates.map((t) => (
          <EditableCard
            key={t.id}
            isOwner={isOwner}
            updateAction={updateReplyTemplate.bind(null, t.id)}
            deleteAction={deleteReplyTemplate.bind(null, t.id)}
            summary={
              <>
                <span className="mr-2 rounded-full bg-paper px-2 py-0.5 text-[10px] font-semibold uppercase text-ink-faint">
                  {REPLY_CATEGORY_LABEL[t.category]}
                </span>
                <span className="font-semibold text-ink">{t.title}</span>
                {t.product && <span className="ml-2 text-xs text-ink-faint">({t.product.name})</span>}
                <div className="mt-1 whitespace-pre-wrap text-sm italic text-ink-soft">{t.templateReply}</div>
              </>
            }
            formFields={
              <>
                <Select
                  label="Kategori"
                  name="category"
                  defaultValue={t.category}
                  options={Object.entries(REPLY_CATEGORY_LABEL).map(([value, label]) => ({ value, label }))}
                />
                <Field label="Judul" name="title" defaultValue={t.title} required />
                <TextArea label="Isi Balasan" name="templateReply" defaultValue={t.templateReply} required rows={3} />
                <Select label="Produk terkait (opsional)" name="productId" defaultValue={t.productId ?? ""} options={productOptions} />
              </>
            }
          />
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
        <Select label="Produk terkait (opsional)" name="productId" defaultValue="" options={productOptions} />
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
          <MarketingAssetItem key={a.id} asset={a} isOwner={isOwner} />
        ))}
        {assets.length === 0 && <p className="text-sm text-ink-faint">Belum ada materi marketing.</p>}
      </div>

      <MarketingAssetForm />
    </div>
  );
}
