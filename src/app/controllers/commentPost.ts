import express from 'express';
import { commentPostMethods } from '../models/commentPost';
import { ReplyPostMethods } from '../models/replyPost';

// [POST] /commentsPost
export const createCommentPost = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const formData = req.body;
    const cloneFormData = { ...formData };

    const commentPost = await commentPostMethods.createCommentPost(cloneFormData);

    if (commentPost) {
      return res.status(200).json({
        status: true,
        message: 'Tạo mới bình luận bài viết thành công',
        data: commentPost,
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
export const deleteCommentPost = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const { id } = req.params;

    await commentPostMethods.deleteCommentPostById(id);
    await ReplyPostMethods.deleteReplyByCommentId(id);

    return res.status(200).json({
      status: true,
      message: 'Xoá bình luận bài viết thành công',
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
export const updateCommentPost = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const formData = req.body;
    const cloneFormData = { ...formData };
    const { id } = req.params;

    const commentPost = await commentPostMethods.updateCommentPostById(id);

    if (!commentPost) {
      return res.status(404).json({
        status: false,
        message: 'Không tìm thấy bình luận',
      });
    }

    commentPost.content = cloneFormData.content;

    await commentPost.save();

    return res.status(200).json({
      status: true,
      message: 'Cập nhật bình luận bài viết thành công',
      data: commentPost,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: `Đã xảy ra lỗi, vui lòng thử lại sau`,
    });
  }
};

// [PATCH] /commentsPost/like/:id
export const likeCommentPost = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const { id } = req.params;
    const comment = await commentPostMethods.likeCommentPost(id as string);

    return res.status(200).json({
      status: true,
      message: 'Like bình luận thành công',
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

// [PATCH] /commentsPost/unlike/:id
export const unlikeCommentPost = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const { id } = req.params;
    const comment = await commentPostMethods.unlikeCommentPost(id as string);

    return res.status(200).json({
      status: true,
      message: 'unLike bình luận thành công',
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

// [GET] /commentsPost/news/:id
export const getAllCommentsPost = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const { id } = req.params;

    const commentsPost = await commentPostMethods.getCommentsPostByNewsId(id);

    if (commentsPost.length > 0) {
      return res.status(200).json({
        status: true,
        message: 'Danh sách bình luận',
        data: commentsPost,
      });
    }

    return res.status(404).json({
      status: false,
      message: 'Không có bình luận nào cho bài viết này',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: `Đã xảy ra lỗi, vui lòng thử lại sau`,
    });
  }
};
