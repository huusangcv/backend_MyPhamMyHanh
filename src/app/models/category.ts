import { Schema, model } from 'mongoose';
import slugify from 'slugify';

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

CategorySchema.pre('save', function (next) {
  if (this.isModified('name') || this.isNew) {
    if (typeof this.name === 'string') {
      this.slug = slugify(this.name, { lower: true, strict: true }); // Tạo slug từ name
    }
  }
  next();
});

const CategoryModel = model('Category', CategorySchema);

export default CategoryModel;

export const CategoryMethods = {
  getCategories: () => CategoryModel.find(),
  getCategoryBySlug: (slug: string): any => CategoryModel.findOne({ slug }),
  createCategory: (values: Record<string, any>) =>
    new CategoryModel(values).save().then((category) => category.toObject()),
  updateCategoryById: (id: string): any => CategoryModel.findByIdAndUpdate({ _id: id }),
  deleteCategoryById: (id: string) => CategoryModel.findByIdAndDelete({ _id: id }),
};
