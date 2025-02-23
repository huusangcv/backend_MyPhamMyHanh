import express from 'express';
import {
  createOrder,
  deleteOrder,
  getAllOrders,
  getDetailOrder,
  searchOrders,
  updateOrder,
} from '../app/controllers/orders';
export default (router: express.Router) => {
  router.get('/orders', getAllOrders);
  router.get('/orders/:id', getDetailOrder);
  router.get('/orders/search', searchOrders);
  router.post('/orders', createOrder);
  router.patch('/orders/:id', updateOrder);
  router.delete('/orders/:id', deleteOrder);
};
