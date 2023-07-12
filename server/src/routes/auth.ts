const bcrypt = require('bcrypt');
const { authenticateToken } = require('../middleware/authenticateToken');
const jwt = require('jsonwebtoken');

import { Request, Response, Router } from 'express';
import { AuthenticatedRequest } from '../interfaces/auth';
import { pick } from '../utils/object';
import { issueTokenPair } from '../utils/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const router = Router();

router.post('/register', async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const user = await prisma.user.findFirst({
    where: {
      username: username,
    },
  });

  if (user) {
    return res.status(400).json({ message: 'Username already taken' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      username,
      password: hashedPassword,
    },
  });

  res.status(201).json({ success: true });
});

router.post('/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const user = await prisma.user.findFirst({
      where: {
        username: username,
      },
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const tokens = issueTokenPair(user);

    await prisma.refreshToken.create({
      data: {
        refresh_token: tokens.refreshToken,
      },
    });

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

router.post('/refresh-token', async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  const existingRefreshToken = await prisma.refreshToken.findFirst({
    where: {
      refresh_token: refreshToken,
    },
  });

  if (!refreshToken || !existingRefreshToken) {
    return res.sendStatus(401);
  }

  try {
    const decodedUser = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = pick(decodedUser, ['id', 'username', 'password']);

    const { accessToken, refreshToken: newRefreshToken } = issueTokenPair(user);

    await prisma.refreshToken.update({
      where: {
        refresh_token: existingRefreshToken.refresh_token,
      },
      data: {
        refresh_token: newRefreshToken,
      },
    });

    res.json({ accessToken, refreshToken: newRefreshToken });
  } catch (error) {
    console.error(error);
    res.sendStatus(401);
  }
});

router.post('/logout', async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ error: 'You are not logged in.' });
  }

  try {
    await prisma.refreshToken.delete({
      where: {
        refresh_token: refreshToken,
      },
    });
  } catch (err) {
    return res.status(401).json({ error: 'Wrong refresh token.' });
  }

  res.status(204).json({ success: true });
});

module.exports = router;
