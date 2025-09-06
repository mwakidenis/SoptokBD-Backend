import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
import ms from 'ms';

export const createToken = (
  jwtPayload: { id: Types.ObjectId; name: string; email: string; role: string },
  secret: string,
  expiresIn: string,
) => {
  return jwt.sign(jwtPayload, secret, {
    expiresIn: Math.floor(ms(expiresIn as ms.StringValue) / 1000),
  });
};
