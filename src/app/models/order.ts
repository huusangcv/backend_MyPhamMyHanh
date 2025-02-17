import { Schema, model } from 'mongoose';

const OrderSchema = new Schema({
  user_id: { type: String, required: true },
  fullName: { type: String, required: true },
  phone: { type: Number, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  note: { type: String },
  products: { type: [String], required: true },
  total: { type: Number },
  returned: { type: Boolean, default: false },
  reference: { type: String },
  status: { type: String, required: true },
});

const OrderModel = model('Order', OrderSchema);

export default OrderModel;

const OrderMethods = {
  getOrders: () => OrderModel.find(),
};
