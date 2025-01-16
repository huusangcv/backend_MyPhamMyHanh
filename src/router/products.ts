import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getDetailProductBySlug,
  getProductBySearch,
  updateProduct,
  uploadPhotos,
} from '../app/controllers/products';
import express from 'express';
import { isAdmin, isAuthenticated } from '../app/middlewares';
import { uploadProductPhotos } from '../utils';

export default (router: express.Router) => {
  router.get('/products', getAllProducts);
  router.get('/products/search', getProductBySearch);
  router.get('/product/:slug', getDetailProductBySlug);

  // These routers are admin to allow continue
  router.post('/products', isAuthenticated, isAdmin, createProduct);
  router.post('/products/upload/photos/:id', uploadProductPhotos.array('photos', 12), uploadPhotos);
  router.patch('/product/:id', isAuthenticated, isAdmin, updateProduct);
  router.delete('/product/:id', isAuthenticated, isAdmin, deleteProduct);
};
