require('dotenv').config();

const express = require('express');
const cors = require('cors');
const postsRouter = require('./routes/posts');
const port = process.env.POSTS_SERVER_PORT;

const app = express();
app.use(express.json());

const corsOptions = {
  credentials: true,
  origin: `http://localhost:${process.env.CLIENT_PORT}`,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use('/posts', postsRouter);

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
