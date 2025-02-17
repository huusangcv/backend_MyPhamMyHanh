import {
  createGenre,
  updateGenre,
  deleteGenre,
  getAllGenres,
  getGenresBySearch,
  getDetailGenre,
} from '../app/controllers/genres';
import { isAdmin, isAuthenticated } from '../app/middlewares';
import express from 'express';

export default (router: express.Router) => {
  router.get('/genres/:slug', getDetailGenre);
  router.get('/genres/search', getGenresBySearch);
  router.get('/genres', getAllGenres);

  //These routers are admin
  router.post('/genres', createGenre);
  router.patch('/genres/:id', updateGenre);
  router.delete('/genres/:id', deleteGenre);
};
