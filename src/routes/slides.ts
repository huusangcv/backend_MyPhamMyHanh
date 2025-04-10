import express from 'express';
import { createSlide, deleteSlide, getSlides, updateSlide } from '../app/controllers/slide';
import { uploadSlideImages } from '../utils';

export default (router: express.Router) => {
  router.post('/slides', uploadSlideImages.single('image'), createSlide);
  router.patch('/slides/:id', uploadSlideImages.single('image'), updateSlide);
  router.delete('/slides/:id', deleteSlide);
  router.get('/slides', getSlides);
};
