import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import { connect } from './config/index';
import router from './router';
import path from 'path';

const app = express();
connect();

app.use(
  cors({
    credentials: true,
  }),
);

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
const server = http.createServer(app);

server.listen(8080, () => console.log('Server running on http://localhost:8080/'));

app.use('/', router());
