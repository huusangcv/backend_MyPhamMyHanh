import express from 'express';
import {
  createCommentPost,
  deleteCommentPost,
  getAllCommentsPost,
  likeCommentPost,
  unlikeCommentPost,
  updateCommentPost,
} from '../app/controllers/commentPost';
export default (router: express.Router) => {
  router.post('/commentsPost', createCommentPost);
  router.patch('/commentsPost/:id', updateCommentPost);

  router.patch('/commentsPost/like/:id', likeCommentPost);
  router.patch('/commentsPost/unlike/:id', unlikeCommentPost);
  router.delete('/commentsPost/:id', deleteCommentPost);

  router.get('/commentsPost/news/:id', getAllCommentsPost);
};
