import { Schema, model } from 'mongoose';

const ReviewSchema = new Schema(
  {
    user_id: { type: String, required: true },
    product_id: { type: String, required: true },
    rating: { type: Number },
    likes: [
      {
        type: String,
        ref: 'User',
      },
    ],
    content: { type: String, required: true },
    media: { type: [String], required: true },
    status: { type: String, default: 'pending' },
  },
  {
    timestamps: true,
  },
);

const ReviewModel = model('Review', ReviewSchema);
export default ReviewModel;

export const ReviewMethods = {
  getReviews: () => ReviewModel.find(),
  getReviewsById: (id: string) => ReviewModel.findOne({ _id: id }),
  getReviewsByProductId: (id: string) => ReviewModel.find({ product_id: id }),
  getReviewsByUserId: (id: string) => ReviewModel.find({ user_id: id }),
  createReview: (values: Record<string, any>) => new ReviewModel(values).save().then((reviews) => reviews.toObject()),
  updateReviewById: (id: string): any => ReviewModel.findByIdAndUpdate({ _id: id }),
  deleteReviewById: (id: string) => ReviewModel.findByIdAndDelete({ _id: id }),
  likeNews: async (id: string, userId: string) => {
    const review = await ReviewModel.findById(id);
    if (!review) {
      throw new Error('Bình luận không tồn tại');
    }

    // Kiểm tra xem người dùng đã "like" bài viết chưa
    if (!review.likes.includes(userId)) {
      review.likes.push(userId); // Thêm userId vào mảng likes
      await review.save();
    }

    return review.toObject();
  },
  unlikeNews: async (id: string, userId: string) => {
    const review = await ReviewModel.findById(id);
    if (!review) {
      throw new Error('Bình luận không tồn tại');
    }

    // Xóa userId khỏi mảng likes nếu nó tồn tại
    review.likes = (review.likes as string[]).filter((likeId: string) => likeId.toString() !== userId);
    await review.save();

    return review.toObject();
  },
};
