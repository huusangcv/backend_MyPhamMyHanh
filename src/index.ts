import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import { connect } from './config/index';
import router from './routes';
import path from 'path';
const port = process.env.PORT || 8080;

const app = express();
connect();

// Middleware
app.use(cors({ credentials: true }));
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json()); // Phân tích cú pháp JSON
app.use(bodyParser.urlencoded({ extended: true })); // Phân tích cú pháp urlencoded
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Router
app.use('/v1/', router());

const server = http.createServer(app);
server.listen(port, () => console.log(`Project app listening on port ${port}`));
