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
  router.get('/genres', getAllGenres);
  router.get('/genres/search', getGenresBySearch);
  router.get('/genre/:slug', getDetailGenre);

  //These routers are admin
  router.post('/genres', isAuthenticated, isAdmin, createGenre);
  router.patch('/genre/:id', isAuthenticated, isAdmin, updateGenre);
  router.delete('/genre/:id', isAuthenticated, isAdmin, deleteGenre);
};
