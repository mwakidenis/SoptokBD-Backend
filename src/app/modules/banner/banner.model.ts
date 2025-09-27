import mongoose, { Schema } from 'mongoose';
import { TBanner } from './banner.interface';

const bannerSchema = new Schema<TBanner>({
  heading: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: [String], validate: (v: string[]) => v.length > 0 },
});

export const Banner = mongoose.model<TBanner>('Banner', bannerSchema);
