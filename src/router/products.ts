import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getDetailProductBySlug,
  getProductBySearch,
  updateProduct,
} from '../app/controllers/products';
import express from 'express';
import { isAdmin, isAuthenticated } from '../app/middlewares';
import { uploadProductPhotos } from '../utils';

export default (router: express.Router) => {
  router.get('/products', getAllProducts);
  router.get('/products/search', getProductBySearch);
  router.get('/product/:slug', getDetailProductBySlug);

  // These routers are admin to allow continue
  router.post('/products', isAuthenticated, isAdmin, uploadProductPhotos.array('photos', 12), createProduct);
  router.patch('/product/:id', isAuthenticated, isAdmin, uploadProductPhotos.array('photos', 12), updateProduct);
  router.delete('/product/:id', isAuthenticated, isAdmin, deleteProduct);
};
