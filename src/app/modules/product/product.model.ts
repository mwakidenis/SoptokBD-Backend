import mongoose, { Schema } from 'mongoose';
import { TProduct } from './product.interface';

const productSchema = new Schema<TProduct>(
  {
    name: { type: String, required: true, trim: true, unique: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    price: {
      type: Number,
      validate: {
        validator: function (p) {
          return p > 0;
        },
      },
    },
    discount: { type: Number, default: 0, max: 100 },
    imageUrl: { type: [String], validate: (v: string[]) => v.length > 0 },
    manufacturer: { type: String, required: true },
    quantity: { type: Number, required: true, min: 0 },
    inStock: { type: Boolean, required: true, default: true },
  },
  { timestamps: true },
);

export const Product = mongoose.model<TProduct>('Product', productSchema);
