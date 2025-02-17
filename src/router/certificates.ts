import {
  createCertificate,
  deleteCertificate,
  detailCertificate,
  getAllCertificates,
  searchCertificates,
  updateCertificate,
  uploadImage,
} from '../app/controllers/certificates';
import express from 'express';
import { uploadCertificateImage } from '../utils';
import { isAdmin, isAuthenticated } from '../app/middlewares';

export default (router: express.Router) => {
  router.get('/certificates/search', searchCertificates);
  router.get('/certificates/:id', detailCertificate);
  router.get('/certificates', getAllCertificates);

  //Router for admin
  router.post('/certificates/uploads/photo', uploadCertificateImage.single('file'), uploadImage);
  router.post('/certificates', uploadCertificateImage.single('image'), createCertificate);
  router.patch('/certificates/:id', uploadCertificateImage.single('image'), updateCertificate);
  router.delete('/certificates/:id', deleteCertificate);
};
