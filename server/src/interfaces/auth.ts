import { Request as ExpressRequest } from 'express';

interface User {
  id: string;
  username: string;
  password: string;
}

export interface AuthenticatedRequest extends ExpressRequest {
  user?: User;
}
