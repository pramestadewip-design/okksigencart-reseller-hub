export function ErrorBanner({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <div className="mb-4 rounded-md border border-maroon-tint bg-maroon-tint px-3.5 py-2.5 text-sm text-maroon">
      {message}
    </div>
  );
}
