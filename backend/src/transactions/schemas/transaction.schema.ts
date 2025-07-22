import * as mongoose from 'mongoose';
import { User } from 'src/users/schemas/user.schema';
import { Category } from 'src/categories/schemas/category.schema';
import { CardInvoice } from 'src/card-invoices/schemas/card-invoice.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TransactionDocument = Transaction & Document;

@Schema({ timestamps: true })
export class Transaction {
  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  value: number;

  @Prop({ required: true, enum: ['income', 'expense', 'card_expense'] })
  type: 'income' | 'expense' | 'card_expense';

  @Prop({ required: true, default: () => new Date() })
  date: Date;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: false,
  })
  categoryId?: Category;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CardInvoice',
    required: false,
  })
  cardInvoiceId?: CardInvoice;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: User;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
