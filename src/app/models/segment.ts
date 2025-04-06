import { Schema, model } from 'mongoose';
import slugify from 'slugify';

const SegmentSchema = new Schema(
  {
    name: { type: String, require: true },
    slug: { type: String, require: true },
    description: { type: String, default: '' },
    note: { type: String, default: '' },
    status: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  },
);

//Transfrom name to slug for product
SegmentSchema.pre('save', function (next) {
  if (this.isModified('name') || this.isNew) {
    if (typeof this.name === 'string') {
      this.slug = slugify(this.name, { lower: true, strict: true }); // Tạo slug từ name
    }
  }
  next();
});

const SegmentModel = model('Segment', SegmentSchema);

export default SegmentModel;

export const SegmentMethods = {
  getSegments: () => SegmentModel.find(),
  getDetailSegmentById: (id: string) => SegmentModel.findOne({ _id: id }),
  createSegment: (values: Record<string, any>) =>
    new SegmentModel(values).save().then((segments) => segments.toObject()),
  updateSegmentById: (id: string): any => SegmentModel.findByIdAndUpdate({ _id: id }),
  deleteSegmentById: (id: string) => SegmentModel.findByIdAndDelete({ _id: id }),
};
