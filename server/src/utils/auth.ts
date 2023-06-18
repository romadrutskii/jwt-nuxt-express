import { User } from '../../../interfaces/auth';
const jwt = require('jsonwebtoken');

function generateAccessToken(user: User) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '15m',
  });
}

function generateRefreshToken(user: User) {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: '7d',
  });
}

export function issueTokenPair(user: User): {
  accessToken: string;
  refreshToken: string;
} {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  return { accessToken, refreshToken };
}
