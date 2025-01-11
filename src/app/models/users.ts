import express from 'express';
import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
    username: { type: String, require: true },
    email: { type: String, require: true },
    authentication: {
        password: { type: String, require: true, select: false },
        salt: { type: String, select: false },
        sessionToken: { type: String, select: false}
    }
});

const UserModal = model('User', UserSchema);

export default UserModal;

export const UsersMethod = {
    getUsers: () => UserModal.find(),
    getUserByEmail: (email: string) => UserModal.findOne({ email }),
    getUserBySessionToken: (sessionToken: string) => UserModal.findOne({ 
        'authentication.sessionToken': sessionToken,
    }),
    getUserById: (id: string) => UserModal.findById(id),
    createUser: (values: Record<string, any>) => new UserModal(values).save().then(user => user.toObject()),
    deleteUserById: (id: string) => UserModal.findOneAndDelete({ _id: id }),
    updateUserById: (id: string) => UserModal.findOneAndUpdate({ _id: id }),
} 

