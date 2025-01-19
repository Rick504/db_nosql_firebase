import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import userModel from '../../models/userModel';
import { UserJwt, UserBase } from '../../types/user';
import { texts } from '../../config/textsLogs/index';

const readController: any = async (req: Request, res: Response) => {
  try {
    const jwtSecret = process.env.JWT_SECRET as string;
    const token = req.headers['x-access-token'] as string;

    if (!jwtSecret)
    return res.status(500).json({ response: texts.jwt.notFoudJwt });

    let decoded;
    try {
      decoded = jwt.verify(token, jwtSecret) as { userDataJWT: UserJwt };
    } catch (err) {
      return res.status(401).json({ response: texts.jwt.tokenProcessingError });
    }
    const { id } = decoded.userDataJWT;

    if (!id)
    return res.status(404).json({ response: texts.user.userIdNotFound });

    const user: Partial<UserBase> = await userModel.getUserById(id);
    delete user.password;

    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ response: texts.user.ErrortryingToFindUser });
  }
};

export default readController;

