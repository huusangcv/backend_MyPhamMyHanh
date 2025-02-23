import { getDetailSegment } from 'app/controllers/segments';
import { Schema, model } from 'mongoose';

const SegmentSchema = new Schema(
  {
    name: { type: String, require: true },
    note: { type: String, default: '' },
    status: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  },
);

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
