import {
  createNews,
  getAllNews,
  searchNews,
  detailNews,
  deleteNews,
  updateNews,
  uploadImageForContent,
  getAllNewsByTag,
  likeNews,
  unlikeNews,
} from '../app/controllers/news';
import express from 'express';
import { uploadNewsThumb } from '../utils';
import { isAdmin, isAuthenticated } from '../app/middlewares';

export default (router: express.Router) => {
  router.get('/news/tag/:slug', getAllNewsByTag);
  router.get('/news', getAllNews);
  router.get('/news/search', searchNews);
  router.get('/news/:slug', detailNews);

  router.post('/news/uploads/photo', uploadNewsThumb.single('file'), uploadImageForContent);
  router.post('/news', uploadNewsThumb.single('thumb'), createNews);
  router.patch('/news/:id', uploadNewsThumb.single('thumb'), updateNews);
  router.patch('/news/like/:id', likeNews);
  router.patch('/news/unlike/:id', unlikeNews);
  router.delete('/news/:id', deleteNews);
};
