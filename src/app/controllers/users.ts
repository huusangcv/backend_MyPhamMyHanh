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
    const { username, address, phone, status } = req.body;

    const user = await UserMethods.updateUserById(id);

    if (!user) {
      return res.status(404).json({ status: false, message: 'Người dùng không tồn tại' });
    }

    if (username) {
      user.username = username;
    }

    if (address) {
      user.address = address;
    }

    if (phone) {
      user.phone = phone;
    }

    if (address) {
      user.status = status;
    }

    await user.save();

    return res.status(200).json({ status: true, message: 'Cập nhật thành công', user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, message: 'Đã xảy ra lỗi' });
  }
};
