import SSLCommerz from 'sslcommerz-lts';
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { Product } from '../product/product.model';
import { User } from '../user/user.model';
import { PaymentData, TOrder } from './order.interface';
import { Order } from './order.model';
import {
  orderStatus,
  prescriptionReviewStatus,
  TOrderStatus,
  TPrescriptionReviewStatus,
} from './order.constant';
import config from '../../config';
import { sendTestEmail } from '../emailNotification/emailNotification';

const createOrderWithPrescriptionIntoDB = async (payload: TOrder) => {
  const user = await User.findById(payload.userId);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'There is no User found');
  }

  if (user.role !== 'user') {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'Sorry! Admin cannot place an order.',
    );
  }

  const productIds = payload.products.map((p) => p.productId);

  const outOfStockProducts = await Product.find({
    _id: { $in: productIds },
    quantity: { $lte: 0 },
  }).select('_id name');

  if (outOfStockProducts.length > 0) {
    const names = outOfStockProducts.map((p) => p.name).join(', ');
    throw new AppError(httpStatus.BAD_REQUEST, `Out of stock: ${names}`);
  }

  for (const item of payload.products) {
    const product = await Product.findById(item.productId);
    if (!product || product.quantity < item.quantity) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Not enough stock for product: ${product?.name || 'Unknown'}`,
      );
    }
  }

  const result = await Order.create(payload);

  for (const item of payload.products) {
    const product = await Product.findById(item.productId);
    if (product) {
      product.quantity -= item.quantity;
      await product.save();
    }
  }

  return result;
};

export const createOrderPaymentWithoutPrescriptionIntoDB = async (
  payload: TOrder,
): Promise<string> => {
  const { totalPrice, name, email, products, shippingInfo, userId } = payload;

  if (!totalPrice) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Total price is required for payment initialization.',
    );
  }

  if (!products?.length) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'At least one product must be selected.',
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
    throw new AppError(
      httpStatus.FORBIDDEN,
      'Only users are allowed to place orders.',
    );
  }

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

      if (dbProduct.quantity <= 0) {
        dbProduct.inStock = false;
      }

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
    console.error('SSLCommerz Error:', apiResponse);
    throw new AppError(
      httpStatus.BAD_GATEWAY,
      'Failed to generate payment gateway URL.',
    );
  }

  await Order.create({
    ...payload,
    paymentStatus: true,
  });

  return gatewayUrl;
};

const getAllOrderFromDB = async () => {
  const result = await Order.find();

  return result;
};

const getUserOrdersFromDB = async (id: string) => {
  const result = await Order.find({ userId: id });

  // .populate('product')

  return result;
};

const getSpecificOrderFromDB = async (id: string) => {
  const result = await Order.findById(id).populate({
    path: 'products.productId',
    model: 'Product',
  });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'There is no Order found');
  }

  return result;
};

const updateOrderIntoDB = async (id: string, payload: Partial<TOrder>) => {
  const orderInfo = await Order.findById(id);

  const user = await User.findById(orderInfo?.userId);

  if (!orderInfo) {
    throw new AppError(httpStatus.NOT_FOUND, 'There is no order found');
  }

  if (orderInfo.prescription && orderInfo.prescriptionReviewStatus !== 'ok') {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Change prescription review status first',
    );
  }

  if (!orderInfo.paymentStatus) {
    throw new AppError(httpStatus.NOT_FOUND, 'User has to pay first..');
  }

  const currentStatus = orderInfo.orderStatus;
  const newStatus = payload.orderStatus;

  if (!newStatus || newStatus === currentStatus) {
    const result = await Order.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });
    return result;
  }

  if (currentStatus === orderStatus.CANCELLED) {
    throw new AppError(
      httpStatus.CONFLICT,
      'Order is cancelled. Cannot change status.',
    );
  }

  if (currentStatus === orderStatus.DELIVERED) {
    throw new AppError(
      httpStatus.CONFLICT,
      'Order is already delivered. Cannot change status.',
    );
  }

  const allowedTransitions: Record<string, string[]> = {
    [orderStatus.PENDING]: [orderStatus.SHIPPED, orderStatus.CANCELLED],
    [orderStatus.SHIPPED]: [orderStatus.DELIVERED, orderStatus.CANCELLED],
    [orderStatus.DELIVERED]: [],
    [orderStatus.CANCELLED]: [],
  };

  if (
    !currentStatus ||
    !allowedTransitions[currentStatus]?.includes(newStatus)
  ) {
    throw new AppError(
      httpStatus.CONFLICT,
      `Cannot change order status from ${currentStatus} to ${newStatus}`,
    );
  }

  const result = await Order.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (result) {
    await sendTestEmail(
      user?.email as string,
      user?.name as string,
      payload?.orderStatus as string,
      'Order status',
    );
  }

  return result;
};

const updatePrescriptionReviewIntoDB = async (
  id: string,
  payload: Partial<TOrder>,
) => {
  const orderInfo = await Order.findById(id);

  const user = await User.findById(orderInfo?.userId);

  if (!orderInfo) {
    throw new AppError(httpStatus.NOT_FOUND, 'There is no order found');
  }

  const currentPrescriptionStatus =
    orderInfo.prescriptionReviewStatus as TPrescriptionReviewStatus;
  const newPrescriptionStatus =
    payload.prescriptionReviewStatus as TPrescriptionReviewStatus;

  if (
    !newPrescriptionStatus ||
    newPrescriptionStatus === currentPrescriptionStatus
  ) {
    return await Order.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });
  }

  const currentOrderStatus = orderInfo.orderStatus as TOrderStatus;
  if (
    currentOrderStatus === orderStatus.CANCELLED ||
    currentOrderStatus === orderStatus.DELIVERED
  ) {
    throw new AppError(
      httpStatus.CONFLICT,
      `Order is already ${currentOrderStatus}. Cannot change prescription review status.`,
    );
  }

  const allowedTransitions: Record<
    TPrescriptionReviewStatus,
    TPrescriptionReviewStatus[]
  > = {
    [prescriptionReviewStatus.PENDING]: [
      prescriptionReviewStatus.OK,
      prescriptionReviewStatus.CANCELLED,
    ],
    [prescriptionReviewStatus.OK]: [],
    [prescriptionReviewStatus.CANCELLED]: [],
  };

  if (
    !allowedTransitions[currentPrescriptionStatus]?.includes(
      newPrescriptionStatus,
    )
  ) {
    throw new AppError(
      httpStatus.CONFLICT,
      `Cannot change prescription review status from ${currentPrescriptionStatus} to ${newPrescriptionStatus}`,
    );
  }

  const res = await Order.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (res) {
    await sendTestEmail(
      user?.email as string,
      user?.name as string,
      payload?.prescriptionReviewStatus as string,
      'Prescription review',
    );
  }

  return res;
};

export const OrderServices = {
  createOrderWithPrescriptionIntoDB,
  updatePrescriptionReviewIntoDB,
  createOrderPaymentWithoutPrescriptionIntoDB,
  getSpecificOrderFromDB,
  getUserOrdersFromDB,
  updateOrderIntoDB,
  getAllOrderFromDB,
};
