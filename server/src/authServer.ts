const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const authRouter = require('./routes/auth');

// Load environment variables from .env file
dotenv.config();

const app = express();
app.use(express.json());

const corsOptions = {
  credentials: true,
  origin: `http://localhost:${process.env.CLIENT_PORT}`,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use('/', authRouter);

app.listen(3001, () => {
  console.log('Server started on http://localhost:3001');
});

// Workaround for typescript
export {};
