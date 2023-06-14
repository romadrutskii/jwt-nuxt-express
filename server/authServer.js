const express = require('express');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');
const { authenticateToken } = require('./common');

// Load environment variables from .env file
dotenv.config();

const app = express();
app.use(express.json());

const corsOptions = {
  credentials: true,
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

const users = [
  {
    id: 'e7499b06-a473-45c5-8fc8-aabda6210960',
    username: 'username',
    password: '$2b$10$tU.BhhyH75SHhs8p2D1SqOUJE8dZJO3QG1WwytFLApGWCh3tIqNGS',
  },
];
const refreshTokens = [];

async function authenticateUser(username, password) {
  const user = users.find((u) => u.username === username);

  if (!user) {
    return null;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  return isPasswordValid ? user : null;
}

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '15s',
  });
}

function generateRefreshToken(user) {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
}

app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (users.some((user) => user.username === username)) {
    return res.status(400).json({ message: 'Username already taken' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const id = uuidv4();

  users.push({
    id,
    username,
    password: hashedPassword,
  });

  res.status(201).json({ success: true });
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await authenticateUser(username, password);

    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    refreshTokens.push(refreshToken);

    res.json({ accessToken, refreshToken });
  } catch (error) {
    res.sendStatus(500);
  }
});

app.get('/user', authenticateToken, (req, res) => {
  const { user } = req;

  res.json(user);
});

app.post('/refresh-token', (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken || !refreshTokens.includes(refreshToken)) {
    return res.sendStatus(401);
  }

  try {
    const decodedUser = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    delete decodedUser.iat;

    const accessToken = generateAccessToken(decodedUser);

    res.json({ accessToken });
  } catch (error) {
    console.error(error);
    res.sendStatus(401);
  }
});

app.post('/logout', (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ error: 'You are not logged in.' });
  }

  refreshTokens.splice(refreshTokens.indexOf(refreshToken), 1);

  res.status(204).json({ success: true });
});

app.listen(3001, () => {
  console.log('Server started on http://localhost:3001');
});
