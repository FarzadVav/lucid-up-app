import type {
  Category,
  DeleteCategoryResult,
} from '@/features/journals/domain/entities/category';

export interface CategoryRepository {
  listByUser(userId: string): Promise<Category[]>;
  getById(categoryId: string, userId: string): Promise<Category | null>;
  getDefaultByUser(userId: string): Promise<Category | null>;
  create(title: string): Promise<Category>;
  update(categoryId: string, userId: string, title: string): Promise<Category>;
  delete(categoryId: string): Promise<DeleteCategoryResult>;
}
