import multer from 'multer';
import express from 'express';
// storage for avatar profile
export const uploadProfile = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'src/uploads/profile/');
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  }),
});

// storage for photos product
export const uploadProductPhotos = multer({
  storage: multer.diskStorage({
    destination: function (req, files, cb) {
      cb(null, 'src/uploads/products/');
    },
    filename: function (req, files, cb) {
      cb(null, files.originalname);
    },
  }),
});

export const uploadNewsThumb = multer({
  storage: multer.diskStorage({
    destination: (req: express.Request, file, cb) => {
      cb(null, 'src/uploads/news/');
    },
    filename: (req: express.Request, file, cb) => {
      cb(null, file.originalname);
    },
  }),
});

export const uploadCertificateImage = multer({
  storage: multer.diskStorage({
    destination: (req: express.Request, file, cb) => {
      cb(null, 'src/uploads/certificates/');
    },
    filename: (req: express.Request, file, cb) => {
      cb(null, file.originalname);
    },
  }),
});
