import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Field, Select, TextArea } from "@/components/admin/Field";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { EditableCard } from "@/components/admin/EditableCard";
import { addGeneralFaq, updateGeneralFaq, deleteGeneralFaq } from "./actions";

export default async function AdminFaqPage() {
  const [faqs, session] = await Promise.all([
    prisma.generalFAQ.findMany({ orderBy: [{ audience: "asc" }, { order: "asc" }] }),
    getServerSession(authOptions),
  ]);
  const isOwner = session?.user.role === "OWNER";

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-bold text-ink">Manage FAQ</h1>

      <div className="mt-4 flex flex-col gap-2">
        {faqs.map((faq) => (
          <EditableCard
            key={faq.id}
            isOwner={isOwner}
            updateAction={updateGeneralFaq.bind(null, faq.id)}
            deleteAction={deleteGeneralFaq.bind(null, faq.id)}
            summary={
              <>
                <span className="mr-2 rounded-full bg-paper px-2 py-0.5 text-[10px] font-semibold uppercase text-ink-faint">
                  {faq.audience === "CUSTOMER" ? "Customer" : "Reseller"}
                </span>
                <span className="font-semibold text-ink">{faq.question}</span>
                <div className="mt-1 whitespace-pre-wrap text-sm text-ink-soft">{faq.answer}</div>
              </>
            }
            formFields={
              <>
                <Select
                  label="Audience"
                  name="audience"
                  defaultValue={faq.audience}
                  options={[
                    { value: "CUSTOMER", label: "Customer" },
                    { value: "RESELLER", label: "Reseller" },
                  ]}
                />
                <Field label="Pertanyaan" name="question" defaultValue={faq.question} required />
                <TextArea label="Jawaban" name="answer" defaultValue={faq.answer} required rows={3} hint="Mendukung Markdown." />
              </>
            }
          />
        ))}
        {faqs.length === 0 && <p className="text-sm text-ink-faint">Belum ada FAQ umum.</p>}
      </div>

      <form action={addGeneralFaq} className="mt-6 flex flex-col gap-3 rounded-md border border-line p-4">
        <div className="text-sm font-semibold text-ink">Tambah FAQ</div>
        <Select
          label="Audience"
          name="audience"
          defaultValue="CUSTOMER"
          options={[
            { value: "CUSTOMER", label: "Customer" },
            { value: "RESELLER", label: "Reseller" },
          ]}
        />
        <Field label="Pertanyaan" name="question" required />
        <TextArea label="Jawaban" name="answer" required rows={3} hint="Mendukung Markdown." />
        <SubmitButton>Tambah</SubmitButton>
      </form>
    </div>
  );
}
