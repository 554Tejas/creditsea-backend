import jwt from 'jsonwebtoken';
import { UserRole } from '../models/User';

interface TokenPayload {
  id: string;
  role: UserRole;
}

export const generateToken = (id: string, role: UserRole): string => {
  const secret = process.env.JWT_SECRET || 'super_secret_jwt_key_change_in_production';
  const expiresIn = process.env.JWT_EXPIRES_IN || '1d';

  return jwt.sign({ id, role }, secret, {
    expiresIn: expiresIn as jwt.SignOptions['expiresIn'],
  });
};

export const verifyToken = (token: string): TokenPayload => {
  const secret = process.env.JWT_SECRET || 'super_secret_jwt_key_change_in_production';
  return jwt.verify(token, secret) as TokenPayload;
};