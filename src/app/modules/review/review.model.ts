import { model, Schema } from 'mongoose';
import { IReview } from './review.interface';

const reviewSchema = new Schema<IReview>(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    productId: { type: Schema.Types.ObjectId, required: true, ref: 'Product' },
    title: { type: String, required: true },
    description: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
  },
  {
    timestamps: true,
  },
);

export const Review = model<IReview>('Review', reviewSchema);
