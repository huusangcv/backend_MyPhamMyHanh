import { Schema, model, Types } from 'mongoose';

const ReplyPostSchema = new Schema(
  {
    user_id: {
      type: Types.ObjectId,
      required: true,
      ref: 'User',
    },
    comment_id: {
      type: Types.ObjectId,
      required: true,
      ref: 'CommentPost',
    },
    likes: [
      {
        type: String,
        ref: 'User',
      },
    ],
    tagUser_id: {
      type: Types.ObjectId,
      required: true,
      ref: 'CommentPost',
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true },
);

const ReplyPostModal = model('ReplyPost', ReplyPostSchema);
export default ReplyPostModal;

export const ReplyPostMethods = {
  getReplies: () => ReplyPostModal.find(),
  getRepliesByCommentId: (id: string) => ReplyPostModal.find({ comment_id: id }),
  getReplyById: (id: string) => ReplyPostModal.findOne({ _id: id }),
  getRepliesByUserId: (id: string) => ReplyPostModal.findOne({ user_id: id }),
  createReply: (values: Record<string, any>) => new ReplyPostModal(values).save().then((replies) => replies.toObject()),
  updateReplyById: (id: string): any => ReplyPostModal.findByIdAndUpdate({ _id: id }),
  deleteReplyById: (id: string) => ReplyPostModal.findByIdAndDelete({ _id: id }),
  deleteReplyByCommentId: (commentId: string) => ReplyPostModal.deleteMany({ comment_id: commentId }),
  likeNews: async (id: string, userId: string) => {
    const reply = await ReplyPostModal.findById(id);
    if (!reply) {
      throw new Error('Bình luận không tồn tại');
    }

    // Kiểm tra xem người dùng đã "like" bài viết chưa
    if (!reply.likes.includes(userId)) {
      reply.likes.push(userId); // Thêm userId vào mảng likes
      await reply.save();
    }

    return reply.toObject();
  },
  unlikeNews: async (id: string, userId: string) => {
    const reply = await ReplyPostModal.findById(id);
    if (!reply) {
      throw new Error('Bình luận không tồn tại');
    }

    // Xóa userId khỏi mảng likes nếu nó tồn tại
    reply.likes = (reply.likes as string[]).filter((likeId: string) => likeId.toString() !== userId);
    await reply.save();

    return reply.toObject();
  },
};
