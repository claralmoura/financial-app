import * as mongoose from 'mongoose';
import { User } from 'src/users/schemas/user.schema';
import { Category } from 'src/categories/schemas/category.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TransactionDocument = Transaction & Document;

@Schema({ timestamps: true })
export class Transaction {
  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  value: number;

  @Prop({ required: true })
  type: 'income' | 'expense';

  @Prop({ required: true, default: () => new Date() })
  date: Date;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: false,
  })
  categoryId?: Category;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: User;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
