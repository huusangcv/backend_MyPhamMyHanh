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
    like: {
      type: Number,
      default: 0,
    },
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
  likeCommentPost: async (id: string) => {
    const post = (await CommentPostModel.findById(id)) as any;
    if (!post) {
      throw new Error('Bình luận không tồn tại');
    }
    post.like += 1;
    await post.save();
    return post.toObject();
  },

  unlikeCommentPost: async (id: string) => {
    const post = (await CommentPostModel.findById(id)) as any;
    if (!post) {
      throw new Error('Bình luận không tồn tại');
    }
    post.like = Math.max(0, post.like - 1);
    await post.save();
    return post.toObject();
  },
};
