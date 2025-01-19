import { Request, Response } from 'express';
import userModel from '../../models/userModel';
import { texts } from '../../config/textsLogs/index';

export const homeController = async (req: Request, res: Response) => {
  res.json({ mensagem: texts.initSystem })
}

export const listUsersController = async (req: Request, res: Response) => {
     try {
        const users = await userModel.getAllUsers();
        res.json({ mensagem: 'List users', users });
    } catch (error) {
        res.status(500).json({ error: texts.user.ErrortryingToFindUser });
    }
}

