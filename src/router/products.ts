import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getOne,
  getProductBySearch,
  getProductsOncePage,
  updateProduct,
} from '../app/controllers/products';
import express from 'express';
import { isAdmin, isAuthenticated } from '../app/middlewares';
import { uploadProductPhotos } from '../utils';

export default (router: express.Router) => {
  router.get('/products/:slug', getOne);
  router.get('/products', getProductsOncePage);
  router.get('/products', getAllProducts);
  router.get('/products/search', getProductBySearch);

  // These routers are admin to allow continue
  router.post('/products', isAuthenticated, isAdmin, uploadProductPhotos.array('photos', 12), createProduct);
  router.patch('/product/:id', isAuthenticated, isAdmin, uploadProductPhotos.array('photos', 12), updateProduct);
  router.delete('/product/:id', isAuthenticated, isAdmin, deleteProduct);
};
