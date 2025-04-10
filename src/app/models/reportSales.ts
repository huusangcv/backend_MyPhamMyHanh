import { Schema, model } from 'mongoose';

const ReportSalesSchema = new Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    totalSales: {
      type: Number,
      required: true,
    },
    totalOrders: {
      type: Number,
      required: true,
    },
    totalProductsSold: {
      type: Number,
      required: true,
    },
    topSellingProducts: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantitySold: {
          type: Number,
          required: true,
        },
        revenue: {
          type: Number,
          required: true,
        },
      },
    ],
    reportType: {
      type: String,
      enum: ['daily', 'monthly', 'quarterly', 'yearly'],
      required: true,
    },
  },
  {
    timestamps: true, // Tự động thêm createdAt và updatedAt
  },
);

const ReportSalesModel = model('ReportSales', ReportSalesSchema);
export default ReportSalesModel;
