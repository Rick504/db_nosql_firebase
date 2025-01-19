import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import userModel from '../../models/userModel';
import { UserJwt, User } from '../../types/user';
import { messages } from '../../config/messages/index';

const readController: any = async (req: Request, res: Response) => {
  try {
    const jwtSecret = process.env.JWT_SECRET as string;
    const token = req.headers['x-access-token'] as string;

    if (!jwtSecret)
    return res.status(500).json({ message: messages.jwt.notFoudJwt });

    let decoded;
    try {
      decoded = jwt.verify(token, jwtSecret) as { userDataJWT: UserJwt };
    } catch (err) {
      return res.status(401).json({ message: messages.jwt.tokenProcessingError });
    }
    const { id } = decoded.userDataJWT;

    if (!id)
    return res.status(404).json({ message: messages.user.userIdNotFound });

    const user: User = await userModel.getUserById(id);

    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ message: messages.user.ErrortryingToFindUser });
  }
};

export default readController;

