export const journalQueryKeys = {
  all: (userId: string | null) => ['journals', userId] as const,
  categories: (userId: string | null) => ['journals', userId, 'categories'] as const,
  category: (userId: string | null, categoryId: string | null) =>
    ['journals', userId, 'categories', categoryId] as const,
  journalsByCategory: (userId: string | null, categoryId: string | null) =>
    ['journals', userId, 'categories', categoryId, 'entries'] as const,
  journal: (userId: string | null, journalId: string | null) =>
    ['journals', userId, 'entries', journalId] as const,
};
