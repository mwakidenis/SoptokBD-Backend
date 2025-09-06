import mongoose, { Schema } from 'mongoose';
import { TUser, UserModel } from './user.interface';
import bcrypt from 'bcrypt';
import config from '../../config';

const userSchema = new Schema<TUser, UserModel>(
  {
    name: {
      required: true,
      type: String,
    },
    email: {
      required: true,
      type: String,
      unique: true,
    },
    password: {
      required: true,
      type: String,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_rounds),
  );

  next();
});

userSchema.post('save', function (doc, next) {
  doc.password = '';

  next();
});

// userSchema.pre('findOne', function (next) {
//   this.select('-password');
//   next();
// });

userSchema.pre('find', function (next) {
  this.select('-password');
  next();
});

userSchema.statics.isPasswordMached = async function (
  plainTextpassword,
  hashedPassword,
) {
  return await bcrypt.compare(plainTextpassword, hashedPassword);
};

export const User = mongoose.model<TUser, UserModel>('User', userSchema);
