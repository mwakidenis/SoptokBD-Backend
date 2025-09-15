import HttpStatus from 'http-status';
import { RequestHandler } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { OrderServices } from './order.service';

const createOrderWithPrescription: RequestHandler = catchAsync(
  async (req, res) => {
    const orderInfo = req.body;

    const result =
      await OrderServices.createOrderWithPrescriptionIntoDB(orderInfo);

    sendResponse(res, {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Prescription is under review.',
      data: result,
    });
  },
);

const createOrderPaymentWithoutPrescription: RequestHandler = catchAsync(
  async (req, res) => {
    const orderInfo = req.body;

    const result =
      await OrderServices.createOrderPaymentWithoutPrescriptionIntoDB(
        orderInfo,
      );

    sendResponse(res, {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Order placing..Pay quickly!',
      data: result,
    });
  },
);

const getAllOrder: RequestHandler = catchAsync(async (req, res) => {
  const result = await OrderServices.getAllOrderFromDB();

  sendResponse(res, {
    success: true,
    statusCode: HttpStatus.OK,
    message: 'Orders are retived successfully',
    data: result,
  });
});

const getUserOrders: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await OrderServices.getUserOrdersFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: HttpStatus.OK,
    message: 'Your Orders are retrived successfully',
    data: result,
  });
});

const getSpecificOrder: RequestHandler = catchAsync(async (req, res) => {
  const { orderId } = req.params;

  const result = await OrderServices.getSpecificOrderFromDB(orderId);

  sendResponse(res, {
    success: true,
    statusCode: HttpStatus.OK,
    message: 'Order is retrived successfully',
    data: result,
  });
});

const updateOrder: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await OrderServices.updateOrderIntoDB(id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: HttpStatus.OK,
    message: 'Order info is updated successfully',
    data: result,
  });
});

const updatePrescriptionReview: RequestHandler = catchAsync(
  async (req, res) => {
    const { id } = req.params;

    const result = await OrderServices.updatePrescriptionReviewIntoDB(
      id,
      req.body,
    );

    sendResponse(res, {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Prescription review status is updated successfully',
      data: result,
    });
  },
);

export const OrderController = {
  createOrderWithPrescription,
  updatePrescriptionReview,
  createOrderPaymentWithoutPrescription,
  getUserOrders,
  getSpecificOrder,
  getAllOrder,
  updateOrder,
};
