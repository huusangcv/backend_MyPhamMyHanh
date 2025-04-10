import express from 'express';
import { SlideMethods } from '../models/slides';

export const createSlide = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const { title, description, image, link, backGroundLinerGradient, colorHover } = req.body;
    const imageData = req.file;

    if (imageData) {
      const imagePath = `/uploads/slides/${imageData?.originalname}`;
      const slide = await SlideMethods.createSlide({
        title,
        description,
        image: imagePath,
        link,
        backGroundLinerGradient,
        colorHover,
      });

      return res.status(201).json({
        status: false,
        data: {
          message: 'Tạo mới slide thành công',
          data: slide,
        },
      });
    }

    const slide = await SlideMethods.createSlide({
      title,
      description,
      image,
      link,
      backGroundLinerGradient,
      colorHover,
    });

    return res.status(201).json({
      status: false,
      data: {
        message: 'Tạo mới slide thành công',
        data: slide,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: 'Đã xảy ra lỗi, hãy thử lại',
    });
  }
};

export const updateSlide = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const { id } = req.params;
    const { title, description, link, backGroundLinerGradient, colorHover } = req.body;
    const imageData = req.file;

    if (imageData) {
      const imagePath = `/uploads/slides/${imageData?.originalname}`;
      const slide = await SlideMethods.updateSlideById(id, {
        title,
        description,
        image: imagePath,
        link,
        backGroundLinerGradient,
        colorHover,
      });

      return res.status(200).json({
        status: false,
        data: {
          message: 'Cập nhật slide thành công',
          data: slide,
        },
      });
    }

    const slide = await SlideMethods.updateSlideById(id, {
      title,
      description,
      link,
      backGroundLinerGradient,
      colorHover,
    });

    return res.status(200).json({
      status: false,
      data: {
        message: 'Cập nhật slide thành công',
        data: slide,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: 'Đã xảy ra lỗi, hãy thử lại',
    });
  }
};

export const deleteSlide = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const { id } = req.params;
    await SlideMethods.deleteSlideById(id);
    const slides = await SlideMethods.getSlides();

    if (slides && slides.length > 0) {
      return res.status(200).json({
        status: true,
        data: {
          message: 'Xóa slide thành công',
          data: slides,
        },
      });
    }

    return res.status(200).json({
      status: true,
      data: {
        message: 'Danh sách slide trống',
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: 'Đã xảy ra lỗi, hãy thử lại',
    });
  }
};

export const getSlides = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const slides = await SlideMethods.getSlides();

    if (slides && slides.length > 0) {
      return res.status(200).json({
        status: true,
        data: {
          message: 'Lấy danh sách slide thành công',
          data: slides,
        },
      });
    }

    return res.status(200).json({
      status: false,
      data: {
        message: 'Danh sách slide trống',
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: 'Đã xảy ra lỗi, hãy thử lại',
    });
  }
};

export const getSlideById = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const { id } = req.params;
    const slide = await SlideMethods.getSlideById(id);

    if (slide) {
      return res.status(200).json({
        status: true,
        data: {
          message: 'Lấy thông tin slide thành công',
          data: slide,
        },
      });
    }

    return res.status(404).json({
      status: false,
      message: 'Không tìm thấy slide với ID này',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: 'Đã xảy ra lỗi, hãy thử lại',
    });
  }
};
