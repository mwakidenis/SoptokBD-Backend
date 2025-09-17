/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import httpStatus from 'http-status';

import SSLCommerz from 'sslcommerz-lts';
import config from '../../config';
import AppError from '../../errors/AppError';
import { Order } from '../order/order.model';

const makePaymentWithPrescription = async (data: any, paymentInfo: any) => {
  const sslcz = new SSLCommerz(
    config.ssl_store_id as string,
    config.ssl_store_password as string,
    config.ssl_is_live as boolean,
  );

  try {
    const order = await Order.findById(paymentInfo._id);

    if (!order) {
      throw new AppError(httpStatus.NOT_FOUND, 'Order is not Found');
    }

    const apiResponse = await sslcz.init(data);

    const GatewayPageURL = apiResponse.GatewayPageURL;

    if (GatewayPageURL) {
      await Order.findByIdAndUpdate(
        paymentInfo._id,
        { paymentStatus: true },
        {
          new: true,
          runValidators: true,
        },
      );
      return GatewayPageURL;
    } else {
      throw new AppError(
        httpStatus.BAD_GATEWAY,
        'Failed to generate payment gateway URL.',
      );
    }
  } catch (error) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'An error occurred while processing payment.',
    );
  }
};

export const PaymentServices = { makePaymentWithPrescription };
