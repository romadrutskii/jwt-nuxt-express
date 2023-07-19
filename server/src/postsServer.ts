require('dotenv').config();

const express = require('express');
const postsRouter = require('./routes/posts');

import cors from 'cors';
import { allowedOrigins } from './utils/cors';

const app = express();
app.use(express.json());

const corsOptions: cors.CorsOptions = {
  credentials: true,
  origin: allowedOrigins,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use('/posts', postsRouter);

const host = process.env.SERVER_HOST || 'localhost';
const port = process.env.POSTS_SERVER_PORT || 3000;

app.listen(port, () => {
  console.log(`Server started on http://${host}:${port}`);
});
