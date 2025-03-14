import express from 'express';
import { register, login, logout } from '../app/controllers/authentication';
import { deleteUser, profileUser, updateUser, uploadAvatar } from '../app/controllers/users';
import { isAuthenticated, isOwner } from '../app/middlewares';
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
  router.post('/auth/user/login', login);

  //User after login
  router.get('/auth/user/logout', logout);
  router.get('/auth/user/:sessionToken', profileUser);
  router.patch('/auth/user/:id', updateUser);
  router.delete('/auth/user/:id', deleteUser);
  router.post('/user/profile/:id', upload.single('file'), uploadAvatar);
};
