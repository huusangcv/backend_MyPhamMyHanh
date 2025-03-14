import express from 'express';
import {
  createUser,
  deleteUser,
  detailUser,
  getAllUsers,
  profileUser,
  searchUsers,
  updateUser,
  uploadAvatar,
} from '../app/controllers/users';
import { isAdmin, isAuthenticated, isOwner } from '../app/middlewares';
import { loginForAdmin, logoutForAdmin } from '../app/controllers/authentication';
import { uploadProfile } from '../utils';

//Admin ep: this router for admin
export default (router: express.Router) => {
  router.post('/login', loginForAdmin);
  router.get('/logout', isAuthenticated, logoutForAdmin);

  router.get('/users', getAllUsers);
  router.get('/users/search', searchUsers);
  router.get('/users/:id', detailUser);
  router.get('/users/profile/:sessionToken', profileUser);

  router.post('/users', createUser);
  router.delete('/users/:id', deleteUser);
  router.patch('/users/:id', updateUser);
  // router.post('/users/profile/:id', isAuthenticated, isOwner, uploadProfile.single('file'), uploadAvatar);
  router.post('/users/profile/avatar', uploadProfile.single('file'), uploadAvatar);
};
