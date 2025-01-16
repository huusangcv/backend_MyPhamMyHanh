import { Schema, model } from 'mongoose';
import slugify from 'slugify';
const NewsSchema = new Schema(
  {
    title: { type: String },
    content: { type: String },
    image: { type: String, trim: true },
    view: { type: Number, default: 0 },
    author: { type: String },
    tags: { type: [String], default: [] },
    slug: { type: String, unique: true },
    status: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  },
);

NewsSchema.pre('save', function (next) {
  if (this.isModified('title') || this.isNew) {
    if (typeof this.title === 'string') {
      this.slug = slugify(this.title, { lower: true, strict: true });
    }
  }
  next();
});

const NewsModal = model('News', NewsSchema);

export default NewsModal;

export const NewsMethods = {
  getNews: () => NewsModal.find(),
  getNewsById: (id: string) => NewsModal.findById({ _id: id }),
  getNewsBySlug: (slug: string) => NewsModal.findOne({ slug }),
  getNewsBySearch: (query: string): any =>
    NewsModal.find({
      $or: [
        { title: { $regex: query, $options: 'i' } }, //Find not care toLowCase or toUpCase
        { subtitle: { $regex: query, $options: 'i' } },
      ],
    }),
  createNews: (values: Record<string, any>) => new NewsModal(values).save().then((news) => news.toObject()),
  updateNewsById: (id: string): any => NewsModal.findByIdAndUpdate({ _id: id }),
  deleteNewsById: (id: string) => NewsModal.findByIdAndDelete({ _id: id }),
};
