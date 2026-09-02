import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";

// remarkBreaks: satu kali Enter di textarea admin jadi satu baris baru
// (bukan aturan Markdown baku yang butuh baris kosong) — lebih sesuai
// ekspektasi non-teknis yang biasa nulis di WhatsApp/chat.
export function Markdown({ children, className = "" }: { children: string; className?: string }) {
  return (
    <div className={`leading-relaxed [&_a]:underline [&_p+p]:mt-2 [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:pl-5 ${className}`}>
      <ReactMarkdown remarkPlugins={[remarkBreaks]}>{children}</ReactMarkdown>
    </div>
  );
}
