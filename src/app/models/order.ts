import { Schema, model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
const generateShortId = () => {
  return 'MDH' + uuidv4().replace(/-/g, '').slice(0, 6);
};
const OrderSchema = new Schema(
  {
    user_id: { type: String },
    fullName: { type: String },
    phone: { type: Number },
    email: { type: String },
    address: { type: String },
    note: { type: String },
    products: { type: [String] },
    total: { type: Number },
    returned: { type: Boolean, default: false },
    reference: { type: String },
    status: { type: String },
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
  createOrder: (values: Record<string, any>) => {
    const cloneValues = { ...values };
    cloneValues.reference = generateShortId();
    return new OrderModel(cloneValues).save().then((order) => order);
  }, // eslint-disable-lineSecurity/avoid-new-operator
  deleteOrderById: (id: string) => OrderModel.findByIdAndDelete(id),
  updateOrderById: (id: string): any => OrderModel.findByIdAndUpdate(id),
};
