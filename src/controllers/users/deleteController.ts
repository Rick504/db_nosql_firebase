import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import userModel from '../../models/userModel';
import { getIpAddress } from '../../utils/getIpAddress'
import { messages } from '../../../config/messages/deleteControllerMessages';
import { UserWithId } from '../../types/user'

const deleteController: any = async (req: Request, res: Response) => {
  try {
    const token = req.headers['x-access-token'] as string;
    const jwtSecret = process.env.JWT_SECRET as string;

    if (!token)
    return res.status(401).json({ message: messages.tokenNotProvided });

    if (!jwtSecret)
    return res.status(500).json({ message: messages.jwtSecretMissing });

    let decoded;
    try {
      decoded = jwt.verify(token, jwtSecret) as { userDataJWT: UserWithId };
    } catch (err) {
      return res.status(401).json({ message: messages.invalidOrExpiredToken });
    }

    const { id } = decoded.userDataJWT;

    if (!id)
    return res.status(400).json({ message: messages.userIdNotFound });

    const ipAddress = getIpAddress(req);
    const success = await userModel.markUserAsDeleted(id, ipAddress);

    if (!success)
    return res.status(404).json({ message: messages.userNotFound });

    return res.status(200).json({ message: messages.success });
  } catch (err) {
    return res.status(500).json({ message: messages.internalError });
  }
};

export default deleteController;
