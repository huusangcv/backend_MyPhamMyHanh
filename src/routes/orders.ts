import express from 'express';
import {
  createOrder,
  deleteOrder,
  getAllOrders,
  getAllOrdersByUserId,
  getDetailOrder,
  searchOrders,
  updateOrder,
  vnpaymentIPN,
  vnpaymentReturn,
} from '../app/controllers/orders';
export default (router: express.Router) => {
  router.get('/orders/vnpayment_return', vnpaymentReturn);
  router.get('/orders/vnpayment_ipn', vnpaymentIPN);
  router.get('/orders', getAllOrders);
  router.get('/orders/userId/:user_id', getAllOrdersByUserId);
  router.get('/orders/:id', getDetailOrder);
  router.get('/orders/search', searchOrders);
  router.post('/orders', createOrder);
  router.patch('/orders/:id', updateOrder);
  router.delete('/orders/:id', deleteOrder);
};
