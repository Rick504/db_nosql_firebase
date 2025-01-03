import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import userModel from '../../models/userModel';
import { getIpAddress } from '../../utils/getIpAddress'

const deleteController = async (req: Request, res: Response) => {
  try {
    const token = req.headers['x-access-token'] as string;
    const jwtSecret = process.env.JWT_SECRET as string;

    if (!token) {
      return res.status(401).json({ message: 'Token não fornecido.' });
    }

    if (!jwtSecret) {
      return res.status(500).json({ message: 'JWT_SECRET não configurado no servidor.' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, jwtSecret) as { userDataJWT: { id: string } };
    } catch (err) {
      return res.status(401).json({ message: 'Token inválido ou expirado.' });
    }

    const { id } = decoded.userDataJWT;

    if (!id) {
      return res.status(400).json({ message: 'ID do usuário não encontrado no token.' });
    }

    const ipAddress = getIpAddress(req);
    const success = await userModel.markUserAsDeleted(id, ipAddress);

    if (!success) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    return res.status(200).json({ message: 'Usuário marcado como deletado com sucesso.' });
  } catch (err) {
    console.error('Erro no deleteController:', err);
    return res.status(500).json({ message: 'Erro interno ao tentar deletar conta.' });
  }
};

export default deleteController;
