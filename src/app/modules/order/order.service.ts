import SSLCommerz from 'sslcommerz-lts';
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { Product } from '../product/product.model';
import { User } from '../user/user.model';
import { PaymentData, TOrder } from './order.interface';
import { Order } from './order.model';
import { orderStatus } from './order.constant';
import config from '../../config';
import { sendTestEmail } from '../emailNotification/emailNotification';

// Create Order + Payment
export const createOrderPaymentIntoDB = async (
  payload: TOrder,
): Promise<string> => {
  const { totalPrice, name, email, products, shippingInfo, userId } = payload;

  if (!totalPrice) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Total price is required.');
  }

  if (!products?.length) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'At least one product is required.',
    );
  }

  if (!shippingInfo?.shippingAddress || !shippingInfo?.shippingCity) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Shipping info is required.');
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found.');
  }

  if (user.role !== 'user') {
    throw new AppError(httpStatus.FORBIDDEN, 'Only users can place orders.');
  }

  // Check stock
  const productIds = products.map((p) => p.productId);
  const dbProducts = await Product.find({ _id: { $in: productIds } });
  const outOfStock: string[] = [];

  for (const dbProduct of dbProducts) {
    const orderItem = products.find(
      (p) => p.productId.toString() === dbProduct._id.toString(),
    );

    if (!orderItem || dbProduct.quantity < orderItem.quantity) {
      outOfStock.push(dbProduct.name);
    } else {
      dbProduct.quantity -= orderItem.quantity;
      if (dbProduct.quantity <= 0) dbProduct.inStock = false;
      await dbProduct.save();
    }
  }

  if (outOfStock.length > 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Out of stock: ${outOfStock.join(', ')}`,
    );
  }

  const tran_id = `txn_${Date.now()}`;
  const productNames = products.map((p) => p.name || 'Unknown').join('-');

  const paymentData: PaymentData = {
    total_amount: totalPrice,
    currency: 'BDT',
    tran_id,
    success_url: config.ssl_success_url as string,
    fail_url: config.ssl_failed_url as string,
    cancel_url: config.ssl_cancel_url as string,
    ipn_url: config.ssl_ipn_url as string,
    shipping_method: 'Courier',
    product_name: productNames,
    product_category: 'Medicine',
    product_profile: 'general',
    cus_name: name,
    cus_email: email,
    cus_add1: shippingInfo.shippingAddress,
    cus_add2: '',
    cus_city: shippingInfo.shippingCity,
    cus_state: '',
    cus_postcode: '1000',
    cus_country: 'Bangladesh',
    cus_phone: '01711111111',
    cus_fax: '01711111111',
    ship_name: name,
    ship_add1: shippingInfo.shippingAddress,
    ship_add2: '',
    ship_city: shippingInfo.shippingCity,
    ship_state: '',
    ship_postcode: 1000,
    ship_country: 'Bangladesh',
  };

  const sslcz = new SSLCommerz(
    config.ssl_store_id,
    config.ssl_store_password,
    config.ssl_is_live,
  );

  const apiResponse = await sslcz.init(paymentData);
  const gatewayUrl = apiResponse?.GatewayPageURL;

  if (!gatewayUrl) {
    throw new AppError(
      httpStatus.BAD_GATEWAY,
      'Failed to generate payment URL.',
    );
  }

  await Order.create({
    ...payload,
    paymentStatus: true, // ✅ mark paid after SSL init
  });

  return gatewayUrl;
};

// ✅ Get all orders (Admin use)
const getAllOrderFromDB = async () => {
  return await Order.find();
};

// ✅ Get all orders for a user
const getUserOrdersFromDB = async (id: string) => {
  return await Order.find({ userId: id });
};

// ✅ Get a specific order
const getSpecificOrderFromDB = async (id: string) => {
  const result = await Order.findById(id).populate({
    path: 'products.productId',
    model: 'Product',
  });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Order not found');
  }

  return result;
};

// ✅ Update order status (no prescription checks anymore)
const updateOrderIntoDB = async (id: string, payload: Partial<TOrder>) => {
  const orderInfo = await Order.findById(id);
  if (!orderInfo) {
    throw new AppError(httpStatus.NOT_FOUND, 'Order not found');
  }

  if (!orderInfo.paymentStatus) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Order is unpaid.');
  }

  const currentStatus = orderInfo.orderStatus;
  const newStatus = payload.orderStatus;

  if (!newStatus || newStatus === currentStatus) {
    return await Order.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });
  }

  if (currentStatus === orderStatus.CANCELLED) {
    throw new AppError(httpStatus.CONFLICT, 'Order already cancelled.');
  }

  if (currentStatus === orderStatus.DELIVERED) {
    throw new AppError(httpStatus.CONFLICT, 'Order already delivered.');
  }

  const allowedTransitions: Record<string, string[]> = {
    [orderStatus.PENDING]: [orderStatus.SHIPPED, orderStatus.CANCELLED],
    [orderStatus.SHIPPED]: [orderStatus.DELIVERED, orderStatus.CANCELLED],
    [orderStatus.DELIVERED]: [],
    [orderStatus.CANCELLED]: [],
  };

  if (!allowedTransitions[currentStatus]?.includes(newStatus)) {
    throw new AppError(
      httpStatus.CONFLICT,
      `Cannot change status from ${currentStatus} to ${newStatus}`,
    );
  }

  const result = await Order.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (result) {
    const user = await User.findById(orderInfo.userId);
    if (user) {
      await sendTestEmail(
        user.email as string,
        user.name as string,
        payload?.orderStatus as string,
        'Order Status Update',
      );
    }
  }

  return result;
};

export const OrderServices = {
  createOrderPaymentIntoDB,
  getSpecificOrderFromDB,
  getUserOrdersFromDB,
  updateOrderIntoDB,
  getAllOrderFromDB,
};
