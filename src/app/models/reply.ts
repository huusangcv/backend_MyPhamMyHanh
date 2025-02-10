import { Schema, model } from 'mongoose';

const ReplySchema = new Schema(
  {
    user_id: { type: String },
    review_id: { type: String },
    content: { type: String },
  },
  {
    timestamps: true,
  },
);

const ReplyModel = model('Reply', ReplySchema);

export default ReplyModel;

export const ReplyMethods = {
  getReplies: () => ReplyModel.find(),
  getReplyById: (id: string) => ReplyModel.findOne({ _id: id }),
  getRepliesByUserId: (id: string) => ReplyModel.findOne({ user_id: id }),
  createReply: (values: Record<string, any>) => new ReplyModel(values).save().then((replies) => replies.toObject()),
  updateReplyById: (id: string) => ReplyModel.findByIdAndUpdate({ _id: id }),
  deleteReplyById: (id: string) => ReplyModel.findByIdAndDelete({ _id: id }),
};
