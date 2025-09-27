import { TBanner } from './banner.interface';
import { Banner } from './banner.model';

// createBannerIntoDB
const createBannerIntoDB = async (payload: TBanner) => {
  const result = await Banner.create(payload);
  return result;
};

// exporting all services
export const BannerServices = {
  createBannerIntoDB,
};
