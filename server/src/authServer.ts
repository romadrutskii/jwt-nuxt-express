require('dotenv').config();

const express = require('express');
const authRouter = require('./routes/auth');

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

app.use('/auth', authRouter);

const host = process.env.SERVER_HOST || 'localhost';
const port = process.env.AUTH_SERVER_PORT || 3001;

app.listen(port, () => {
  console.log(`Server started on http://${host}:${port}`);
});

// Workaround for typescript
export {};
