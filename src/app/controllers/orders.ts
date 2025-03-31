import OrderModel, { OrderMethods } from '../models/order';
import express from 'express';
import qs from 'qs';
import forge from 'node-forge';
import { ProductMethods } from '../models/product';
import { transporter } from '../helpers';
import { mailOptionsOrder } from '../mails';

function sortObject(obj: any) {
  return Object.entries(obj)
    .sort(([key1], [key2]) => key1.toString().localeCompare(key2.toString()))
    .reduce((result, item: any) => {
      result = {
        ...result,
        [item[0]]: encodeURIComponent(item[1].toString().replace(/ /g, '+')),
      };

      return result;
    }, {});
}
// [GET] /orders
export const getAllOrders = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const orders = await OrderMethods.getOrders();
    if (orders.length > 0) {
      return res.status(200).json({
        status: true,
        message: 'Danh sách đơn hàng',
        data: orders,
      });
    }

    return res.status(404).json({
      status: false,
      message: 'Danh sách đơn hàng trống',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: 'Đã xảy ra lỗi, hãy thử lại',
    });
  }
};

// [GET] /orders/userId/:user_id
export const getAllOrdersByUserId = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const { user_id } = req.params;
    const orders = await OrderMethods.findOrderByUser(user_id);
    if (orders.length > 0) {
      return res.status(200).json({
        status: true,
        message: 'Danh sách đơn hàng theo người dùng',
        data: orders,
      });
    }

    return res.status(404).json({
      status: false,
      message: 'Danh sách đơn hàng trống',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: 'Đã xảy ra lỗi, hãy thử lại',
    });
  }
};

// [GET] /orders/:id
export const getDetailOrder = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const { id } = req.params;
    const order = await OrderMethods.getDetailOrderById(id);
    if (!order) {
      return res.status(404).json({
        status: false,
        message: 'Không tìm thấy đơn hàng',
      });
    }

    return res.status(200).json({
      status: true,
      message: 'Chi tiết đơn hàng',
      data: order,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: 'Đã xảy ra lỗi, hãy thử lại',
    });
  }
};

// [POST] /orders
export const createOrder = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const formData = req.body;
    const cloneFormData = { ...formData };
    const order = await OrderMethods.createOrder(cloneFormData);

    // update quantity and sold of product
    if (order && order.products && order.products.length > 0) {
      order.products.map(async (productOrder) => {
        let product = await ProductMethods.getProductById(productOrder.id);

        if (product && productOrder) {
          product.sold += productOrder.quantity ?? 0;
          product.quantity -= productOrder.quantity ?? 0;
          product.save();
        }

        return Promise.resolve();
      });
    }

    return res.status(201).json({
      status: true,
      message: 'Tạo đơn hàng thành công',
      data: order,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: 'Đã xảy ra lỗi, hãy thử lại',
    });
  }
};

// [PATCH] /orders/:id
export const updateOrder = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const { id } = req.params;
    const formData = req.body;
    const cloneFormData = { ...formData };

    let order = await OrderMethods.updateOrderById(id);
    if (!order) {
      return res.status(404).json({
        status: false,
        message: 'Không tìm thấy đơn hàng',
      });
    }

    Object.keys(cloneFormData).forEach((key) => {
      if (order[key] !== undefined) {
        order[key] = cloneFormData[key];
      }
    });

    await order.save();

    if (order.status === 'cancelled') {
      if (order?.products?.length > 0) {
        await Promise.all(
          order.products.map(async (productOrder: { id: string; quantity: any }) => {
            const product = await ProductMethods.getProductById(productOrder.id);

            if (product) {
              product.sold -= productOrder.quantity ?? 0;
              product.quantity += productOrder.quantity ?? 0;
              await product.save();
            }
          }),
        );
      }
    }

    if (order.status === 'ordered') {
      if (order) {
        // Route gửi email
        transporter.sendMail(mailOptionsOrder(order), (error: { toString: () => any }, info: { response: string }) => {
          if (error) {
            return res.status(500).send(error.toString());
          }
          res.status(200).send('Email sent: ' + info.response);
        });
      }
    }
    return res.status(200).json({
      status: true,
      message: 'Cập nhật đơn hàng thành công',
      data: order,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: 'Đã xảy ra lỗi, hãy thử lại',
    });
  }
};

// [DELETE] /orders/:id
export const deleteOrder = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const { id } = req.params;
    const order = await OrderMethods.deleteOrderById(id);
    if (!order) {
      return res.status(404).json({
        status: false,
        message: 'Không tìm thấy đơn hàng',
      });
    }
    return res.status(200).json({
      status: true,
      message: 'Xóa đơn hàng thành công',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: 'Đã xảy ra lỗi, hãy thử lại',
    });
  }
};

// [GET] /orders/search
export const searchOrders = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const { q } = req.query;
    const orders = await OrderMethods.searchOrders(q as string);
    if (orders.length > 0) {
      return res.status(200).json({
        status: true,
        message: 'Danh sách đơn hàng',
        data: orders,
      });
    }

    return res.status(404).json({
      status: false,
      message: 'Không tìm thấy đơn hàng',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: 'Đã xảy ra lỗi, hãy thử lại',
    });
  }
};

export const vnpaymentReturn = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    let vnp_Params = req.query;
    let secureHash = vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    let orderId = vnp_Params['vnp_TxnRef'];
    const amount = vnp_Params['vnp_Amount'];
    let rspCode = vnp_Params['vnp_ResponseCode'];
    const tmnCode = 'DDTV8FVG';
    const secretKey = '7EF8BU6YW0JXOTNQIWABKA34I8HU7NRG';
    const sortedVnpParams = sortObject(vnp_Params);
    // Create query string
    const vnpParamsString = qs.stringify(sortedVnpParams, { encode: false });
    // Generate HMAC-SHA512 hash using `forge`
    const hmac = forge.hmac.create();
    hmac.start('sha512', secretKey);
    hmac.update(vnpParamsString);
    const hashValue = hmac.digest().toHex();

    const errorMessages = {
      '00': 'Thanh Toán thành công',
      '07': 'Trừ tiền thành công. Thanh Toán bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường).',
      '09': 'Thanh Toánkhông thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng.',
      '10': 'Thanh Toán không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần.',
      '11': 'Thanh Toán không thành công do: Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch.',
      '12': 'Thanh Toán không thành công do: Thẻ/Tài khoản của khách hàng bị khóa.',
      '13': 'Thanh Toán không thành công do Quý khách nhập sai mật khẩu xác thực giao dịch (OTP). Xin quý khách vui lòng thực hiện lại giao dịch.',
      '24': 'Thanh Toán không thành công do: Khách hàng hủy giao dịch.',
      '51': 'Thanh Toán không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch.',
      '65': 'Thanh Toán không thành công do: Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày.',
      '75': 'Ngân hàng thanh toán đang bảo trì.',
      '79': 'Thanh Toán không thành công do: KH nhập sai mật khẩu thanh toán quá số lần quy định. Xin quý khách vui lòng thực hiện lại giao dịch.',
      '99': 'Các lỗi khác (lỗi còn lại, không có trong danh sách mã lỗi đã liệt kê).',
    };

    const order = await OrderModel.findOne({ reference: orderId });

    if (secureHash === hashValue) {
      //kiểm tra checksum
      const vnp_ResponseCode = vnp_Params['vnp_ResponseCode'] as keyof typeof errorMessages;
      const message = errorMessages[vnp_ResponseCode] || 'Mã phản hồi không hợp lệ';
      if (order) {
        if (order.total === +(amount ?? 0) / 100) {
          if (order.paymentStatus === 'pending') {
            //kiểm tra tình trạng giao dịch trước khi cập nhật tình trạng thanh toán
            if (vnp_ResponseCode === '00') {
              //thanh cong
              order.paymentStatus = 'success';
              order.save();
              //paymentStatus = '1'
              // Ở đây cập nhật trạng thái giao dịch thanh toán thành công vào CSDL của bạn

              return res.status(200).json({
                status: vnp_ResponseCode === '00', // Chỉ thành công nếu mã là "00"
                data: {
                  message,
                },
              });
            } else {
              order.paymentStatus = 'fail';
              order.save();
              //that bai
              //paymentStatus = '2'
              // Ở đây cập nhật trạng thái giao dịch thanh toán thất bại vào CSDL của bạn
              return res.status(200).json({
                status: true,
                data: { message: `Thanh toán thất bại` },
              });
            }
          } else {
            res.status(200).json({ RspCode: '02', message: 'This order has been updated to the payment status' });
          }
        } else {
          res.status(200).json({ RspCode: '04', data: { message: 'Số tiền không hợp lệ' } });
        }
      } else {
        res.status(200).json({ RspCode: '01', data: { message: 'Không tìm thấy đơn hàng cần thanh toán' } });
      }
    } else {
      res.status(200).json({ RspCode: '97', data: { message: 'Mã hoá không chính xác' } });
    }

    if (secureHash === hashValue) {
      //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua
      const vnp_ResponseCode = vnp_Params['vnp_ResponseCode'] as keyof typeof errorMessages;
      const message = errorMessages[vnp_ResponseCode] || 'Mã phản hồi không hợp lệ';
      return res.status(200).json({
        status: vnp_ResponseCode === '00', // Chỉ thành công nếu mã là "00"
        data: {
          message,
        },
      });
    } else {
      return res.status(200).json({
        status: true,
        data: { message: `Thành công - code: 97` },
      });
    }
  } catch (error) {
    if (!res.headersSent) {
      return res.status(500).json({ message: 'Có lỗi xảy ra', error });
    }
  }
};
export const vnpaymentIPN = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    let vnp_Params = req.query;
    let secureHash = vnp_Params['vnp_SecureHash'];

    let orderId = vnp_Params['vnp_TxnRef'];
    let rspCode = vnp_Params['vnp_ResponseCode'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);
    let config = require('config');

    const secretKey = '7EF8BU6YW0JXOTNQIWABKA34I8HU7NRG';
    const sortedVnpParams = sortObject(vnp_Params);
    // Create query string
    const vnpParamsString = qs.stringify(sortedVnpParams, { encode: false });
    // Generate HMAC-SHA512 hash using `forge`
    const hmac = forge.hmac.create();
    hmac.start('sha512', secretKey);
    hmac.update(vnpParamsString);
    const hashValue = hmac.digest().toHex();

    let paymentStatus = '0'; // Giả sử '0' là trạng thái khởi tạo giao dịch, chưa có IPN. Trạng thái này được lưu khi yêu cầu thanh toán chuyển hướng sang Cổng thanh toán VNPAY tại đầu khởi tạo đơn hàng.
    //let paymentStatus = '1'; // Giả sử '1' là trạng thái thành công bạn cập nhật sau IPN được gọi và trả kết quả về nó
    //let paymentStatus = '2'; // Giả sử '2' là trạng thái thất bại bạn cập nhật sau IPN được gọi và trả kết quả về nó

    let checkOrderId = true; // Mã đơn hàng "giá trị của vnp_TxnRef" VNPAY phản hồi tồn tại trong CSDL của bạn
    let checkAmount = true; // Kiểm tra số tiền "giá trị của vnp_Amout/100" trùng khớp với số tiền của đơn hàng trong CSDL của bạn

    return res.status(500).json({
      status: false,
      message: 'Đã xảy ra lỗi, vui lòng thử lại',
      data: {
        secureHash,
        hashValue,
      },
    });
    if (secureHash === hashValue) {
      //kiểm tra checksum
      if (checkOrderId) {
        if (checkAmount) {
          if (paymentStatus == '0') {
            //kiểm tra tình trạng giao dịch trước khi cập nhật tình trạng thanh toán
            if (rspCode == '00') {
              //thanh cong
              //paymentStatus = '1'
              // Ở đây cập nhật trạng thái giao dịch thanh toán thành công vào CSDL của bạn
              res.status(200).json({ RspCode: '00', Message: 'Success' });
            } else {
              //that bai
              //paymentStatus = '2'
              // Ở đây cập nhật trạng thái giao dịch thanh toán thất bại vào CSDL của bạn
              res.status(200).json({ RspCode: '00', Message: 'Success' });
            }
          } else {
            res.status(200).json({ RspCode: '02', Message: 'This order has been updated to the payment status' });
          }
        } else {
          res.status(200).json({ RspCode: '04', Message: 'Amount invalid' });
        }
      } else {
        res.status(200).json({ RspCode: '01', Message: 'Order not found' });
      }
    } else {
      res.status(200).json({ RspCode: '97', Message: 'Checksum failed' });
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: 'Đã xảy ra lỗi, vui lòng thử lại',
      error,
    });
  }
};
