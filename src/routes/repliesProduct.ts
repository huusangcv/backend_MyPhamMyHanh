import express from 'express';
import {
  createReplyProduct,
  deleteReplyProduct,
  getAllReplies,
  getRepliesByCommentProduct,
  updateReplyProduct,
} from '../app/controllers/replyProduct';

export default (router: express.Router) => {
  router.get('/repliesProduct/comment/:commentId/', getRepliesByCommentProduct);
  router.get('/repliesProduct', getAllReplies);
  router.post('/repliesProduct/comment/:commentId', createReplyProduct);
  router.patch('/repliesProduct/comment/:commentId/:id', updateReplyProduct);
  router.delete('/repliesProduct/comment/:commentId/:id', deleteReplyProduct);
};
