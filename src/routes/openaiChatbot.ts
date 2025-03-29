import express from 'express';
import { createContent, uploadImage } from '../app/controllers/openaiChatbot';
import { uploadChatbotAiPhotos } from '../utils';
export default (router: express.Router) => {
  router.post('/openaiChatbot', createContent);
  router.post('/openaiChatbot/uploads/photo', uploadChatbotAiPhotos.single('file'), uploadImage);
};
