import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import userModel from '../../models/userModel';
import { getIpAddress } from '../../utils/getIpAddress'
import { UserWithId } from '../../types/user'
import { messages } from '../../../config/messages/index';

const deleteController: any = async (req: Request, res: Response) => {
  try {
    const token = req.headers['x-access-token'] as string;
    const jwtSecret = process.env.JWT_SECRET as string;

    if (!token)
      return res.status(401).json({ message: messages.jwt.tokenMissing });

    if (!jwtSecret)
      return res.status(500).json({ message: messages.jwt.notFoudJwt });

    let decoded;
    try {
      decoded = jwt.verify(token, jwtSecret) as { userDataJWT: UserWithId };
    } catch (err) {
      return res.status(401).json({ message: messages.jwt.invalidOrExpiredToken });
    }

    const { id } = decoded.userDataJWT;

    if (!id)
      return res.status(400).json({ message: messages.user.userIdNotFound });

    const ipAddress = getIpAddress(req);
    const success = await userModel.markUserAsDeleted(id, ipAddress);

    if (!success)
      return res.status(404).json({ message: messages.user.userNotFound });

    return res.status(200).json({ message: messages.delete.success });
  } catch (err) {
    return res.status(500).json({ message: messages.delete.internalError });
  }
};

export default deleteController;
