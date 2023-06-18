const bcrypt = require('bcrypt');
const { authenticateToken } = require('../middleware/authenticateToken');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

import { Request, Response, Router } from 'express';
import { AuthenticatedRequest } from '../interfaces/auth';
import { pick } from '../utils/object';
import { issueTokenPair } from '../utils/auth';
import { User } from '../../../interfaces/auth';

const users: User[] = [
  {
    id: 'e7499b06-a473-45c5-8fc8-aabda6210960',
    username: 'username',
    password: '$2b$10$tU.BhhyH75SHhs8p2D1SqOUJE8dZJO3QG1WwytFLApGWCh3tIqNGS',
  },
];
const refreshTokens: string[] = [];

const router = Router();

router.post('/register', async (req: Request, res: Response) => {
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

router.post('/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const user = users.find((u) => u.username === username);

    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const tokens = issueTokenPair(user);

    refreshTokens.push(tokens.refreshToken);

    res.json(tokens);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

router.get(
  '/user',
  authenticateToken,
  (req: AuthenticatedRequest, res: Response) => {
    const { user } = req;

    res.json(user);
  }
);

router.post('/refresh-token', (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken || !refreshTokens.includes(refreshToken)) {
    return res.sendStatus(401);
  }

  try {
    const decodedUser = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = pick(decodedUser, ['id', 'username', 'password']);

    const { accessToken, refreshToken: newRefreshToken } = issueTokenPair(user);

    // Replace the old refresh token with the new one in your storage
    const oldTokenIndex = refreshTokens.indexOf(refreshToken);
    refreshTokens[oldTokenIndex] = newRefreshToken;

    res.json({ accessToken, refreshToken: newRefreshToken });
  } catch (error) {
    console.error(error);
    res.sendStatus(401);
  }
});

router.post('/logout', (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ error: 'You are not logged in.' });
  }

  refreshTokens.splice(refreshTokens.indexOf(refreshToken), 1);

  res.status(204).json({ success: true });
});

module.exports = router;
