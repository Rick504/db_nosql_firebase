import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JwtPayloadCustom } from '../types/jwt';
import { User } from '../types/user';
import UserModel from '../models/userModel';
import { texts } from '../config/textsLogs/index';

export async function verifyToken(req: Request, res: Response, next: NextFunction): Promise<any> {
  const jwtSecret = process.env.JWT_SECRET as string;
  const token = req.headers['x-access-token'] as string;

  if (!token)
  return res.status(401).json({ response: texts.jwt.tokenMissing });

  try {
    const decoded = jwt.verify(token, jwtSecret) as JwtPayloadCustom;
    const userId = decoded.userDataJWT.id;
    const user: User = await UserModel.getUserById(userId);

    if (!user)
    return res.status(404).json({ response: texts.user.userNotFound });

    if (!user.authorization)
    return res.status(403).json(
      {
        auth: false,
        response: texts.account.unauthorizedAccess
      }
    );

    req.body.user = user;

    next();
  } catch (err) {
    return res.status(401).json({ response: texts.jwt.invalidToken });
  }
}
