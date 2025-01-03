import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import userModel from '../../models/userModel';
import { UserJwt, User } from '../../types/user';

const readController: any = async (req: Request, res: Response) => {
  try {
    const jwtSecret = process.env.JWT_SECRET as string;
    const token = req.headers['x-access-token'] as string;
    const decoded = jwt.verify(token, jwtSecret) as { userDataJWT: UserJwt };
    const { id } = decoded.userDataJWT;

    if (!id) return res.status(404).json({ message: 'Erro ao pegar Id do Token' });
    const user: User  = await userModel.getUserById(id);

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    if (!user.auth_status) return res.status(401).json({ error: 'Falha. Conta não autorizada.' });

    return res.status(200).json(user);
  } catch (err) {
    console.error('Erro ao processar o token ou buscar o usuário:', err);
    return res.status(500).json({ message: 'Erro ao tentar encontrar Usuário.' });
  }
};

export default readController;

