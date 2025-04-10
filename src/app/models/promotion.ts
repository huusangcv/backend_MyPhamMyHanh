import { Schema, model } from 'mongoose';

const PromotionSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    discountType: {
      type: String,
      enum: ['percentage', 'fixed'], // Loại giảm giá có thể là phần trăm hoặc một số tiền cố định
      required: true,
    },
    discountValue: {
      type: Number,
      required: true,
      min: [0, 'Giá trị giảm giá phải lớn hơn hoặc bằng 0.'], // Đảm bảo giá trị không âm
    },
    startDate: {
      type: Date,
      required: true, // Ngày bắt đầu áp dụng khuyến mãi
    },
    endDate: {
      type: Date,
      required: true, // Ngày kết thúc khuyến mãi
    },
    applicableProducts: {
      type: [Schema.Types.ObjectId],
      ref: 'Product',
    },
    usageLimit: {
      type: Number,
      default: null, // Số lượng sử dụng tối đa cho mã khuyến mãi, có thể để null nếu không giới hạn
      min: [0, 'Giới hạn sử dụng không thể âm.'],
    },
    timesUsed: {
      type: Number,
      default: 0, // Số lần mã khuyến mãi đã được sử dụng
      min: [0, 'Số lần sử dụng không thể âm.'],
    },
  },
  {
    timestamps: true,
  },
);
