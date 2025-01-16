import { Schema, model } from 'mongoose';
import slugify from 'slugify';

const GenreSchema = new Schema(
  {
    name: { type: String, unique: true },
    slug: { type: String, unique: true },
    status: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  },
);

//Transfrom name to slug for genre
GenreSchema.pre('save', function (next) {
  if (this.isModified('name') || this.isNew) {
    if (typeof this.name === 'string') {
      this.slug = slugify(this.name, { lower: true, strict: true }); // Tạo slug từ name
    }
  }
  next();
});

const GenreModal = model('Genre', GenreSchema);

export default GenreModal;

export const GenreMethods = {
  getGenres: () => GenreModal.find(),
  getGenreById: (id: string) => GenreModal.findById({ _id: id }),
  getGenreBySlug: (slug: string) => GenreModal.findOne({ slug }),
  createGenre: (values: Record<string, any>) => new GenreModal(values).save().then((genre) => genre.toObject()),
  updateGenreById: (id: string): any => GenreModal.findByIdAndUpdate({ _id: id }),
  deleteGenreById: (id: string): any => GenreModal.findByIdAndDelete({ _id: id }),
  searchGenresByName: (query: string) =>
    GenreModal.find({
      $or: [{ name: { $regex: query, $options: 'i' } }],
    }),
};
