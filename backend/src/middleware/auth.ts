import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { DatabaseService } from '../services/database.service';

export interface AuthRequest extends Request {
  user?: { id: string; businessId: string; role: string; email: string; name: string };
}

const JWT_SECRET = process.env.JWT_SECRET || 'adminx-dev-jwt-secret';

export function authenticate(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, error: 'Authentication required', timestamp: Date.now() });
    return;
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = { id: decoded.id, businessId: decoded.businessId, role: decoded.role, email: decoded.email, name: decoded.name };
    next();
  } catch {
    res.status(401).json({ success: false, error: 'Invalid or expired token', timestamp: Date.now() });
  }
}

export function authorize(...roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Not authenticated', timestamp: Date.now() });
      return;
    }
    if (roles.length > 0 && !roles.includes(req.user.role)) {
      res.status(403).json({ success: false, error: 'Insufficient permissions', timestamp: Date.now() });
      return;
    }
    next();
  };
}

export function generateToken(user: { id: string; businessId: string; role: string; email: string; name: string }): string {
  return jwt.sign(user, JWT_SECRET, { expiresIn: process.env.JWT_EXPIRY || '7d' });
}
