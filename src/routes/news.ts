import {
  createNews,
  getAllNews,
  searchNews,
  detailNews,
  deleteNews,
  updateNews,
  uploadImageForContent,
} from '../app/controllers/news';
import express from 'express';
import { uploadNewsThumb } from '../utils';
import { isAdmin, isAuthenticated } from '../app/middlewares';

export default (router: express.Router) => {
  router.get('/news', getAllNews);
  router.get('/news/search', searchNews);
  router.get('/news/:slug', detailNews);

  router.post('/news/uploads/photo',uploadNewsThumb.single('file'),  uploadImageForContent);
  router.post('/news', uploadNewsThumb.single('thumb'), createNews);
  router.patch('/news/:id', uploadNewsThumb.single('thumb'), updateNews);
  router.delete('/news/:id',  deleteNews);
};
