import { uploadReviewMedia } from '../utils';
import {
  createReview,
  getAllReviewsByProductId,
  getAllReviewsByUserId,
  getAllReviews,
  uploadMedia,
  getDetailReview,
  deleteReview,
  updateReview,
  likeReview,
  unlikeReview,
} from '../app/controllers/reviews';
import express from 'express';

export default (router: express.Router) => {
  router.get('/reviews', getAllReviews);
  router.get('/reviews/:id', getDetailReview);
  router.get('/reviews/products/:product_id', getAllReviewsByProductId);
  router.get('/reviews/users/:user_id', getAllReviewsByUserId);

  router.post('/reviews/uploads/photos', uploadReviewMedia.array('files', 12), uploadMedia);
  // router.post('/products/uploads/photos', uploadProductPhotos.array('files', 12), uploadImagesProduct);
  router.post('/reviews', uploadReviewMedia.array('media', 12), createReview);
  router.delete('/reviews/:id', deleteReview);
  router.patch('/reviews/:id', updateReview);

  router.patch('/reviews/like/:id', likeReview);
  router.patch('/reviews/unlike/:id', unlikeReview);
};
