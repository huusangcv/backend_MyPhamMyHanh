import { Schema, model } from 'mongoose';

const CategorySchema = new Schema(
  {
    name: { type: String, require: true },
    note: { type: String, default: '' },
    slug: { type: String, unique: true },
    status: { type: Boolean, default: true },
    image: { type: String },
  },
  {
    timestamps: true,
  },
);

const CategoryModel = model('Category', CategorySchema);

export default CategoryModel;

export const CategoryMethods = {
  getCategory: () => CategoryModel.find(),
  getCategoryBySlug: (slug: string): any => CategoryModel.findOne({ slug }),
  createCategory: (values: Record<string, any>) =>
    new CategoryModel(values).save().then((category) => category.toObject()),
  updateCategory: (id: string) => CategoryModel.findByIdAndUpdate({ _id: id }),
  deleteCategory: (id: string) => CategoryModel.findByIdAndDelete({ _id: id }),
};
