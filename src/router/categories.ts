import {
  createCategory,
  deleteCategory,
  getAllCategory,
  getCategoryBySlug,
  updateCategory,
} from '../app/controllers/categories';
import express from 'express';
export default (router: express.Router) => {
  router.post('/categories', createCategory);
  router.patch('/category/:id', updateCategory);
  router.delete('/category/:id', deleteCategory);
  router.get('/categories', getAllCategory);
  router.get('/category/:slug', getCategoryBySlug);
};
