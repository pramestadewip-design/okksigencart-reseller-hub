export function str(fd: FormData, key: string): string {
  const v = fd.get(key);
  return typeof v === "string" ? v.trim() : "";
}

export function optStr(fd: FormData, key: string): string | null {
  const v = str(fd, key);
  return v === "" ? null : v;
}

export function requiredStr(fd: FormData, key: string): string {
  const v = str(fd, key);
  if (!v) throw new Error(`Field "${key}" wajib diisi.`);
  return v;
}

export function num(fd: FormData, key: string): number {
  const v = fd.get(key);
  const n = Number(v);
  if (Number.isNaN(n)) throw new Error(`Field "${key}" harus berupa angka.`);
  return n;
}

export function optNum(fd: FormData, key: string): number | null {
  const v = str(fd, key);
  if (v === "") return null;
  const n = Number(v);
  if (Number.isNaN(n)) throw new Error(`Field "${key}" harus berupa angka.`);
  return n;
}

export function bool(fd: FormData, key: string): boolean {
  return fd.get(key) === "on" || fd.get(key) === "true";
}
