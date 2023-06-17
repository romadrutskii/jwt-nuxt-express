import { Request as ExpressRequest } from 'express';
import { User } from '../../../interfaces/auth';

export interface AuthenticatedRequest extends ExpressRequest {
  user?: User;
}
