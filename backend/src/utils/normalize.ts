export function normalizeCompany(name: string): string {
  return name.trim().replace(/\s+/g, ' ').toLowerCase();
}
