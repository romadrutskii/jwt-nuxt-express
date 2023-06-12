require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { authenticateToken } = require('./common');

const app = express();
app.use(express.json());
const corsOptions = {
  credentials: true,
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));

const posts = [
  {
    username: 'username',
    title: 'Post 1',
    text: 'Dear diary...',
  },
  {
    username: 'Jim',
    title: 'Post 2',
    text: 'My name is Jim',
  },
];

app.get('/posts', authenticateToken, (req, res) => {
  res.json(posts.filter((post) => post.username === req.user.username));
});

app.listen(3000, () => {
  console.log('Server started on http://localhost:3000');
});
