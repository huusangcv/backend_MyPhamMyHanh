import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import { connect } from './config/index';
import router from './routes';
import path from 'path';
require('dotenv').config();
const port = process.env.PORT || 4000;
const app = express();
connect();
// Middleware
app.use(
  cors({
    origin: [
      'http://localhost:8080',
      'https://admin.regis.id.vn',
      'https://myphammyhanh.regis.id.vn',
      'https://accounts.regis.id.vn',
      'http://localhost:3000',
      'http://localhost:5173',
      'https://accounts.regis.id.vn',
    ],
    credentials: true,
  }),
);
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json()); // Phân tích cú pháp JSON
app.use(bodyParser.urlencoded({ extended: true })); // Phân tích cú pháp urlencoded
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Router
app.use('/v1/', router());

const server = http.createServer(app);
server.listen(port, () => console.log(`Project app listening on port ${port}`));
