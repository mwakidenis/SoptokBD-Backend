import { RequestHandler } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import HttpStatus from 'http-status';
import { ProductServices } from './product.service';

const createProduct: RequestHandler = catchAsync(async (req, res) => {
  console.log(req.body);
  const result = await ProductServices.createProductIntoDB(req.body);

  sendResponse(res, {
    success: true,
    statusCode: HttpStatus.OK,
    message: 'Product created successfully',
    data: result,
  });
});

const getSingleProduct: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await ProductServices.getSingleProductFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: HttpStatus.OK,
    message: 'Product retrived successfully',
    data: result,
  });
});

const getAllProducts: RequestHandler = catchAsync(async (req, res) => {
  const result = await ProductServices.getProductsFromDB(req.query);

  sendResponse(res, {
    success: true,
    statusCode: HttpStatus.OK,
    message: 'Products are retived successfully',
    meta: result.meta,
    data: result.result,
  });
});

const updateProduct: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await ProductServices.updateProductFromDB(id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: HttpStatus.OK,
    message: 'Product is updated successfully',
    data: result,
  });
});

const deleteProduct: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await ProductServices.deleteProductFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: HttpStatus.OK,
    message: 'Product is deleted successfully',

    data: result,
  });
});

export const ProductControllers = {
  createProduct,
  updateProduct,
  getAllProducts,
  getSingleProduct,
  deleteProduct,
};
