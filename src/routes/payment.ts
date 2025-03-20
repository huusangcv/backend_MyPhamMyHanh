import express from 'express';
import { createPaymentUrl, createPaymentUrlMoMo } from '../app/controllers/payment';
export default (router: express.Router) => {
  router.post('/orders/create_payment_url', createPaymentUrl);
  router.post('/orders/momo', createPaymentUrlMoMo);
};
