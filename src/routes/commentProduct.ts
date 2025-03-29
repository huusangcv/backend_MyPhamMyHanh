import express from 'express';
import {
  createCommentProduct,
  deleteCommentProduct,
  updateCommentProduct,
  getAllCommentsProduct,
} from '../app/controllers/commentProduct';
export default (router: express.Router) => {
  router.post('/commentsProduct', createCommentProduct);
  router.patch('/commentsProduct/:id', updateCommentProduct);
  router.delete('/commentsProduct/:id', deleteCommentProduct);

  router.get('/commentsProduct/product/:id', getAllCommentsProduct);
};
