import express from 'express';
import { get, merge } from 'lodash';
import { UserMethods } from '../models/user';

export const isOwner = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
): Promise<any> => {
  try {
    const { id } = req.params;
    const currentUserId = get(req, 'identity._id') as string | undefined;

    if (!currentUserId) {
      return res.status(403).json({
        status: false,
        message: 'Không tìm thấy người dùng hiện tại tương ứng',
      });
    }

    if (currentUserId && currentUserId.toString() !== id) {
      return res.status(403).json({
        status: false,
        message: 'Không thể thực hiện hành động này',
      });
    }

    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, message: 'Đã xảy ra lỗi' });
  }
};

export const isAuthenticated = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
): Promise<any> => {
  try {
    const sessionToken = req.cookies['AUTH'];

    if (!sessionToken) {
      return res
        .json({
          status: false,
          message: 'Không thể thực hiện thành động này',
        })
        .status(403);
    }

    const existingUser = await UserMethods.getUserBySessionToken(sessionToken);

    merge(req, { identity: existingUser });

    return next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, message: 'Đã xảy ra lỗi' });
  }
};
