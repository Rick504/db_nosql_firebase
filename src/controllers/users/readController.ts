import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import userModel from '../../models/userModel';

const readController = async (req: Request, res: Response) => {
  try {
    const jwtSecret = process.env.JWT_SECRET as string;
    const token = req.headers['x-access-token'] as string;
    const decoded = jwt.verify(token, jwtSecret) as { userDataJWT: { email: string } };
    console.log('userDataJWT', decoded.userDataJWT)
    const { id } = decoded.userDataJWT;

    const user = await userModel.getUserById(id);

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    return res.status(200).json(user);
  } catch (err) {
    console.error('Erro ao processar o token ou buscar o usuário:', err);
    return res.status(500).json({ message: 'Erro ao tentar encontrar Usuário.' });
  }
};

export default readController;
