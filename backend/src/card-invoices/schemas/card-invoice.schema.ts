import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from 'src/users/schemas/user.schema';
import { CreditCard } from 'src/credit-cards/schemas/credit-card.schema';

export type CardInvoiceDocument = CardInvoice & mongoose.Document;

export enum InvoiceStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  PAID = 'PAID',
}

@Schema({ timestamps: true })
export class CardInvoice {
  @Prop({ required: true })
  month: number;

  @Prop({ required: true })
  year: number;

  @Prop({ required: true, enum: InvoiceStatus, default: InvoiceStatus.OPEN })
  status: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CreditCard',
    required: true,
  })
  creditCardId: CreditCard;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: User;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const CardInvoiceSchema = SchemaFactory.createForClass(CardInvoice);
