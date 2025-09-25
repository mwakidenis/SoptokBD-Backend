import { RequestHandler } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import HttpStatus from 'http-status';
import { UserServices } from './user.service';

const createUser: RequestHandler = catchAsync(async (req, res) => {
  const { accessToken, refreshToken } = await UserServices.createUserIntoDB(
    req.body,
  );

  sendResponse(res, {
    success: true,
    statusCode: HttpStatus.OK,
    message: 'User created successfully',
    data: { accessToken, refreshToken },
  });
});

const getSingleUser: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await UserServices.getSingleUserFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: HttpStatus.OK,
    message: 'User Retrived successfully',
    data: result,
  });
});

const deleteUser: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;

  const { name, email, _id, role } =
    await UserServices.deleteSingleUserFromDB(id);

  const user = { name, email, _id, role };

  sendResponse(res, {
    success: true,
    statusCode: HttpStatus.OK,
    message: 'User deleted successfully',
    data: user,
  });
});

const getAllUsers: RequestHandler = catchAsync(async (req, res) => {
  const result = await UserServices.getAllUsersFromDB({});

  sendResponse(res, {
    success: true,
    statusCode: HttpStatus.OK,
    message: 'Users are retrived successfully',
    data: result,
  });
});

const updateUser: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await UserServices.updateUserIntoDB(id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: HttpStatus.OK,
    message: 'Your Profile Updated successfully',
    data: result,
  });
});

const updatePassword: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await UserServices.updatePasswordIntoDB(id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: HttpStatus.OK,
    message: 'Password Updated successfully',
    data: result,
  });
});

const updateUserRole: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  const result = await UserServices.updateUserRoleIntoDB(id, role);

  sendResponse(res, {
    success: true,
    statusCode: HttpStatus.OK,
    message: `User role updated to ${role}`,
    data: result,
  });
});

export const UserControllers = {
  createUser,
  getSingleUser,
  deleteUser,
  getAllUsers,
  updatePassword,
  updateUser,
  updateUserRole,
};
