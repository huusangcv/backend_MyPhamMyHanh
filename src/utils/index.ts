import multer from 'multer';
import express from 'express';
// storage for avatar profile
export const uploadProfile = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/profile/');
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
      cb(null, 'uploads/products/');
    },
    filename: function (req, files, cb) {
      cb(null, files.originalname);
    },
  }),
});

// storage for media reviews
export const uploadReviewMedia = multer({
  storage: multer.diskStorage({
    destination: function (req, files, cb) {
      cb(null, 'uploads/reviews/');
    },
    filename: function (req, files, cb) {
      cb(null, files.originalname);
    },
  }),
});

export const uploadNewsThumb = multer({
  storage: multer.diskStorage({
    destination: (req: express.Request, file, cb) => {
      cb(null, 'uploads/news/');
    },
    filename: (req: express.Request, file, cb) => {
      cb(null, file.originalname);
    },
  }),
});

export const uploadCategoryImage = multer({
  storage: multer.diskStorage({
    destination: (req: express.Request, file, cb) => {
      cb(null, 'uploads/categories/');
    },
    filename: (req: express.Request, file, cb) => {
      cb(null, file.originalname);
    },
  }),
});

export const uploadCertificateImage = multer({
  storage: multer.diskStorage({
    destination: (req: express.Request, file, cb) => {
      cb(null, 'uploads/certificates/');
    },
    filename: (req: express.Request, file, cb) => {
      cb(null, file.originalname);
    },
  }),
});

// storage for photos chatbotAi
export const uploadChatbotAiPhotos = multer({
  storage: multer.diskStorage({
    destination: function (req, files, cb) {
      cb(null, 'uploads/chatbot/');
    },
    filename: function (req, files, cb) {
      cb(null, files.originalname);
    },
  }),
});

// storage for photos slide
export const uploadSlideImages = multer({
  storage: multer.diskStorage({
    destination: function (req, files, cb) {
      cb(null, 'uploads/slides/');
    },
    filename: function (req, files, cb) {
      cb(null, files.originalname);
    },
  }),
});
