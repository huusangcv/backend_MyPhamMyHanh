import express from 'express';
import {
  createReplyPost,
  deleteReplyPost,
  getAllReplies,
  getRepliesByCommentPost,
  updateReplyPost,
  likeRepliesPost,
  unlikeRepliesPost,
} from '../app/controllers/replyPost';

export default (router: express.Router) => {
  router.get('/repliesPost/comment/:commentId/', getRepliesByCommentPost);
  router.get('/repliesPost', getAllReplies);

  router.post('/repliesPost/comment/:commentId', createReplyPost);
  router.patch('/repliesPost/comment/:commentId/:id', updateReplyPost);
  router.patch('/repliesPost/like/:id', likeRepliesPost);
  router.patch('/repliesPost/unlike/:id', unlikeRepliesPost);
  router.delete('/repliesPost/comment/:commentId/:id', deleteReplyPost);
};
