export function isRefPopulated<T>(value: unknown): value is T {
  return typeof value === 'object' && value !== null && !('toHexString' in value);
}