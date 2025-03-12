import express from 'express';
import {
  createReplyPost,
  deleteReplyPost,
  getAllReplies,
  getRepliesByCommentPost,
  updateReplyPost,
} from '../app/controllers/replyPost';

export default (router: express.Router) => {
  router.get('/repliesPost/comment/:commentId/', getRepliesByCommentPost);
  router.get('/repliesPost', getAllReplies);

  router.post('/repliesPost/comment/:commentId', createReplyPost);
  router.patch('/repliesPost/comment/:commentId/:id', updateReplyPost);
  router.delete('/repliesPost/comment/:commentId/:id', deleteReplyPost);

  router.patch('/repliesPost/like/:id');
  router.patch('/repliesPost/unlike/:id');
};
