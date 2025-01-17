import { NewsMethods } from '../models/news';
import express from 'express';
import slugify from 'slugify';

// [POST] /news
export const createNews = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const formData = req.body;
    const imageData = req.file;
    const cloneFormData = { ...formData };

    const slug = slugify(cloneFormData.title, { lower: true, strict: true });
    const existingNews = await NewsMethods.getNewsBySlug(slug);

    if (existingNews) {
      return res.status(403).json({
        status: false,
        message: 'Tin tức đã tồn tại',
      });
    }

    let news;

    if (imageData) {
      const imagePath = `/upload/news/thumb/${imageData?.originalname}`;
      let news = await NewsMethods.createNews({
        ...cloneFormData,
        image: imagePath,
      });

      return res.status(200).json({
        status: true,
        message: 'Tạo mới tin tức thành công',
        news,
      });
    }

    news = await NewsMethods.createNews(cloneFormData);
    return res.status(200).json({
      status: true,
      message: 'Tạo mới tin tức thành công',
      news,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: 'Đã có lỗi xảy ra, vui lòng thử lại',
    });
  }
};

// [PATCH] /news/:id
export const updateNews = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const { id } = req.params;
    const formData = req.body;
    const imageData = req.file;
    const cloneFormData = { ...formData };
    let news = await NewsMethods.updateNewsById(id);

    if (!news) {
      return res.status(403).json({
        status: false,
        message: 'Không tồn tại tin tức tương ứng',
      });
    }

    if (imageData) {
      const imagePath = `/upload/news/thumb/${imageData?.originalname}`;
      news.image = imagePath;
      await news.save();

      return res.status(200).json({
        status: true,
        message: 'Cập nhật tin tức thành công',
        news,
      });
    }

    Object.keys(cloneFormData).forEach((key) => {
      if (cloneFormData[key] !== undefined) {
        news[key] = cloneFormData[key];
      }
    });

    await news.save();

    return res.status(200).json({
      status: true,
      message: 'Cập nhật tin tức thành công',
      news,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: 'Đã xảy ra lỗi, hãy thử lại',
    });
  }
};

// [DELETE] /news/:id
export const deleteNews = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const { id } = req.params;

    await NewsMethods.deleteNewsById(id);
    const news = await NewsMethods.getNews();

    return res.status(200).json({
      status: true,
      message: 'Xoá tin tức thành công',
      news,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: 'Đã xảy ra lỗi, vui lòng thử lại sau',
    });
  }
};

// [GET] /news
export const getAllNews = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const news = await NewsMethods.getNews();

    if (news.length > 0) {
      return res.status(200).json({
        status: true,
        message: 'Danh sách tin tức',
        news,
      });
    }

    return res.status(403).json({
      status: false,
      message: 'Tin tức trống',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: 'Đã xảy ra lỗi, vui lòng thử lại',
    });
  }
};

// [GET] /news/search?q=
export const searchNews = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        status: false,
        message: 'Vui lòng cung cấp từ khóa tìm kiếm.',
      });
    }

    const news = await NewsMethods.getNewsBySearch(q as string);
    if (news.length > 0) {
      NewsMethods;
      return res.status(200).json({
        status: true,
        message: `Danh sách tin tức tìm kiếm theo: ${q}`,
        news,
      });
    }

    return res.status(404).json({
      status: false,
      message: 'Không tìm thấy',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: 'Đã xảy ra lỗi, vui lòng thử lại',
    });
  }
};

// [GET] /news/:slug
export const detailNews = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const { slug } = req.params;

    const news = await NewsMethods.getNewsBySlug(slug);

    if (!news) {
      return res.status(404).json({
        status: false,
        message: 'Không tìm thấy tin tức tương ướng',
      });
    }

    //view plus 1 when user click watch detailNews
    news.view += 1;
    news.save();

    return res.status(200).json({
      status: true,
      message: 'Chi tiết tin tức',
      news,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: 'Đã xảy ra lỗi, vui lòng thử lại',
    });
  }
};
