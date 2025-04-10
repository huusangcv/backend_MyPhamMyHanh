import { Schema, model } from 'mongoose';

const SlideSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
    backGroundLinerGradient: {
      type: String,
      required: true,
    },
    colorHover: {
      type: String,
      required: true,
    },
    order: {
      type: Number,
      default: 0, // Thứ tự hiển thị của slide
    },
  },
  {
    timestamps: true, // Tự động thêm trường createdAt và updatedAt
  },
);

const SlideModel = model('Slide', SlideSchema);
export default SlideModel;

export const SlideMethods = {
  getSlides: () => SlideModel.find(),
  getSlideById: (id: string) => SlideModel.findOne({ _id: id }),
  createSlide: (values: Record<string, any>) => new SlideModel(values).save().then((slide) => slide.toObject()),
  updateSlideById: (id: string, values: Record<string, any>) => SlideModel.findByIdAndUpdate(id, values, { new: true }),
  deleteSlideById: (id: string) => SlideModel.findByIdAndDelete(id),
};
