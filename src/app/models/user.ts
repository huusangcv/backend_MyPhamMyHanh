import { Schema, model } from 'mongoose';

const UserSchema = new Schema(
  {
    username: { type: String, require: true },
    email: { type: String, require: true },
    address: { type: String, default: '' },
    phone: { type: String, default: '' },
    roles: { type: String, default: 'customer' },
    status: { type: String, default: 'active' },
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
  getUserById: (id: string) => UserModal.findById(id),
  createUser: (values: Record<string, any>) => new UserModal(values).save().then((user) => user.toObject()),
  deleteUserById: (id: string) => UserModal.findOneAndDelete({ _id: id }),
  updateUserById: (id: string) => UserModal.findOneAndUpdate({ _id: id }),
};
