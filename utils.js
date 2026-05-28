export function parsePriceToCents(value) {
  if (!value) return null;

  if (!value.trim()) return null;

  if (!isFinite(Number(value))) return null;

  return Number(value) * 100;
}
