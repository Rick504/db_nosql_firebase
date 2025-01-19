import { Request, Response } from 'express';
import { setToken } from '../../security/token';
import userModel from '../../models/userModel';
import { User, UserJwt } from '../../types/user';
import { messages } from '../../config/messages/index';

const registerController: any  = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await userModel.getUserByEmail(email);

    if (existingUser)
    return res.status(409).json({ message: messages.user.existingUser });

    const user: User = {
      name,
      email,
      password,
      history: {
        updates: [],
        deletions: {
          deleted: false,
          date: null,
        }
      },
      authorization: false
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
    res.status(400).json({ message: messages.update.internalError });
  }
};
export default registerController;
