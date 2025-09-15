import mongoose, { Schema } from 'mongoose';
import { TProduct } from './product.interface';

const productSchema = new Schema<TProduct>(
  {
    name: { type: String, required: true, trim: true, unique: true },
    type: {
      type: String,
      enum: [
        'Tablet',
        'Capsule',
        'Syrup',
        'Injection',
        'Cream',
        'Drops',
        'Food',
        'Skin',
        'Baby',
      ],
      required: true,
    },
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
    expireDate: { type: String, required: true },
    inStock: { type: Boolean, required: true, default: true },
    requiredPrescription: { type: Boolean },
  },
  { timestamps: true },
);

export const Product = mongoose.model<TProduct>('Product', productSchema);
