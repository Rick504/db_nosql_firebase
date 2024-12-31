import { Request, Response } from 'express';
import { setToken } from '../../security/token';
import userModel from '../../models/userModel';
import { User, UserJwt } from '../../types/user';

const registerController: any  = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await userModel.getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json('Email já cadastrado!');
    }

    const user: User = {
      name,
      email,
      password,
      history: {
        updates: [],
        deletions: []
      }
    };
    const userDd = await userModel.createUser(user);


    const userDataJWT: UserJwt = {
      id: userDd.id,
      name: userDd.name,
      email: userDd.email,
    };

    await setToken(userDataJWT);

    res.status(201).json(userDataJWT);
  } catch (err) {
    console.log('Erro ao tentar cadastrar usuário.', err);
    res.status(400).json('Erro ao tentar cadastrar usuário.');
  }
};
export default registerController;
