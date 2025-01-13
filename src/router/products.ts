import {
  createProduct,
  getAllProducts,
  getDetailProductBySlug,
  getProductBySearch,
  updateProduct,
} from '../app/controllers/products';
import express from 'express';

export default (router: express.Router) => {
  router.get('/products', getAllProducts);
  router.post('/products', createProduct);
  router.patch('/product/:id', updateProduct);
  router.get('/products/search', getProductBySearch);
  router.get('/product/:slug', getDetailProductBySlug);
};
