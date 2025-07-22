import type { Category } from './category';
import type { CardInvoice } from './cardInvoice';

export interface Transaction {
  _id: string;
  description: string;
  value: number;
  type: 'income' | 'expense' | 'card_expense';
  date: string;
  category?: Category;
  categoryId?: string | null;
  cardInvoice: CardInvoice | null;
  cardInvoiceId?: string | null;
}