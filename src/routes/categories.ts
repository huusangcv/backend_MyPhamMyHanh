import {
  createCategory,
  deleteCategory,
  getAllCategory,
  getCategoryBySearch,
  getCategoryBySlug,
  updateCategory,
  uploadImageCategory,
} from '../app/controllers/categories';
import express from 'express';
import { isAdmin, isAuthenticated } from '../app/middlewares';
import { uploadCategoryImage } from '../utils';
export default (router: express.Router) => {
  router.get('/categories', getAllCategory);
  router.get('/categories/:slug', getCategoryBySlug);
  router.get('/categories/search', getCategoryBySearch);

  //These routers are admin to allow continue
  router.post('/categories', uploadCategoryImage.single('file'), createCategory);
  router.post('/categories/uploads/photo', uploadCategoryImage.single('file'), uploadImageCategory);
  router.patch('/categories/:id', updateCategory);
  router.delete('/categories/:id', deleteCategory);
};
