import { Request, Response } from 'express';
import { setToken } from '../../security/token';
import UserModel from '../../models/userModel';
import bcrypt from 'bcrypt';
import { messages } from '../../../config/messages/index';

const loginController: any = async (req: Request, res: Response) => {
  try {
    let { email, password } = req.body;
    const userDb: any = await UserModel.getUserByEmail(email);

    if (!userDb || !bcrypt.compareSync(password, userDb.password))
    return res.status(401).json({ error: messages.login.invalidCredentials });;

    if (!userDb.auth_status)
    return res.status(401).json({ error: messages.account.unauthorizedAccount });

    const userValidaty: any = await UserModel.authUserLogin({
      email: email,
      password: userDb.password,
    } as any);

    if (!userValidaty)
    return res.status(401).json({ error: messages.login.invalidUserValidity });

    const token = await setToken({
      id: userValidaty.id,
      name: userValidaty.name,
      email,
    });

    res.status(200).json({ email, auth: true, token });
  } catch (err) {
    res.status(403).json({ error: messages.login.loginError });
  }
};

export default loginController;
