import { ReviewMethods } from '../models/review';
import express from 'express';
// [POST] /reviews
export const createReview = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const formData = req.body;
    const cloneFormData = { ...formData };
    const imagesData = req.files;

    let newReview;

    // check reviews have media
    if (imagesData) {
      const imagesPath = Array.isArray(imagesData)
        ? imagesData.map((image: any) => `/uploads/reviews/${image.originalname}`)
        : [];
      newReview = await ReviewMethods.createReview({
        ...cloneFormData,
        media: imagesPath,
      });

      return res.status(200).json({
        status: true,
        message: 'Tạo mới đánh giá thành công',
        data: newReview,
      });
    }

    newReview = await ReviewMethods.createReview(cloneFormData);
    return res.status(200).json({
      status: true,
      message: 'Tạo mới đánh giá thành công',
      data: newReview,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: 'Đã xảy ra lỗi, hãy thử lại sau',
    });
  }
};

// [PATCH] /reviews/:id
export const updateReview = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const { id } = req.params;
    const formData = req.body;
    const cloneFormData = { ...formData };

    let review = await ReviewMethods.updateReviewById(id);
    if (!review) {
      return res.status(403).json({
        status: false,
        message: 'Không tồn tại đánh giá tương ứng',
      });
    }

    Object.keys(cloneFormData).forEach((key) => {
      if (cloneFormData[key] !== undefined) {
        review[key] = cloneFormData[key];
      }
    });

    await review.save();

    return res.status(200).json({
      status: true,
      message: 'Cập nhật đánh giá thành công',
      data: review,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: 'Đã xảy ra lỗi, vui lòng thử lại',
    });
  }
};

// [DELETE] /reviews/:id
export const deleteReview = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const { id } = req.params;

    const existingReview = await ReviewMethods.getReviewsById(id);

    if (!existingReview) {
      return res.status(403).json({
        status: false,
        message: 'Không tồn tại bình luận tương ứng',
      });
    }

    await ReviewMethods.deleteReviewById(id);

    const reviews = await ReviewMethods.getReviews();
    return res.status(200).json({
      status: true,
      message: 'Xoá đánh giá thành công',
      data: reviews,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: 'Đã xảy ra lỗi, hãy thử lại sau',
    });
  }
};

// [GET] /reviews
export const getAllReviews = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const reviews = await ReviewMethods.getReviews();

    if (reviews.length > 0) {
      return res.status(200).json({
        status: true,
        message: 'Danh sách đánh giá',
        data: reviews,
      });
    }

    return res.status(204).json({
      status: false,
      message: 'Không tồn tại đánh giá cho sản phẩm này',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: 'Đã xảy ra lỗi, hãy thử lại',
    });
  }
};

// [GET] /reviews/:id
export const getDetailReview = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const { id } = req.params;

    const review = await ReviewMethods.getReviewsById(id);

    if (review) {
      return res.status(200).json({
        status: true,
        message: 'Danh sách đánh giá theo sản phẩm',
        data: review,
      });
    }

    return res.status(204).json({
      status: false,
      message: 'Không tồn tại đánh giá cho sản phẩm này',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: 'Đã xảy ra lỗi, hãy thử lại',
    });
  }
};

// [GET] /reviews/product/:product_id
export const getAllReviewsByProductId = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const { product_id } = req.params;

    const reviews = await ReviewMethods.getReviewsByProductId(product_id);

    if (reviews.length > 0) {
      return res.status(200).json({
        status: true,
        message: 'Danh sách đánh giá theo sản phẩm',
        data: reviews,
      });
    }

    return res.status(204).json({
      status: false,
      message: 'Không tồn tại đánh giá cho sản phẩm này',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: 'Đã xảy ra lỗi, hãy thử lại',
    });
  }
};

// [GET] /reviews
export const getAllReviewsByUserId = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const { user_id } = req.params;

    const reviews = await ReviewMethods.getReviewsByUserId(user_id);

    if (reviews.length > 0) {
      return res.status(200).json({
        status: true,
        message: 'Danh sách đánh giá theo người đánh giá',
        data: reviews,
      });
    }

    return res.status(204).json({
      status: false,
      message: 'Đánh giá không tồn tại người dùng nào',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: 'Đã xảy ra lỗi, hãy thử lại',
    });
  }
};

// [POST] /reviews/uploads/media
export const uploadMedia = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const imagesData = req.files;

    if (imagesData && Array.isArray(imagesData) && imagesData.length > 0) {
      const imagesPath = imagesData.map((image: any) => `/uploads/reviews/${image.originalname}`);

      return res.status(200).json({
        status: true,
        message: 'Upload ảnh đánh giá thành công',
        data: imagesPath,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: 'Đã có lỗi xảy ra, hãy thử lại sau',
    });
  }
};

// [POST] /reviews/uploads/photos
export const uploadImagesProduct = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const imagesData = req.files;

    if (imagesData && Array.isArray(imagesData) && imagesData.length > 0) {
      const imagesPath = imagesData.map((image: any) => `/uploads/reviews/${image.originalname}`);

      return res.status(200).json({
        status: true,
        message: 'Upload ảnh đánh giá thành công',
        data: imagesPath,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: 'Đã có lỗi xảy ra, hãy thử lại sau',
    });
  }
};

// [PATCH] /review/like/:id
export const likeReview = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const reply = await ReviewMethods.likeNews(id as string, userId as string);

    return res.status(200).json({
      status: true,
      message: 'Like phản hồi bình luận thành công',
      data: reply,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: `Đã xảy ra lỗi, vui lòng thử lại sau`,
    });
  }
};

// [PATCH] /review/unlike/:id
export const unlikeReview = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const reply = await ReviewMethods.unlikeNews(id as string, userId as string);

    return res.status(200).json({
      status: true,
      message: 'unLike phản hồi bình luận thành công',
      data: reply,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: `Đã xảy ra lỗi, vui lòng thử lại sau`,
    });
  }
};
