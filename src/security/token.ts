import jwt from 'jsonwebtoken';
import { messagesJwt } from '../../config/messages/jwtMessages';

export async function setToken(userDataJWT: any) {
  const jwtSecret = process.env.JWT_SECRET as string;
  const jwtExpiresIn = process.env.JWT_EXPIRE_IN as string;
  try {
     if (!jwtSecret || !jwtExpiresIn) {
      throw new Error( messagesJwt. jwTConfigurationMissing );
    }
    const token = jwt.sign({ userDataJWT }, jwtSecret, {
      expiresIn: jwtExpiresIn,
    });
    return token;
  } catch (err) {
    return { msgError: messagesJwt.erroGeneretedToekn };
  }
}
