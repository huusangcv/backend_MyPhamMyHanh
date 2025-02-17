import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getOne,
  getProductBySearch,
  getProductsOncePage,
  updateProduct,
  uploadImageForDescription,
  uploadImagesProduct,
  getOneById,
} from '../app/controllers/products';
import express from 'express';
import { isAdmin, isAuthenticated } from '../app/middlewares';
import { uploadProductPhotos } from '../utils';

export default (router: express.Router) => {
  router.get('/products/search', getProductBySearch);
  // router.get('/products/:slug', getOne);
  router.get('/products/:id', getOneById);
  router.get('/products', getProductsOncePage);
  router.get('/products', getAllProducts);

  // These routers are admin to allow continue
  router.post('/products', uploadProductPhotos.array('photos', 12), createProduct);
  router.post('/products/uploads/photo', uploadProductPhotos.single('file'), uploadImageForDescription);
  router.post('/products/uploads/photos', uploadProductPhotos.array('files', 12), uploadImagesProduct);
  router.patch('/products/:id', uploadProductPhotos.array('photos', 12), updateProduct);
  router.delete('/products/:id', deleteProduct);
};
