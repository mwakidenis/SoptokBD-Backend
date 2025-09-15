import mongoose, { Schema } from 'mongoose';
import { TOrder } from './order.interface';

const orderedProductSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, required: true, ref: 'product' },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    requiredPrescription: { type: Boolean, required: true },
  },
  { _id: false },
);

const orderSchema = new Schema<TOrder>(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'user' },
    name: { type: String, required: true },
    email: { type: String, required: true },
    products: {
      type: [orderedProductSchema],
      required: true,
    },
    prescription: {
      type: String,
    },
    shippingInfo: {
      shippingAddress: { type: String, required: true },
      shippingCity: { type: String, required: true },
    },
    shippingCost: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    prescriptionReviewStatus: {
      type: String,
      enum: ['pending', 'ok', 'cancelled'],
      default: 'pending',
    },
    orderStatus: {
      type: String,
      enum: ['pending', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    paymentStatus: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export const Order = mongoose.model<TOrder>('Order', orderSchema);
