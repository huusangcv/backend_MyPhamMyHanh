import CommentPostModel from '../models/commentPost';
import GenreModal, { GenreMethods } from '../models/genre';
import NewsModal, { NewsMethods } from '../models/news';
import express from 'express';
import slugify from 'slugify';
import { UserMethods } from '../models/user';

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

    if (imageData) {
      const imagePath = `/uploads/news/${imageData?.originalname}`;
      const news = await NewsMethods.createNews({
        ...cloneFormData,
        image: imagePath,
      });

      return res.status(200).json({
        status: true,
        message: 'Tạo mới tin tức thành công',
        data: news,
      });
    }

    const news = await NewsMethods.createNews(cloneFormData);
    return res.status(200).json({
      status: true,
      message: 'Tạo mới tin tức thành công',
      data: news,
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
      const imagePath = `/uploads/news/${imageData?.originalname}`;
      news.image = imagePath;
      await news.save();

      return res.status(200).json({
        status: true,
        message: 'Cập nhật tin tức thành công',
        data: news,
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
      data: news,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: 'Đã xảy ra lỗi, hãy thử lại',
    });
  }
};

// [PATCH] /news/like/:id
export const likeNews = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const comment = await NewsMethods.likeNews(id as string, userId);

    return res.status(200).json({
      status: true,
      message: 'Like bài viết thành công',
      data: comment,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: `Đã xảy ra lỗi, vui lòng thử lại sau`,
    });
  }
};

// [PATCH] /news/unlike/:id
export const unlikeNews = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const comment = await NewsMethods.unlikeNews(id as string, userId);

    return res.status(200).json({
      status: true,
      message: 'unLike bài viết thành công',
      data: comment,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: `Đã xảy ra lỗi, vui lòng thử lại sau`,
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
      data: news,
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
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const skip = (page - 1) * limit;
    const total = await NewsModal.countDocuments();
    const totalPages = Math.ceil(total / limit);

    const news = await NewsModal.find().skip(skip).limit(limit);

    if (news.length > 0) {
      return res.status(200).json({
        status: true,
        message: `Danh sách tin tức trang: ${page}`,
        data: { news, total, totalPages, currentPage: page },
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

// [GET] /news
export const getAllNewsByTag = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const { slug } = req.params;

    const tag = await GenreMethods.getGenreBySlug(slug);

    if (!tag) {
      return res.status(404).json({
        status: false,
        message: 'Không tìm thấy thể loại tương ứng',
      });
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const skip = (page - 1) * limit;
    const total = await NewsModal.countDocuments({ tag_id: tag._id });
    const totalPages = Math.ceil(total / limit);

    const news = await NewsModal.find({ tag_id: tag._id }).skip(skip).limit(limit);

    if (news.length > 0) {
      return res.status(200).json({
        status: true,
        message: `Danh sách tin tức trang: ${page}`,
        data: { news, total, totalPages, currentPage: page },
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
        data: news,
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
    const comments = await CommentPostModel.find({ news_id: news._id });
    const user = await UserMethods.getUserById(news.author as string);

    //view plus 1 when user click watch detailNews
    news.view += 1;
    await news.save();

    if (comments.length > 0) {
      return res.status(200).json({
        status: true,
        message: 'Chi tiết tin tức',
        data: {
          news,
          comments,
          user,
        },
      });
    }

    return res.status(200).json({
      status: true,
      message: 'Chi tiết tin tức',
      data: {
        news,
        user,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: 'Đã xảy ra lỗi, vui lòng thử lại',
    });
  }
};

// [POST] /news/uploads/photo
export const uploadImageForContent = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const imageData = req.file;

    return res.json({
      status: true,
      message: 'Upload ảnh thành công',
      data: `/uploads/news/${imageData?.originalname}`,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: 'Đã có lỗi xảy ra, hãy thử lại sau',
    });
  }
};
