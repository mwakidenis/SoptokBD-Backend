import { Types } from 'mongoose';

export interface IReview {
  userId: Types.ObjectId;
  productId: Types.ObjectId;
  title: string;
  description: string;
  rating: number;
}
