import { identity } from 'lodash';
import mongoose, { Schema, model } from 'mongoose';

const OrderSchema = new Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String },
    phone: { type: Number },
    email: { type: String },
    address: { type: String },
    note: { type: String },
    products: [
      {
        id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        name: { type: String },
        image: { type: String },
        product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number },
        price: { type: Number },
      },
    ],
    receiver: { type: String },
    total: { type: Number },
    returned: { type: Boolean, default: false },
    reference: { type: String },
    paymentMethod: {
      type: String,
      enum: ['credit_card', 'pickup', 'paypal', 'vnpay', 'momo', 'cash_on_delivery'],
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'success', 'fail'],
      default: 'pending',
    },
    status: {
      type: String,
      enum: ['pending', 'ordered', 'delivering', 'delivered', 'canceled', 'returned'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  },
);

const OrderModel = model('Order', OrderSchema);

export default OrderModel;

export const OrderMethods = {
  getOrders: () => OrderModel.find(),
  getDetailOrderById: (id: string) => OrderModel.findById(id),
  findOrderByUser: (user_id: string) => OrderModel.find({ user_id }),
  searchOrders: (query: string) =>
    OrderModel.find({
      $or: [
        { name: { $regex: query, $options: 'i' } }, //Find not care toLowCase or toUpCase
        { reference: { $regex: query, $options: 'i' } },
      ],
    }),
  createOrder: (values: Record<string, any>) => new OrderModel(values).save().then((order) => order),
  // eslint-disable-lineSecurity/avoid-new-operator
  deleteOrderById: (id: string) => OrderModel.findByIdAndDelete(id),
  updateOrderById: (id: string): any => OrderModel.findByIdAndUpdate(id),
};
