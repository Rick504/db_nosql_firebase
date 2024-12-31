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

// export const listUsersHistoryUpdateController = async (req: Request, res: Response) => {
//     const users_history_update = await getTableData('users_history_update');
//     res.json({ mensagem: 'List users history update', users_history_update });
// }

// export const listUsersHistoryDeleteController = async (req: Request, res: Response) => {
//     const users_history_delete = await getTableData('users_history_delete');
//     res.json({ mensagem: 'List users history delete', users_history_delete });
// }

