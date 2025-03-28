import express from 'express';
import { UserMethods } from '../models/user';
import { random, authentication } from '../helpers';

// [POST] /auth/login
export const login = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.json({
        message: `Trường email không được bỏ trống`,
      });
    }

    if (!password) {
      return res.json({
        message: `Trường password không được bỏ trống`,
      });
    }

    const user = await UserMethods.getUserByEmail(email).select('+authentication.salt + authentication.password');

    if (!user) {
      return res.json({
        status: false,
        message: 'Tài khoản không tồn tại, vui lòng đăng ký mới',
      });
    }

    const saltFromAuthentication = user.authentication?.salt;
    const passswordFromAuthentication = user.authentication?.password;

    if (!saltFromAuthentication || !passswordFromAuthentication) {
      return res
        .json({
          status: false,
          message: 'Lỗi xác thực, vui lòng thử lại',
        })
        .status(400);
    }

    const expectedHash = authentication(saltFromAuthentication, password);

    if (passswordFromAuthentication !== expectedHash) {
      return res
        .json({
          status: false,
          message: 'Mật khẩu không chính xác',
        })
        .status(400);
    }

    const salt = random();

    if (user.authentication) {
      user.authentication.sessionToken = authentication(salt, user._id.toString());
    }

    await user.save();

    res.cookie('CUSTOMER', user.authentication?.sessionToken || '', {
      domain: '.regis.id.vn',
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });

    res.json({
      status: true,
      message: 'Đăng nhập thành công',
      data: user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, message: 'Đã xảy ra lỗi' });
  }
};

// [POST] /auth/register
export const register = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const { email, password, username, phone } = req.body;

    if (!email || !password || !username || !phone) {
      return res.json({
        message: 'Trường này không được bỏ trống',
      });
    }

    const existingUser = await UserMethods.getUserByEmail(email);

    if (existingUser) {
      return res
        .json({
          status: false,
          message: 'Tài khoản đã tồn tại trong hệ thống, hệ nhập địa chỉ Email khác',
        })
        .status(400);
    }

    const salt = random();
    const user = await UserMethods.createUser({
      email,
      username,
      phone,
      authentication: {
        salt,
        password: authentication(salt, password),
      },
    });

    return res.status(200).json({
      status: true,
      message: 'Đăng ký thành công',
      data: user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, message: 'Đã xảy ra lỗi' });
  }
};

// [GET] /auth/logout
export const logout = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    res.clearCookie('CUSTOMER');

    return res.status(200).json({ status: true, message: 'Đăng xuất thành công' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, message: 'Đã xảy ra lỗi' });
  }
};

// [GET] /logout
export const logoutForAdmin = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    res.clearCookie('AUTH');

    return res.status(200).json({ status: true, message: 'Đăng xuất thành công' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, message: 'Đã xảy ra lỗi' });
  }
};

// [GET] /login
export const loginForAdmin = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.json({
        message: `Trường email không được bỏ trống`,
      });
    }

    if (!password) {
      return res.json({
        message: `Trường password không được bỏ trống`,
      });
    }

    const user = await UserMethods.getUserByEmail(email).select(
      '+roles +authentication.salt + authentication.password ',
    );

    if (!user) {
      return res.json({
        status: false,
        message: 'Tài khoản không tồn tại',
      });
    }

    if (user.roles !== 'admin') {
      return res.json({
        status: false,
        message: 'Không có quyền truy cập',
      });
    }

    const saltFromAuthentication = user.authentication?.salt;
    const passswordFromAuthentication = user.authentication?.password;

    if (!saltFromAuthentication || !passswordFromAuthentication) {
      return res
        .json({
          status: false,
          message: 'Lỗi xác thực, vui lòng thử lại',
        })
        .status(400);
    }

    const expectedHash = authentication(saltFromAuthentication, password);

    if (passswordFromAuthentication !== expectedHash) {
      return res
        .json({
          status: false,
          message: 'Mật khẩu không chính xác',
        })
        .status(400);
    }

    const salt = random();

    if (user.authentication) {
      user.authentication.sessionToken = authentication(salt, user._id.toString());
    }

    await user.save();

    res.cookie('AUTH', user.authentication?.sessionToken || '', {
      domain: '.regis.id.vn',
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });

    res.json({
      status: true,
      message: 'Đăng nhập thành công',
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, message: 'Đã xảy ra lỗi' });
  }
};
