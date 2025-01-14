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
  router.post('/categories', isAuthenticated, isAdmin, createCategory);
  router.patch('/category/:id', isAuthenticated, isAdmin, updateCategory);
  router.delete('/category/:id', isAuthenticated, isAdmin, deleteCategory);
  router.get('/categories', getAllCategory);
  router.get('/category/:slug', getCategoryBySlug);
  router.get('/categories/search', getCategoryBySearch);
};
