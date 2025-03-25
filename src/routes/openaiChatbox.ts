import express from 'express';
import { createContent } from '../app/controllers/openaiChatbox';
export default (router: express.Router) => {
  router.post('/openaiChatbox', createContent);
};
