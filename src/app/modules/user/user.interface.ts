import { Model } from 'mongoose';
import { USER_ROLE } from './user.constant';

export type TUser = {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
};

export interface UserModel extends Model<TUser> {
  isPasswordMached(): Promise<boolean>;
}

export type TUserRole = keyof typeof USER_ROLE;
