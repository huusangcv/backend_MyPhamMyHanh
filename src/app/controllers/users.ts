import express from 'express';
import { UserMethods } from '../models/user';
import path from 'path';
import ReviewModel from '../models/review';
import sharp from 'sharp';
// [GET] /users
export const getAllUsers = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const users = await UserMethods.getUsers().select('+roles');

    if (users.length > 0) {
      return res.json({
        status: true,
        message: 'Lấy danh sách người dùng thành công',
        data: users,
      });
    }

    return res.json({
      status: true,
      message: 'Danh sách người dùng trống',
      data: users,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, message: 'Đã xảy ra lỗi' });
  }
};

// [GET] /user/:id
export const detailUser = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const { id } = req.params;

    const user = await UserMethods.getUserById(id).select('+roles');

    if (!user) {
      return res.status(403).json({
        status: true,
        message: 'Người dùng không tồn tại',
      });
    }

    return res.status(200).json({
      status: true,
      message: 'Chi tiết người dùng',
      data: user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: 'Đã có lỗi xảy ra, hãy thử lại sau',
    });
  }
};

// [GET] /users/search?q=
export const searchUsers = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const { q } = req.query;

    const users = await UserMethods.getUsersBySearch(q as string);

    if (users.length > 0) {
      return res.status(200).json({
        status: true,
        message: 'Danh sách người dùng',
        data: users,
      });
    }

    return res.status(403).json({
      status: false,
      message: 'Danh sách người dùng trống',
    });
    // const users = await
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: 'Đã xảy ra lỗi, hãy thử lại sau',
    });
  }
};

// [POST] /users
export const createUser = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const formData = req.body;
    const cloneFormData = { ...formData };

    const existingUser = await UserMethods.getUserByEmail(cloneFormData.email);

    if (existingUser && existingUser.email === cloneFormData.email) {
      return res
        .json({
          status: false,
          message: 'Tài khoản đã tồn tại trong hệ thống, hãy chọn địa chỉ Email khác',
          existingUser,
        })
        .status(403);
    }

    const user = await UserMethods.createUser(cloneFormData);

    return res.json({
      status: true,
      message: 'Thêm mới người dùng thành công',
      data: user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, message: 'Đã xảy ra lỗi' });
  }
};

// [DELETE] /user/:id
export const deleteUser = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const { id } = req.params;

    const existingReviewByUser = await ReviewModel.findOne({ user_id: id });

    if (existingReviewByUser) {
      return res.json({
        status: false,
        message: 'Tồn tại một đánh giá bởi người dùng',
      });
    }

    await UserMethods.deleteUserById(id);
    const users = await UserMethods.getUsers();

    return res.json({
      status: true,
      message: 'Xoá người dùng thành công',
      data: users,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, message: 'Đã xảy ra lỗi' });
  }
};

// [PATCH] /user/:id
export const updateUser = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const { id } = req.params;
    const formData = req.body;

    const cloneFormData = { ...formData };

    let user = await UserMethods.updateUserById(id as string);

    // Check email from client existing in system
    if (user && cloneFormData.email === user.email) {
      return res.status(403).json({
        status: false,
        message: 'Tài khoản đã tồn tại trong hệ thống',
      });
    }

    if (!user) {
      return res.status(404).json({ status: false, message: 'Người dùng không tồn tại' });
    }

    //Map cloneFormData from client check value is undefined to update that value
    Object.keys(cloneFormData).forEach((key) => {
      if (cloneFormData[key] !== undefined) {
        user[key] = cloneFormData[key];
      }
    });

    await user.save();

    return res.status(200).json({ status: true, message: 'Cập nhật thành công', data: user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, message: 'Đã xảy ra lỗi', error });
  }
};

export const uploadAvatar = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const imagePath = req.file;
    const CloneImagePath = `/uploads/profile/${imagePath?.originalname}`;

    const fileImage = sharp(CloneImagePath)
      .resize(262, 317)
      .toFile(CloneImagePath, function (err: any) {
        if (err) {
          console.error('sharp>>>', err);
        }
        console.log('ok okoko');
      });

    return res.status(200).json({
      status: true,
      message: 'Cập nhật ảnh đại diện thành công',
      data: fileImage,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: 'Đã có lỗi xảy ra, hãy thử lại sau',
    });
  }
};
