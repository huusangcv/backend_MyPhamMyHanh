import { Schema, model } from 'mongoose';

const BlogSchema = new Schema({
  name: { type: String },
  slug: { type: String, unique: true },
  status: { type: Boolean, default: true },
});
