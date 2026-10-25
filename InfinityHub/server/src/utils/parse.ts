/** Parse a query/body value into a finite number, otherwise undefined. */
export function toFiniteNumber(value: unknown): number | undefined {
  if (value === undefined || value === null || value === '') return undefined;
  const n = typeof value === 'number' ? value : parseFloat(String(value));
  return Number.isFinite(n) ? n : undefined;
}

/** Parse a query/body value into an integer, otherwise undefined. */
export function toInt(value: unknown): number | undefined {
  const n = toFiniteNumber(value);
  return n === undefined ? undefined : Math.trunc(n);
}
