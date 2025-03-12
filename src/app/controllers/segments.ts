import express from 'express';
import { SegmentMethods } from '../models/segment';

// [GET] /segments
export const getAllSegments = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const segments = await SegmentMethods.getSegments();

    if (segments.length > 0) {
      return res.status(200).json({
        status: true,
        message: 'Danh sách phân loại người dùng',
        data: segments,
      });
    }

    return res.status(404).json({
      status: false,
      message: 'Danh sách phân loại người dùng trống',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: 'Đã xảy ra lỗi, hãy thử lại',
    });
  }
};

// [GET] /segments/:id
export const getDetailSegment = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const { id } = req.params;
    const segment = await SegmentMethods.getDetailSegmentById(id);

    if (!segment) {
      return res.status(404).json({
        status: false,
        message: 'Không tìm thấy phần loại người dùng',
      });
    }

    return res.status(200).json({
      status: true,
      message: 'Chi tiết phân loại người dùng',
      data: segment,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: 'Đã xảy ra lỗi, hãy thử lại',
    });
  }
};

// [POST] /segments
export const createSegment = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    console.log('Request body:', req.body);
    console.log('Request headers:', req.headers);
    const formData = req.body;
    const cloneFormData = { ...formData };

    const newSegment = await SegmentMethods.createSegment(cloneFormData);

    return res.status(200).json({
      status: true,
      message: 'Tạo mới phân loại người dùng thành công',
      data: newSegment,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: 'Đã xảy ra lỗi hãy thử lại',
    });
  }
};

// [PATCH] /segments/:id
export const updateSegment = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const { id } = req.params;
    const formData = req.body;
    const cloneFormData = { ...formData };

    let segment = await SegmentMethods.updateSegmentById(id);

    if (!segment) {
      return res.status(200).json({
        status: false,
        message: 'Không tìm thấy phân loại người dùng tương ứng',
      });
    }

    Object.keys(cloneFormData).forEach((key) => {
      if (cloneFormData[key] !== undefined) {
        segment[key] = cloneFormData[key];
      }
    });

    await segment.save();

    return res.status(200).json({
      status: true,
      message: 'Cập nhật phân loại người dùng thành công',
      data: segment,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: 'Đã xảy ra lỗi, hãy thử lại',
      error,
    });
  }
};

// [DELETE] /segments/:id
export const deleteSegment = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const { id } = req.params;

    await SegmentMethods.deleteSegmentById(id);
    const segments = await SegmentMethods.getSegments();

    return res.status(200).json({
      status: true,
      message: 'Xoá phân loại người dùng thành công',
      data: segments,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: 'Đã xảy ra lỗi vui lòng thử lại sau',
      error,
    });
  }
};
