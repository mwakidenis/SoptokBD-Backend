import { RequestHandler } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import HttpStatus from 'http-status';
import { ProductServices } from './product.service';

// createProduct
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

// getSingleProduct
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

// getAllProducts
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

// updateProduct
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

// deleteProduct
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

// exporting all controllers
export const ProductControllers = {
  createProduct,
  updateProduct,
  getAllProducts,
  getSingleProduct,
  deleteProduct,
};
