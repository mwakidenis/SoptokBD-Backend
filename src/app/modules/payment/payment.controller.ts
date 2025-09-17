/* eslint-disable @typescript-eslint/no-explicit-any */
import HttpStatus from 'http-status';
import { RequestHandler } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { PaymentServices } from './payment.service';
import config from '../../config';

const makePayment: RequestHandler = catchAsync(async (req, res) => {
  const { totalPrice, products, shippingInfo, name, email } = req.body;

  const productName = products.map((product: any) => product.name).join('-');

  const data = {
    total_amount: totalPrice,
    currency: 'BDT',
    tran_id: `txn_${Date.now()}`,
    success_url: `${config.ssl_success_url}`,
    fail_url: `${config.ssl_failed_url}`,
    cancel_url: `${config.ssl_cancel_url}`,
    ipn_url: `${config.ssl_ipn_url}`,
    shipping_method: 'Courier',
    product_name: productName,
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

  const result = await PaymentServices.makePaymentWithPrescription(
    data,
    req.body,
  );

  sendResponse(res, {
    success: true,
    statusCode: HttpStatus.OK,
    message: 'Payment process is ongoing...',
    data: result,
  });
});

export const PaymentController = { makePayment };
