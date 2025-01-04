import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JwtPayloadCustom } from '../types/jwt';
import { User } from '../types/user';
import UserModel from '../models/userModel';
import { messages } from '../../config/messages/index';

export async function verifyToken(req: Request, res: Response, next: NextFunction): Promise<any> {
  const jwtSecret = process.env.JWT_SECRET as string;
  const token = req.headers['x-access-token'] as string;

  if (!token)
  return res.status(401).json({ message: messages.jwt.tokenMissing });

  try {
    const decoded = jwt.verify(token, jwtSecret) as JwtPayloadCustom;
    const userId = decoded.userDataJWT.id;
    const user: User = await UserModel.getUserById(userId);

    if (!user)
    return res.status(404).json({ message: messages.user.userNotFound });

    if (!user.auth_status)
    return res.status(403).json(
      {
        auth: false,
        message: messages.account.unauthorizedAccess
      }
    );

    req.body.user = user;

    next();
  } catch (err) {
    return res.status(401).json({ message: messages.jwt.invalidToken });
  }
}
