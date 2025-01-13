import express from 'express';
import { register, login, logout } from '../app/controllers/authentication';
import { isAuthenticated } from '../app/middlewares';

export default (router: express.Router) => {
  router.post('/auth/register', register);
  router.post('/auth/login', login);
  router.get('/auth/logout', isAuthenticated, logout);
};
