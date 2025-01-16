import express from 'express';
import { deleteUser, detailUser, getAllUsers, searchUsers, updateUser, uploadAvatar } from '../app/controllers/users';
import { isAdmin, isAuthenticated, isOwner } from '../app/middlewares';
import { loginForAdmin, logout } from '../app/controllers/authentication';
import { uploadProfile } from '../utils';

//Admin ep: this router for admin
export default (router: express.Router) => {
  router.post('/login', loginForAdmin);
  router.get('/logout', isAuthenticated, logout);

  router.get('/users', isAuthenticated, isAdmin, getAllUsers);
  router.get('/users/search', isAuthenticated, isAdmin, searchUsers);
  router.get('/user/:id', isAuthenticated, isAdmin, detailUser);

  router.delete('/user/:id', isAuthenticated, isAdmin, deleteUser);
  router.patch('/user/:id', isAuthenticated, isAdmin, updateUser);
  router.post('/user/profile/:id', isAuthenticated, isOwner, uploadProfile.single('file'), uploadAvatar);
};
