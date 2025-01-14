import express from 'express';
import { deleteUser, detailUser, getAllUsers, searchUsers, updateUser } from '../app/controllers/users';
import { isAdmin, isAuthenticated } from '../app/middlewares';
import { loginForAdmin, logout } from '../app/controllers/authentication';

//Admin ep: this router for admin
export default (router: express.Router) => {
  router.post('/login', loginForAdmin);
  router.get('/logout', isAuthenticated, logout);

  router.get('/users', isAuthenticated, isAdmin, getAllUsers);
  router.get('/users/search', isAuthenticated, isAdmin, searchUsers);
  router.get('/user/:id', isAuthenticated, isAdmin, detailUser);
  router.patch('/user/:id', isAuthenticated, isAdmin, updateUser);
  router.delete('/user/:id', isAuthenticated, isAdmin, deleteUser);
};
