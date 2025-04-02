import { Schema, model, Types } from 'mongoose';
import slugify from 'slugify';
const NewsSchema = new Schema(
  {
    title: { type: String, require: true },
    content: { type: String },
    image: { type: String, trim: true },
    view: { type: Number, default: 0 },
    likes: [
      {
        type: String,
        ref: 'User',
      },
    ],
    author: { type: String },
    tag_id: { type: String },
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
      ],
    }),
  createNews: (values: Record<string, any>) => new NewsModal(values).save().then((news) => news.toObject()),
  updateNewsById: (id: string): any => NewsModal.findByIdAndUpdate({ _id: id }),
  deleteNewsById: (id: string) => NewsModal.findByIdAndDelete({ _id: id }),
  likeNews: async (id: string, userId: string) => {
    const post = await NewsModal.findById(id);
    if (!post) {
      throw new Error('Bài viết không tồn tại');
    }

    // Kiểm tra xem người dùng đã "like" bài viết chưa
    if (!post.likes.includes(userId)) {
      post.likes.push(userId); // Thêm userId vào mảng likes
      await post.save();
    }

    return post.toObject();
  },
  unlikeNews: async (id: string, userId: string) => {
    const post = await NewsModal.findById(id);
    if (!post) {
      throw new Error('Bài viết không tồn tại');
    }

    // Xóa userId khỏi mảng likes nếu nó tồn tại
    post.likes = post.likes.filter((likeId) => likeId.toString() !== userId);
    await post.save();

    return post.toObject();
  },
};
