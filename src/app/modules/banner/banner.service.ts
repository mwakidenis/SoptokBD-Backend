import httpStatus from 'http-status';

import { TBanner } from './banner.interface';
import AppError from '../../errors/AppError';
import { Banner } from './banner.model';

// createBannerIntoDB
const createBannerIntoDB = async (payload: TBanner) => {
  const result = await Banner.create(payload);
  return result;
};

// getBannersFromDB
const getBannersFromDB = async () => {
  const result = await Banner.find().sort({ createdAt: -1 });
  return result;
};

// deleteBannerFromDB
const deleteBannerFromDB = async (id: string) => {
  const banner = await Banner.findById(id);
  if (!banner) {
    throw new AppError(httpStatus.NOT_FOUND, 'No Banner is found!');
  }
  const result = await Banner.findByIdAndDelete(id);
  return result;
};

// exporting all services
export const BannerServices = {
  createBannerIntoDB,
  getBannersFromDB,
  deleteBannerFromDB,
};
