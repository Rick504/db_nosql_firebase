import jwt from 'jsonwebtoken';

export async function setToken(userDataJWT: any) {
  const jwtSecret = process.env.JWT_SECRET as string;
  const jwtExpiresIn = process.env.JWT_EXPIRE_IN as string;
  try {
     if (!jwtSecret || !jwtExpiresIn) {
      throw new Error('Configuração do JWT está ausente. Verifique JWT_SECRET e JWT_EXPIRE_IN.');
    }
    const token = jwt.sign({ userDataJWT }, jwtSecret, {
      expiresIn: jwtExpiresIn,
    });
    return token;
  } catch (err) {
    return { msgError: 'Erro ao gerar token.' };
  }
}
