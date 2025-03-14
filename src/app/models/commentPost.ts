import { Schema, model, Types } from 'mongoose';

const CommentPostSchema = new Schema(
  {
    user_id: {
      type: Types.ObjectId,
      required: true,
      ref: 'User',
    },
    news_id: {
      type: Types.ObjectId,
      required: true,
      ref: 'News',
    },
    likes: [
      {
        type: String,
        ref: 'User',
      },
    ],
    content: {
      type: String,
      required: true,
      trim: true,
    },
    replies: [
      {
        type: Types.ObjectId,
        ref: 'ReplyPost',
      },
    ],
  },
  { timestamps: true },
);

const CommentPostModel = model('CommentPost', CommentPostSchema);
export default CommentPostModel;

export const commentPostMethods = {
  createCommentPost: (values: Record<string, any>) =>
    new CommentPostModel(values).save().then((comments) => comments.toObject()),
  deleteCommentPostById: (id: string) => CommentPostModel.findByIdAndDelete({ _id: id }),
  updateCommentPostById: (id: string): any => CommentPostModel.findByIdAndUpdate({ _id: id }),
  getCommentsPost: () => CommentPostModel.find(),
  getCommentsPostByNewsId: (id: string) => CommentPostModel.find({ news_id: id }),
  getCommentsPostByUserId: (id: string) => CommentPostModel.find({ user_id: id }),
  likeNews: async (id: string, userId: string) => {
    const comment = await CommentPostModel.findById(id);
    if (!comment) {
      throw new Error('Bình luận không tồn tại');
    }

    // Kiểm tra xem người dùng đã "like" bài viết chưa
    if (!comment.likes.includes(userId)) {
      comment.likes.push(userId); // Thêm userId vào mảng likes
      await comment.save();
    }

    return comment.toObject();
  },
  unlikeNews: async (id: string, userId: string) => {
    const comment = await CommentPostModel.findById(id);
    if (!comment) {
      throw new Error('Bình luận không tồn tại');
    }

    // Xóa userId khỏi mảng likes nếu nó tồn tại
    comment.likes = (comment.likes as string[]).filter((likeId: string) => likeId.toString() !== userId);
    await comment.save();

    return comment.toObject();
  },
};
