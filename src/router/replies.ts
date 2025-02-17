import express from 'express';

export default (router: express.Router) => {
  router.post('/replies');
  router.patch('/replies/:id');
  router.delete('/replies/:id');
};
