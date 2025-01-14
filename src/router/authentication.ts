import express from 'express';
import { register, login, logout } from '../app/controllers/authentication';
import { deleteUser, detailUser, updateUser } from '../app/controllers/users';
import { isAuthenticated, isOwner } from '../app/middlewares';

export default (router: express.Router) => {
  router.post('/auth/user/register', register);
  router.post('/auth/user/login', login);
  router.get('/auth/user/logout/:id', isAuthenticated, isOwner, logout);

  //User after login
  router.get('/auth/user/:id', isAuthenticated, isOwner, detailUser);
  router.patch('/auth/user/:id', isAuthenticated, isOwner, updateUser);
  router.delete('/auth/user/:id', isAuthenticated, isOwner, deleteUser);
};
