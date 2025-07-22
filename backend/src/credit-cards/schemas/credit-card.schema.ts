import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

export type CreditCardDocument = CreditCard & mongoose.Document;

@Schema({ timestamps: true })
export class CreditCard {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  closingDay: number;

  @Prop({ required: true })
  dueDay: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: User;
}

export const CreditCardSchema = SchemaFactory.createForClass(CreditCard);
