import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { TProduct } from './product.interface';
import { Product } from './product.model';
import QueryBuilder from '../../builder/QueryBuilder';
import { productSearchableFields } from './product.constant';

// createProductIntoDB
const createProductIntoDB = async (payload: TProduct) => {
  const result = await Product.create(payload);
  return result;
};

// getSingleProductFromDB
const getSingleProductFromDB = async (id: string) => {
  const product = await Product.findById(id);
  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, 'No Product is  found!');
  }
  const result = await Product.findById(id);
  return result;
};

// getProductsFromDB
const getProductsFromDB = async (query: Record<string, unknown>) => {
  const productQuery = new QueryBuilder(
    Product.find().sort({ createdAt: -1 }),
    query,
  )
    .search(productSearchableFields)
    .filter()
    .paginate();
  const result = await productQuery.modelQuery;
  const meta = await productQuery.countTotal();
  return { result, meta };
};

// updateProductFromDB
const updateProductFromDB = async (id: string, payload: Partial<TProduct>) => {
  const product = await Product.findById(id);
  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, 'No product is found!');
  }
  const result = await Product.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

// deleteProductFromDB
const deleteProductFromDB = async (id: string) => {
  const product = await Product.findById(id);
  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, 'No Product is found!');
  }
  const result = await Product.findByIdAndDelete(id);
  return result;
};

// exporting all services
export const ProductServices = {
  createProductIntoDB,
  updateProductFromDB,
  getProductsFromDB,
  getSingleProductFromDB,
  deleteProductFromDB,
};
