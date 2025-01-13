import { Schema, model, plugin } from 'mongoose';
const slug = require('mongoose-slug-updater');
plugin(slug);
const ProductSchema = new Schema(
  {
    name: { type: String, require: true },
    slug: { type: String, slug: 'name', unique: true },
    price: { type: Number, require: true, min: 0 },
    category_id: { type: String, require: true },
    note: { type: String, default: '' },
    description: { type: String, require: true },
    image: { type: String, require: true },
    status: { type: String, require: true, default: 'active' },
    sold: { type: Number, default: 0, min: 0 },
    bestseller: { type: String, default: 'none' },
    discount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  },
);

const ProductModel = model('product', ProductSchema);

export default ProductModel;

export const ProductMethods = {
  getProducts: () => ProductModel.find(),
  createProduct: (values: Record<string, any>) => new ProductModel(values).save().then((product) => product.toObject()),
  getProductById: (id: String) =>
    ProductModel.findById({
      _id: id,
    }),
  updateProduct: (id: String) =>
    ProductModel.findByIdAndUpdate({
      _id: id,
    }),
  deleteProduct: (id: String) =>
    ProductModel.findByIdAndDelete({
      _id: id,
    }),
};
