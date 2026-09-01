import ReactMarkdown from "react-markdown";

export function Markdown({ children, className = "" }: { children: string; className?: string }) {
  return (
    <div className={`leading-relaxed [&_a]:underline [&_p+p]:mt-2 [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:pl-5 ${className}`}>
      <ReactMarkdown>{children}</ReactMarkdown>
    </div>
  );
}
