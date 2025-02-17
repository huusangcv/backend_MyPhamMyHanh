import { Schema, model } from 'mongoose';

const UserSchema = new Schema(
  {
    username: { type: String, require: true },
    email: { type: String, require: true, unique: true, match: /.+\@.+\..+/ },
    address: { type: String, default: '' },
    phone: { type: String, default: '' },
    roles: { type: String, default: 'customer', select: false },
    status: { type: String, default: true },
    segment: { type: String, default: '' },
    image: { type: String, default: '' },
    authentication: {
      password: { type: String, require: true, select: false },
      salt: { type: String, select: false },
      sessionToken: { type: String, select: false },
    },
  },
  {
    timestamps: true,
  },
);

const UserModal = model('User', UserSchema);

export default UserModal;

export const UserMethods = {
  getUsers: () => UserModal.find(),
  getUserByEmail: (email: string) => UserModal.findOne({ email }),
  getUserBySessionToken: (sessionToken: string) =>
    UserModal.findOne({
      'authentication.sessionToken': sessionToken,
    }),
  getUsersBySearch: (query: string) =>
    UserModal.find({
      $or: [{ name: { $regex: query, $options: 'i' } }],
    }),
  getUserById: (id: string) => UserModal.findById(id),
  createUser: (values: Record<string, any>) => new UserModal(values).save().then((user) => user.toObject()),
  updateUserById: (id: string): any => UserModal.findByIdAndUpdate({ _id: id }),
  deleteUserById: (id: string) => UserModal.findByIdAndDelete({ _id: id }),
};
