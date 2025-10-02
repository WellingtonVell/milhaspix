export const OFFERS_KEYS = {
  all: ["offers"],
  lists: () => [...OFFERS_KEYS.all, "lists"],
} as const;
