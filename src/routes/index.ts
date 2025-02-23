import express from 'express';
import authentication from './authentication';
import users from './users';
import products from './products';
import categories from './categories';
import genres from './genres';
import news from './news';
import certificates from './certificates';
import reviews from './reviews';
import segments from './segments';
import replies from './replies';
import orders from './orders';
const router = express.Router();

export default (): express.Router => {
  authentication(router);
  users(router);
  products(router);
  orders(router);
  categories(router);
  genres(router);
  news(router);
  certificates(router);
  reviews(router);
  replies(router);
  segments(router);
  return router;
};
