const jwt = require('jsonwebtoken');

import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../interfaces/auth';

interface User {
  id: string;
  username: string;
  password: string;
}

function authenticateToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) {
    return res
      .status(401)
      .json({ error: 'You are not authorized. Please, log in.' });
  }

  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    (err: Error, user: User) => {
      if (err) {
        return res
          .status(403)
          .json({ error: 'You are not authorized. Please, log in.' });
      }
      req.user = user;
      next();
    }
  );
}

module.exports = {
  authenticateToken,
};
