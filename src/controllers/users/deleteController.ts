import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import userModel from '../../models/userModel';
import { getIpAddress } from '../../utils/getIpAddress'
import { UserWithId } from '../../types/user'
import { texts } from '../../config/textsLogs/index';

const deleteController: any = async (req: Request, res: Response) => {
  try {
    const token = req.headers['x-access-token'] as string;
    const jwtSecret = process.env.JWT_SECRET as string;

    if (!token)
      return res.status(401).json({ response: texts.jwt.tokenMissing });

    if (!jwtSecret)
      return res.status(500).json({ response: texts.jwt.notFoudJwt });

    let decoded;
    try {
      decoded = jwt.verify(token, jwtSecret) as { userDataJWT: UserWithId };
    } catch (err) {
      return res.status(401).json({ response: texts.jwt.invalidOrExpiredToken });
    }

    const { id } = decoded.userDataJWT;

    if (!id)
      return res.status(400).json({ response: texts.user.userIdNotFound });

    const ipAddress = getIpAddress(req);
    const success = await userModel.markUserAsDeleted(id, ipAddress);

    if (!success)
      return res.status(404).json({ response: texts.user.userNotFound });

    return res.status(200).json({ response: texts.delete.success });
  } catch (err) {
    return res.status(500).json({ response: texts.delete.internalError });
  }
};

export default deleteController;
