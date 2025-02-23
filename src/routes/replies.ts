import { createReply } from '../app/controllers/reply';
import express from 'express';

export default (router: express.Router) => {
  router.post('/replies', createReply);
  router.patch('/replies/:id');
  router.delete('/replies/:id');
};
