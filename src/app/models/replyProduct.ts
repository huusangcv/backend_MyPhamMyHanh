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
      ref: 'CommentProduct',
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'success', 'reject'], // Trạng thái phản hồi bình luận
      default: 'pending',
    },
  },
  { timestamps: true },
);

const ReplyPost = model('ReplyProduct', ReplyPostSchema);
export default ReplyPost;

export const ReplyProductMethods = {
  getReplies: () => ReplyPost.find(),
  getReplyById: (id: string) => ReplyPost.findOne({ _id: id }),
  getRepliesByUserId: (id: string) => ReplyPost.findOne({ user_id: id }),
  getRepliesByCommentId: (id: string) => ReplyPost.find({ comment_id: id }),
  createReply: (values: Record<string, any>) => new ReplyPost(values).save().then((replies) => replies.toObject()),
  updateReplyById: (id: string): any => ReplyPost.findByIdAndUpdate({ _id: id }),
  deleteReplyById: (id: string) => ReplyPost.findByIdAndDelete({ _id: id }),
  deleteReplyByCommentId: (commentId: string) => ReplyPost.deleteMany({ comment_id: commentId }),
};
