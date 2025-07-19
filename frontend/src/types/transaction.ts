import type { Category } from './category';

export interface Transaction {
  _id: string;
  id: string | null;
  description: string;
  value: number;
  type: 'income' | 'expense';
  date: string;
  category?: Category;
  categoryId?: string | null;
}