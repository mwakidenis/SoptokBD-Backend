import { RequestHandler } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import HttpStatus from 'http-status';
import { BannerServices } from './banner.service';

// createBanner
const createBanner: RequestHandler = catchAsync(async (req, res) => {
  console.log(req.body);
  const result = await BannerServices.createBannerIntoDB(req.body);
  sendResponse(res, {
    success: true,
    statusCode: HttpStatus.OK,
    message: 'Banner created successfully',
    data: result,
  });
});

// getAllBanners
const getAllBanners: RequestHandler = catchAsync(async (req, res) => {
  const result = await BannerServices.getBannersFromDB();
  sendResponse(res, {
    success: true,
    statusCode: HttpStatus.OK,
    message: 'Banners are retrieved successfully',
    data: result,
  });
});

// deleteProduct
const deleteBanner: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await BannerServices.deleteBannerFromDB(id);
  sendResponse(res, {
    success: true,
    statusCode: HttpStatus.OK,
    message: 'Banner is deleted successfully',
    data: result,
  });
});

// exporting all controllers
export const BannerControllers = {
  createBanner,
  getAllBanners,
  deleteBanner,
};
