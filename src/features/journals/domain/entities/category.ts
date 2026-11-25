export interface Category {
  id: string;
  userId: string;
  title: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DeleteCategoryResult {
  deletedCategoryId: string;
  defaultCategoryId: string;
  movedJournalsCount: number;
}
