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
  getAllProductsByCategory,
} from '../app/controllers/products';
import express from 'express';
import { isAdmin, isAuthenticated } from '../app/middlewares';
import { uploadProductPhotos } from '../utils';

export default (router: express.Router) => {
  router.get('/products/slug/:slug', getOne);
  router.get('/products/search', getProductBySearch);
  router.get('/products/:id', getOneById);
  router.get('/products/category/:slug', getAllProductsByCategory);

  // Định nghĩa route cho products có phân trang
  router.get('/products', getProductsOncePage); // Chỉ định route này cho phân trang

  // Các route cần quyền admin
  router.post('/products', isAdmin, uploadProductPhotos.array('photos', 12), createProduct);
  router.post('/products/uploads/photo', isAdmin, uploadProductPhotos.single('file'), uploadImageForDescription);
  router.post('/products/uploads/photos', isAdmin, uploadProductPhotos.array('files', 12), uploadImagesProduct);
  router.patch('/products/:id', isAdmin, uploadProductPhotos.array('photos', 12), updateProduct);
  router.delete('/products/:id', isAdmin, deleteProduct);
};
