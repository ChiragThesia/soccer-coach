import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type ProgressDocument = Progress & Document;

@Schema({ timestamps: true })
export class Progress {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: User;

  @Prop({ required: true })
  athleteAge: number;

  @Prop({ required: true })
  juggles: number;

  @Prop({ required: true })
  kickDistance: number;

  @Prop()
  videoUrl?: string;

  @Prop({ default: Date.now })
  date: Date;
}

export const ProgressSchema = SchemaFactory.createForClass(Progress);
