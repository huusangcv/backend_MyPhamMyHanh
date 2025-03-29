import { Schema, model, Types } from 'mongoose';

const CommentProductSchema = new Schema(
  {
    user_id: {
      type: Types.ObjectId,
      required: true,
      ref: 'User',
    },
    product_id: {
      type: Types.ObjectId,
      required: true,
      ref: 'Product',
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    replies: [
      {
        type: Types.ObjectId,
        ref: 'ReplyProduct',
      },
    ],
    status: {
      type: String,
      enum: ['pending', 'success', 'reject'], // Trạng thái bình luận
      default: 'pending',
    },
  },
  { timestamps: true },
);

const CommentProductModel = model('CommentProduct', CommentProductSchema);
export default CommentProductModel;

export const commentProductMethods = {
  createCommentProduct: (values: Record<string, any>) =>
    new CommentProductModel(values).save().then((comments) => comments.toObject()),
  deleteCommentProductById: (id: string) => CommentProductModel.findByIdAndDelete({ _id: id }),
  updateCommentProductById: (id: string): any => CommentProductModel.findByIdAndUpdate({ _id: id }),
  getCommentProducts: () => CommentProductModel.find(),
  getCommentsProductByProductId: (id: string) => CommentProductModel.find({ product_id: id }),
  getCommentProductByUserId: (id: string) => CommentProductModel.find({ user_id: id }),
};
