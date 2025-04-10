import { Schema, model } from 'mongoose';

const ReturnOrderSchema = new Schema(
  {
    orderId: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true, // Tự động thêm trường createdAt và updatedAt
  },
);

const ReturnOrderModel = model('ReturnOrder', ReturnOrderSchema);
export default ReturnOrderModel;

export const ReturnOrderMethods = {
  createReturnOrder: (values: Record<string, any>) =>
    new ReturnOrderModel(values).save().then((returnOrder) => returnOrder.toObject()),
  updateReturnOrderById: (id: string, values: Record<string, any>) =>
    ReturnOrderModel.findByIdAndUpdate(id, values, { new: true }),
  deleteReturnOrderById: (id: string) => ReturnOrderModel.findByIdAndDelete(id),
  getReturnOrders: () => ReturnOrderModel.find().populate('orderId').populate('userId'),
  getReturnOrderById: (id: string) => ReturnOrderModel.findOne({ _id: id }).populate('orderId').populate('userId'),
};
