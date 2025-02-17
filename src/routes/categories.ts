import {
  createCategory,
  deleteCategory,
  getAllCategory,
  getCategoryBySearch,
  getCategoryBySlug,
  updateCategory,
} from '../app/controllers/categories';
import express from 'express';
import { isAdmin, isAuthenticated } from '../app/middlewares';
export default (router: express.Router) => {
  router.get('/categories', getAllCategory);
  router.get('/categories/:slug', getCategoryBySlug);
  router.get('/categories/search', getCategoryBySearch);

  //These routers are admin to allow continue
  router.post('/categories', createCategory);
  router.patch('/categories/:id', updateCategory);
  router.delete('/categories/:id', deleteCategory);
};
