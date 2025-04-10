import { Schema, model } from 'mongoose';
const ReportOrderSchema = new Schema(
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
const ReportOrderModel = model('ReportOrder', ReportOrderSchema);
export default ReportOrderModel;

export const ReportOrderMethods = {
  getReportOrders: () => ReportOrderModel.find().populate('orderId').populate('userId'),
  getReportOrderById: (id: string) => ReportOrderModel.findOne({ _id: id }).populate('orderId').populate('userId'),
  createReportOrder: (values: Record<string, any>) =>
    new ReportOrderModel(values).save().then((reportOrder) => reportOrder.toObject()),
  updateReportOrderById: (id: string, values: Record<string, any>) =>
    ReportOrderModel.findByIdAndUpdate(id, values, { new: true }),
  deleteReportOrderById: (id: string) => ReportOrderModel.findByIdAndDelete(id),
};
