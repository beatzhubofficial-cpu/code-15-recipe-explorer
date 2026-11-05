import "server-only";

export const FAVORITES_COOKIE_NAME = "savor-favorites";
export const MAX_FAVORITES = 50;

export function parseFavoriteIds(value: string | undefined): string[] {
  if (!value) {
    return [];
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(value);
  } catch {
    return [];
  }

  if (!Array.isArray(parsed)) {
    return [];
  }

  const ids = parsed.filter(
    (id): id is string => typeof id === "string" && /^\d{1,10}$/.test(id),
  );
  return [...new Set(ids)].slice(0, MAX_FAVORITES);
}
