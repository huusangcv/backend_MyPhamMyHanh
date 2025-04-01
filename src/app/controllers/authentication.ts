import express from 'express';
import { UserMethods } from '../models/user';
import { random, authentication, transporter } from '../helpers';
import { mailOptionsRegisGoogle, mailOptionsVerifyResetPassword } from '../mails';
import { v4 as uuidv4 } from 'uuid';
// Generate short id
const generateShortId = () => {
  return uuidv4().replace(/-/g, '').slice(0, 6); // Xóa dấu '-' và cắt lấy 12 ký tự
};
// [POST] /auth/user/login
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

    res.status(200).json({
      status: true,
      message: 'Đăng nhập thành công',
      data: user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, message: 'Đã xảy ra lỗi' });
  }
};

// [POST] /auth/user/loginGoogle
export const loginGoogle = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const { email, name } = req.body;

    if (!email) {
      return res.status(400).json({
        status: false,
        message: 'Không nhận được Email',
      });
    }

    let userExisting = await UserMethods.getUserByEmail(email).select(
      '+authentication.salt + authentication.password + authentication.sessionToken + googleEmail',
    );

    if (!userExisting) {
      return res.status(404).json({
        status: false,
        message: 'Không tồn tại người dùng. Vui lòng cập nhật thông tin tài khoản.',
        data: {
          email,
          username: name,
        },
      });
    }

    if (userExisting.authentication) {
      // Tạo token mới cho người dùng
      const salt = random();
      userExisting.authentication.sessionToken = authentication(salt, userExisting._id.toString());
      await userExisting.save();

      if (userExisting.googleEmail === email) {
        return res.status(200).json({
          status: true,
          message: 'Đăng nhập thành công',
          data: userExisting,
        });
      }
    }

    return res.status(403).json({
      status: false,
      message: 'Tài khoản chưa được liên kết với Google. Vui lòng cập nhật thông tin tài khoản.',
      data: {
        email,
        username: name,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, message: 'Đã xảy ra lỗi' });
  }
};

// [POST] /auth/user/registerGoogle
export const registerGoogle = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const { email, username, phone } = req.body;

    if (!email || !username || !phone) {
      return res.status(400).json({
        status: false,
        message: 'Trường này không được bỏ trống',
      });
    }

    let existingUser = await UserMethods.getUserByEmail(email);

    if (existingUser) {
      return res
        .json({
          status: false,
          message: 'Tài khoản đã tồn tại trong hệ thống',
        })
        .status(400);
    }

    const salt = random();
    let user = await UserMethods.createUser({
      email,
      username,
      phone,
      authentication: {
        salt,
        password: authentication(salt, email),
        sessionToken: authentication(salt, email.toString()),
      },
      googleEmail: email,
    });

    if (user) {
      return res.status(200).json({
        status: true,
        message: 'Đăng nhập thành công',
        data: user,
      });
    }

    return res.status(404).json({
      status: false,
      message: 'Tài khoản không tồn tại trong hệ thốngmới',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, message: 'Đã xảy ra lỗi' });
  }
};

// [POST] /auth/user/register
export const register = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const { email, password, username, phone } = req.body;

    if (!email || !password || !username || !phone) {
      return res.status(400).json({
        status: false,
        message: 'Trường này không được bỏ trống',
      });
    }

    const existingUser = await UserMethods.getUserByEmail(email);

    if (existingUser) {
      return res
        .status(400)
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

// [GET] /auth/user/sendCodeVerifyAccount/:email
export const sendCodeVerifyAccount = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({
        status: false,
        message: 'Trường này không được bỏ trống',
      });
    }

    const existingUser = await UserMethods.getUserByEmail(email);

    if (existingUser) {
      const verifyCode = generateShortId();
      existingUser.verifyCode = verifyCode;
      existingUser.save();

      transporter.sendMail(
        mailOptionsRegisGoogle(existingUser),
        (error: { toString: () => any }, info: { response: string }) => {
          if (error) {
            return res.status(500).json({
              status: false,
              message: 'Gặp lỗi khi gửi mã, vui lòng thử lại',
              error: error.toString(),
            });
          }
          return res.status(200).json({
            status: true,
            message: 'Đã gửi mã! Kiểm tra email để lấy mã',
          });
        },
      );

      return res.status(200).json({
        status: true,
        message: 'Đã gửi mã! Kiểm tra email để lấy mã',
      });
    }

    return res.status(404).json({
      status: false,
      message: 'Tài khoản không tồn tại trong hệ thống',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, message: 'Đã xảy ra lỗi' });
  }
};
// [GET] /auth/user/sendCodeVerifyResetPassword/:email
export const sendCodeVerifyResetPassword = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({
        status: false,
        message: 'Trường này không được bỏ trống',
      });
    }

    const existingUser = await UserMethods.getUserByEmail(email);

    if (existingUser) {
      const verifyCode = generateShortId();
      existingUser.verifyCode = verifyCode;
      existingUser.save();

      transporter.sendMail(
        mailOptionsVerifyResetPassword(existingUser),
        (error: { toString: () => any }, info: { response: string }) => {
          if (error) {
            return res.status(500).json({
              status: false,
              message: 'Gặp lỗi khi gửi mã, vui lòng thử lại',
              error: error.toString(),
            });
          }
          return res.status(200).json({
            status: true,
            message: 'Đã gửi mã! Kiểm tra email để lấy mã',
            data: { info: info.response },
          });
        },
      );

      return res.status(200).json({
        status: true,
        message: 'Đã gửi mã! Kiểm tra email để lấy mã',
      });
    }

    return res.status(404).json({
      status: false,
      message: 'Tài khoản không tồn tại trong hệ thống',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, message: 'Đã xảy ra lỗi' });
  }
};

// [POST] /auth/user/verifyGoogleAccount
export const verifyGoogleAccount = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const { email, code } = req.body;

    if (!email) {
      return res.status(400).json({
        status: false,
        message: 'Trường này không được bỏ trống',
      });
    }

    const existingUser = await UserMethods.getUserByEmail(email);

    if (existingUser) {
      if (existingUser.verifyCode === code) {
        if (existingUser.authentication) {
          // Tạo token mới cho người dùng
          const salt = random();
          existingUser.authentication.sessionToken = authentication(salt, existingUser._id.toString());
          existingUser.verifyCode = '';
          existingUser.googleEmail = email;
          await existingUser.save();

          return res.status(200).json({
            status: true,
            message: 'Xác thực thành công',
            data: existingUser,
          });
        }

        return res.status(404).json({
          status: false,
          message: 'Không tồn tại authenticated',
        });
      }

      return res.status(404).json({
        status: false,
        message: 'Mã xác thực không chính xác',
      });
    }

    return res.status(404).json({
      status: false,
      message: 'Tài khoản không tồn tại trong hệ thống',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, message: 'Đã xảy ra lỗi' });
  }
};

// [POST] /auth/user/verifyResetPasswordAccount
export const verifyResetPasswordAccount = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const { email, code } = req.body;

    if (!email) {
      return res.status(400).json({
        status: false,
        message: 'Trường này không được bỏ trống',
      });
    }

    const existingUser = await UserMethods.getUserByEmail(email);

    if (existingUser) {
      if (existingUser.verifyCode === code) {
        existingUser.verifyCode = '';
        await existingUser.save();
        return res.status(200).json({
          status: true,
          message: 'Xác thực thành công',
        });
      }

      return res.status(404).json({
        status: false,
        message: 'Mã xác thực không chính xác',
      });
    }

    return res.status(404).json({
      status: false,
      message: 'Tài khoản không tồn tại trong hệ thống',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, message: 'Đã xảy ra lỗi' });
  }
};

// [POST] /auth/user/connectGoogleAccount
export const connectGoogleAccount = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        status: false,
        data: { message: 'Trường này không được bỏ trống' },
      });
    }

    let existingUser = await UserMethods.getUserByEmail(email);

    if (existingUser) {
      existingUser.googleEmail = email;
      existingUser.save();

      return res.status(200).json({
        status: true,
        data: {
          message: 'Liên kết google thành công',
          data: existingUser,
        },
      });
    }

    return res.status(404).json({
      status: false,
      data: {
        message: 'Tài khoản không tồn tại trong hệ thống',
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, message: 'Đã xảy ra lỗi' });
  }
};

// [POST] /auth/user/cancelGoogleAccount
export const cancelGoogleAccount = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        status: false,
        data: { message: 'Trường này không được bỏ trống' },
      });
    }

    let existingUser = await UserMethods.getUserByEmail(email);

    if (existingUser) {
      existingUser.googleEmail = '';
      existingUser.save();

      return res.status(200).json({
        status: true,

        data: {
          message: 'Huỷ liên kết google thành công',
          data: existingUser,
        },
      });
    }

    return res.status(404).json({
      status: false,
      data: {
        message: 'Tài khoản không tồn tại trong hệ thống',
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, message: 'Đã xảy ra lỗi' });
  }
};

// [POST] /auth/user/resetPassword
export const resetPassword = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({
        status: false,
        message: 'Trường này không được bỏ trống',
      });
    }

    let existingUser = await UserMethods.getUserByEmail(email).select('+authentication.salt + authentication.password');

    if (existingUser) {
      const salt = random();

      if (existingUser.authentication) {
        existingUser.authentication.salt = salt;
        existingUser.authentication.password = authentication(salt, password);
        existingUser.save();
      }
      return res.status(200).json({
        status: true,
        message: 'Đặt lại mật khẩu thành công',
        data: existingUser,
      });
    }

    return res.status(404).json({
      status: false,
      message: 'Tài khoản không tồn tại trong hệ thống',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, message: 'Đã xảy ra lỗi' });
  }
};

// [POST] /auth/user/changePassword
export const changePassword = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const { email, currentPassword, password } = req.body;

    if (!email) {
      return res.status(400).json({
        status: false,
        data: {
          message: 'Không nhận được địa chỉ email',
        },
      });
    }

    let existingUser = await UserMethods.getUserByEmail(email).select(
      '+authentication.salt + authentication.password + authentication.sessionToken',
    );

    if (existingUser) {
      const salt = random();

      if (existingUser.authentication) {
        const saltFromAuthentication = existingUser.authentication.salt;
        const passswordFromAuthentication = existingUser.authentication.password;

        if (!saltFromAuthentication || !passswordFromAuthentication) {
          return res
            .json({
              status: false,
              data: { message: 'Lỗi xác thực, vui lòng thử lại' },
            })
            .status(400);
        }

        // get password of user with currentPassword from client
        const expectedHash = authentication(saltFromAuthentication, currentPassword);

        //check currentPassword
        if (passswordFromAuthentication !== expectedHash) {
          return res
            .json({
              status: false,
              data: {
                message: 'Mật khẩu không chính xác',
              },
            })
            .status(400);
        }

        // change new password
        existingUser.authentication.salt = salt;
        existingUser.authentication.password = authentication(salt, password);
        existingUser.save();

        //Get new info profile return json
        const sessionToken = existingUser.authentication.sessionToken;

        if (sessionToken) {
          const userProfile = await UserMethods.getUserBySessionToken(sessionToken);
          return res.status(200).json({
            status: true,
            data: {
              message: 'Thay đổi mật khẩu thành công',
              data: userProfile,
            },
          });
        }
        return res.status(404).json({
          status: false,
          data: {
            message: 'Gặp lỗi khi thay đổi mật khẩu, hãy thử lại',
          },
        });
      }

      return res.status(404).json({
        status: false,
        data: {
          message: 'Không tìm thấy authenticated',
        },
      });
    }

    return res.status(404).json({
      status: false,
      data: {
        message: 'Tài khoản không tồn tại trong hệ thống',
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, data: { message: 'Đã xảy ra lỗi' } });
  }
};

// [GET] /auth/user/logout
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
