// Slug dibuat otomatis dari nama — admin tidak perlu mengisinya sendiri
// (salah satu poin "maintenance seminimal mungkin" dari kebutuhan awal).
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
