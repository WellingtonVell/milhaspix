export const ANNOUNCEMENT_KEYS = {
  all: ["announcement"],
  lists: () => [...ANNOUNCEMENT_KEYS.all, "lists"],
  list: (params: { mileValue: number }) => [
    ...ANNOUNCEMENT_KEYS.all,
    "list",
    params.mileValue,
  ],
} as const;
