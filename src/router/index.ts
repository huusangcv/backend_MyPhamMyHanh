import express from 'express';
import authentication from './authentication';
import users from './users';
import products from './products';
import categories from './categories';
import genres from './genres';
const router = express.Router();

export default (): express.Router => {
  authentication(router);
  users(router);
  products(router);
  categories(router);
  genres(router);
  return router;
};
