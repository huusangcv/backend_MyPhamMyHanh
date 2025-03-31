import express from 'express';
import {
  register,
  login,
  logout,
  registerGoogle,
  loginGoogle,
  sendCodeVerify,
  verifyGoogleAccount,
} from '../app/controllers/authentication';
import { deleteUser, profileUser, updateAvatar, updateUser } from '../app/controllers/users';
// import { isAuthenticated, isOwner } from '../app/middlewares';
import multer from 'multer';
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'src/uploads/profile');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });
export default (router: express.Router) => {
  router.post('/auth/user/register', register);
  router.post('/auth/user/registerGoogle', registerGoogle);

  router.post('/auth/user/login', login);
  router.post('/auth/user/google/login', loginGoogle);
  router.post('/auth/user/verifyGoogleAccount', verifyGoogleAccount);
  router.get('/auth/user/sendCodeVerify/:email', sendCodeVerify);

  //User after login
  router.get('/auth/user/logout', logout);
  router.get('/auth/user/:sessionToken', profileUser);
  router.patch('/auth/user/:id', updateUser);
  router.delete('/auth/user/:id', deleteUser);
  router.patch('/auth/uploadAvatar/:id', upload.single('file'), updateAvatar);
};
