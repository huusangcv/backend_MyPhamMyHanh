import {
  createCertificate,
  deleteCertificate,
  detailCertificate,
  getAllCertificates,
  searchCertificates,
  updateCertificate,
} from '../app/controllers/certificates';
import express from 'express';
import { uploadCertificateImage } from '../utils';
import { isAdmin, isAuthenticated } from '../app/middlewares';

export default (router: express.Router) => {
  router.get('/certificates', getAllCertificates);
  router.get('/certificates/search', searchCertificates);
  router.get('/certificate/:id', detailCertificate);

  router.post('/certificates', isAuthenticated, isAdmin, uploadCertificateImage.single('image'), createCertificate);
  router.patch('/certificate/:id', isAuthenticated, isAdmin, uploadCertificateImage.single('image'), updateCertificate);
  router.delete('/certificate/:id', isAuthenticated, isAdmin, deleteCertificate);
};
