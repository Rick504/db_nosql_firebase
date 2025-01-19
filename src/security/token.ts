import jwt from 'jsonwebtoken';
import { texts } from '../config/textsLogs/index';

export async function setToken(userDataJWT: any) {
  const jwtSecret = process.env.JWT_SECRET as string;
  const jwtExpiresIn = process.env.JWT_EXPIRE_IN as string;
  try {

    if (!jwtSecret || !jwtExpiresIn)
    throw new Error(texts.jwt.jwTConfigurationMissing);

    const token = jwt.sign({ userDataJWT }, jwtSecret, {
      expiresIn: jwtExpiresIn,
    });
    return token;
  } catch (err) {
    return { response: texts.jwt.errorGeneretedToken };
  }
}
