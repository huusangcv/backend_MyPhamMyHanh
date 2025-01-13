import express from 'express';
import { deleteUser, getAllUsers, updateUser } from '../app/controllers/users';
import { isAuthenticated, isOwner } from '../app/middlewares';

export default (router: express.Router) => {
  router.get('/users', isAuthenticated, getAllUsers);
  router.delete('/users/:id', isAuthenticated, isOwner, deleteUser);
  router.patch('/users/:id', isAuthenticated, isOwner, updateUser);
};
