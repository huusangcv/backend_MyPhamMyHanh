import { OrderMethods } from '../models/order';
import express from 'express';

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
