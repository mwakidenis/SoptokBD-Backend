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

// exporting all controllers
export const BannerControllers = {
  createBanner,
};
