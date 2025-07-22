import type { CreditCard } from './creditCard';

export interface CardInvoice {
  _id: string;
  month: number;
  year: number;
  status: string;
  creditCard: CreditCard;
}