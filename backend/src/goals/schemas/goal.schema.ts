import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

export type GoalDocument = Goal & mongoose.Document;

@Schema({ timestamps: true })
export class Goal {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  targetValue: number;

  @Prop({ required: true, default: 0 })
  currentValue: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: User;
}

export const GoalSchema = SchemaFactory.createForClass(Goal);
