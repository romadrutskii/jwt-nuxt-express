import { Prisma } from '@prisma/client';

const jwt = require('jsonwebtoken');

function generateAccessToken(user: Prisma.UserCreateInput) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '15m',
  });
}

function generateRefreshToken(user: Prisma.UserCreateInput) {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: '7d',
  });
}

export function issueTokenPair(user: Prisma.UserCreateInput): {
  accessToken: string;
  refreshToken: string;
} {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  return { accessToken, refreshToken };
}
