import { Request, Response } from 'express';
import userModel from '../../models/userModel';

export const homeController = async (req: Request, res: Response) => {
  res.json({ mensagem: 'Bem-vindo ao backend em node!' })
}

export const listUsersController = async (req: Request, res: Response) => {
     try {
        const users = await userModel.getAllUsers();
        res.json({ mensagem: 'List users', users });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar usuários' });
    }
}

