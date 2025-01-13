import { Schema, model, plugin } from 'mongoose';
const slugify = require('slugify');
const ProductSchema = new Schema(
  {
    name: { type: String, require: true },
    slug: { type: String, unique: true },
    price: { type: Number, require: true, min: 0 },
    category_id: { type: String, require: true },
    note: { type: String, default: '' },
    description: { type: String, require: true },
    image: { type: String, require: true, default: '' },
    status: { type: Boolean, require: true, default: true },
    sold: { type: Number, default: 0, min: 0 },
    bestseller: { type: Boolean, default: false },
    discount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  },
);

ProductSchema.pre('save', function (next) {
  if (this.isModified('name') || this.isNew) {
    this.slug = slugify(this.name, { lower: true, strict: true }); // Tạo slug từ name
  }
  next();
});

const ProductModel = model('Product', ProductSchema);

export default ProductModel;

export const ProductMethods = {
  getProducts: () => ProductModel.find(),
  getProductBySlug: (slug: string): any => ProductModel.findOne({ slug }),
  searchProducts: (query: string) =>
    ProductModel.find({
      $or: [
        { name: { $regex: query, $options: 'i' } }, //Find not care toLowCase or toUpCase
        { description: { $regex: query, $options: 'i' } },
      ],
    }),
  createProduct: (values: Record<string, any>) => new ProductModel(values).save().then((product) => product.toObject()),
  getProductById: (id: string) =>
    ProductModel.findById({
      _id: id,
    }),
  updateProductById: (id: string): any =>
    ProductModel.findByIdAndUpdate({
      _id: id,
    }),
  deleteProductById: (id: string): any =>
    ProductModel.findByIdAndDelete({
      _id: id,
    }),
};
