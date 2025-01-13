import express from 'express';
import authentication from './authentication';
import users from './users';
import products from './products';
import categories from './categories';
const router = express.Router();

export default (): express.Router => {
  authentication(router);
  users(router);
  products(router);
  categories(router);
  return router;
};
