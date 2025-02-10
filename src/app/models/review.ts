import { Schema, model } from 'mongoose';

const ReviewSchema = new Schema(
  {
    user_id: { type: String, required: true },
    product_id: { type: String, required: true },
    rating: { type: String },
    content: { type: String, required: true },
    media: { type: [String], required: true },
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
  getReviewsByProductId: (id: string) => ReviewModel.findOne({ product_id: id }),
  createReview: (values: Record<string, any>) => new ReviewModel(values).save().then((reviews) => reviews.toObject()),
  updateReviewById: (id: string) => ReviewModel.findByIdAndUpdate({ _id: id }),
  deleteReviewById: (id: string) => ReviewModel.findByIdAndDelete({ _id: id }),
};
