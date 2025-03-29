import express from 'express';
import { ReplyProductMethods } from '../models/replyProduct';
import CommentProductModel from '../models/commentProduct';

// [Product] /replies/comment/:commentId
export const createReplyProduct = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const formData = req.body;
    const { commentId } = req.params;
    const cloneFormData = { ...formData };

    const newReply = await ReplyProductMethods.createReply({
      ...cloneFormData,
      comment_id: commentId,
    });

    const comment = await CommentProductModel.findByIdAndUpdate(
      commentId,
      { $push: { replies: newReply._id } }, // Thêm ID của phản hồi vào mảng replies
      { new: true }, // Trả về tài liệu đã cập nhật
    );

    if (newReply) {
      return res.status(200).json({
        status: true,
        message: 'Trả lời bình luận thành công',
        data: {
          newReply,
          comment,
        },
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: 'Đã xảy ra lỗi, hãy thử lại',
    });
  }
};

// [PATCH] /replies/comment/:commentId/:id
export const updateReplyProduct = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const { commentId, id } = req.params;
    const formData = req.body;
    const cloneFormData = { ...formData };

    const existingComment = await CommentProductModel.findById({ _id: commentId });

    if (!existingComment) {
      return res.status(403).json({
        status: false,
        message: 'Không tồn tại bình luận tương ứng',
      });
    }

    let reply = await ReplyProductMethods.updateReplyById(id);

    if (!reply) {
      return res.status(403).json({
        status: false,
        message: 'Không tồn tại phản hồi tương ứng',
      });
    }

    Object.keys(cloneFormData).forEach((key) => {
      if (cloneFormData[key] !== undefined) {
        reply[key] = cloneFormData[key];
      }
    });

    reply.save();

    return res.status(200).json({
      status: true,
      message: 'Phản hồi bình luận thành công',
      data: reply,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: 'Đã xảy ra lỗi, hãy thử lại',
    });
  }
};

// [DELETE] /repliesProduct/comment/:commentId/:id
export const deleteReplyProduct = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const { commentId, id } = req.params;

    const reply = await ReplyProductMethods.deleteReplyById(id);
    if (!reply) {
      return res.status(403).json({
        status: false,
        message: 'Không tồn tại phản hồi tương ứng',
      });
    }

    const comment = await CommentProductModel.findByIdAndUpdate({ _id: commentId });

    if (!comment) {
      return res.status(403).json({
        status: false,
        message: 'Không tồn tại bình luận tương ứng',
      });
    }

    comment.replies = (comment.replies as any).filter((replyId: any) => replyId.toString() !== id);

    comment.save();

    await ReplyProductMethods.deleteReplyById(id);
    return res.status(200).json({
      status: true,
      message: 'Xoá phản hồi thành công',
      comment,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: 'Đã xảy ra lỗi, hãy thử lại',
    });
  }
};

// [GET] /replies/comment/:commentId
export const getRepliesByCommentProduct = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const { commentId } = req.params;

    const replies = await ReplyProductMethods.getRepliesByCommentId(commentId as string);

    if (replies.length > 0) {
      return res.status(200).json({
        status: true,
        message: 'Phản hồi theo bình luận',
        data: replies,
      });
    }

    return res.status(403).json({
      status: false,
      message: 'Không có phản hồi nào',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: 'Đã xảy ra lỗi, hãy thử lại',
    });
  }
};

// [GET] /replies/
export const getAllReplies = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const replies = await ReplyProductMethods.getReplies();

    if (replies.length > 0) {
      return res.status(200).json({
        status: true,
        message: 'Tất cả phản hồi',
        data: replies,
      });
    }

    return res.status(403).json({
      status: false,
      message: 'Không có phản hồi nào',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: 'Đã xảy ra lỗi, hãy thử lại',
    });
  }
};
