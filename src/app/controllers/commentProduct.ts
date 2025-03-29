import express from 'express';
import { commentProductMethods } from '../models/commentProduct';
import { ReplyProductMethods } from '../models/replyProduct';

// [POST] /commentsPost
export const createCommentProduct = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const formData = req.body;
    const cloneFormData = { ...formData };

    const commentProduct = await commentProductMethods.createCommentProduct(cloneFormData);

    if (commentProduct) {
      return res.status(200).json({
        status: true,
        message: 'Tạo mới bình luận sản phẩm thành công',
        data: commentProduct,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: `Đã xảy ra lỗi, vui lòng thử lại sau`,
    });
  }
};

// [DELETE] /commentsPost/:id
export const deleteCommentProduct = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const { id } = req.params;

    await commentProductMethods.deleteCommentProductById(id);
    await ReplyProductMethods.deleteReplyByCommentId(id);

    return res.status(200).json({
      status: true,
      message: 'Xoá bình luận sản phẩm thành công',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: `Đã xảy ra lỗi, vui lòng thử lại sau`,
    });
  }
};

// [POST] /commentsPost/:id
export const updateCommentProduct = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const formData = req.body;
    const cloneFormData = { ...formData };
    const { id } = req.params;

    const commentProduct = await commentProductMethods.updateCommentProductById(id);

    if (!commentProduct) {
      return res.status(404).json({
        status: false,
        message: 'Không tìm thấy bình luận',
      });
    }

    commentProduct.content = cloneFormData.content;

    await commentProduct.save();

    return res.status(200).json({
      status: true,
      message: 'Cập nhật bình luận bài viết thành công',
      data: commentProduct,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: `Đã xảy ra lỗi, vui lòng thử lại sau`,
    });
  }
};

// [GET] /commentsProduct/product/:id
export const getAllCommentsProduct = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const { id } = req.params;

    const commentsProduct = await commentProductMethods.getCommentsProductByProductId(id);

    if (commentsProduct.length > 0) {
      return res.status(200).json({
        status: true,
        message: 'Danh sách bình luận',
        data: commentsProduct,
      });
    }

    return res.status(404).json({
      status: false,
      message: 'Không có bình luận nào cho sản phẩm này',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: `Đã xảy ra lỗi, vui lòng thử lại sau`,
    });
  }
};
