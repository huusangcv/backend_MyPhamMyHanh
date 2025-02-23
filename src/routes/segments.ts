import express from 'express';
import {
  createSegment,
  deleteSegment,
  getAllSegments,
  getDetailSegment,
  updateSegment,
} from '../app/controllers/segments';

export default (router: express.Router) => {
  router.get('/segments', getAllSegments);
  router.get('/segments/:id', getDetailSegment);

  router.post('/segments', createSegment);
  router.patch('/segments/:id', updateSegment);
  router.delete('/segments/:id', deleteSegment);
};
