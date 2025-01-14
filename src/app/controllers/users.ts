import express from 'express';
import { UserMethods } from '../models/user';

export const getAllUsers = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const users = await UserMethods.getUsers();

    if (users.length > 0) {
      return res.json({
        status: true,
        message: 'Lấy danh sách người dùng thành công',
        users,
      });
    }

    return res.json({
      status: true,
      message: 'Danh sách người dùng trống',
      users,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, message: 'Đã xảy ra lỗi' });
  }
};

export const detailUser = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const { id } = req.params;

    const user = await UserMethods.getUserById(id);

    if (!user) {
      return res.status(403).json({
        status: true,
        message: 'Người dùng không tồn tại',
      });
    }

    return res.status(200).json({
      status: true,
      message: 'Chi tiết người dùng',
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: 'Đã có lỗi xảy ra, hãy thử lại sau',
    });
  }
};

export const searchUsers = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const { q } = req.query;

    const users = await UserMethods.getUsersBySearch(q as string);

    if (users.length > 0) {
      return res.status(200).json({
        status: true,
        message: 'Danh sách người dùng',
        users,
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

export const deleteUser = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const { id } = req.params;

    await UserMethods.deleteUserById(id);
    const users = await UserMethods.getUsers();

    return res.json({
      status: true,
      message: 'Xoá người dùng thành công',
      users,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, message: 'Đã xảy ra lỗi' });
  }
};

export const updateUser = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const { id } = req.params;
    const formData = req.body;

    const cloneFormData = { ...formData };

    let user = await UserMethods.updateUserById(id);

    if (!user) {
      return res.status(404).json({ status: false, message: 'Người dùng không tồn tại' });
    }

    if (cloneFormData._id) {
      delete cloneFormData._id;
      return res.status(403).json({ status: false, message: 'Không thể cập nhật trường _id' });
    }
    //Map cloneFormData from client check value is undefined to update that value
    Object.keys(cloneFormData).forEach((key) => {
      if (cloneFormData[key] !== undefined) {
        user[key] = cloneFormData[key];
      }
    });

    await user.save();

    return res.status(200).json({ status: true, message: 'Cập nhật thành công', user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, message: 'Đã xảy ra lỗi', error });
  }
};
