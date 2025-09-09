/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';

import config from '../config';
import AppError from '../errors/AppError';
import { User } from '../modules/user/user.model';
import { TUserRole } from '../modules/user/user.interface';

export const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.headers.authorization;

    if (!accessToken) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
    }

    let decoded;

    try {
      decoded = jwt.verify(
        accessToken,
        config.jwt_access_secret as string,
      ) as JwtPayload;
    } catch (err: any) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'Unauthorized');
    }

    const { id, role } = decoded;

    const user = await User.findById(id);

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
    }

    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized !');
    }

    req.user = decoded as JwtPayload & { role: string };

    next();
  });
};
