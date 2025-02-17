import { ReplyMethods } from 'app/models/reply';
import express from 'express';

// [POST] /replies
export const createReply = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const formData = req.body;
    const cloneFormData = { ...formData };

    const reply = await ReplyMethods.createReply(cloneFormData);

    if (reply) {
      return res.status(200).json({
        status: true,
        message: 'Trả lời bình luận thành công',
        data: reply,
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

// [PATCH] /replies/:id
export const updateReply = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const { id } = req.params;
    const formData = req.body;
    const cloneFormData = { ...formData };

    let reply = await ReplyMethods.updateReplyById(id);

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
      message: 'Phản hồi đánh giá thành công',
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

// [DELETE] /replies/:id
export const deleteReply = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const { id } = req.params;

    const reply = await ReplyMethods.getReplyById(id);
    if (!reply) {
      return res.status(403).json({
        status: false,
        message: 'Không tồn tại phản hồi tương ứng',
      });
    }

    await ReplyMethods.deleteReplyById(id);
    return res.status(200).json({
      status: true,
      message: 'Xoá phản hồi thành công',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: 'Đã xảy ra lỗi, hãy thử lại',
    });
  }
};

// [GET] /replies/review/:review_id
export const getRepliesByReview = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const { review_id } = req.params;

    const replies = await ReplyMethods.getRepliesByReviewId(review_id);

    if (replies.length > 0) {
      return res.status(200).json({
        status: true,
        message: 'Phản hồi theo đánh giá',
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
