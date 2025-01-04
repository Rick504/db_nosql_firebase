import { Request, Response } from 'express';
import { getIpAddress } from '../../utils/getIpAddress'
import userModel from '../../models/userModel';
import { UserBase, UserJwt, User } from '../../types/user';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { setToken } from '../../security/token';

const updateController: any = async (req: Request, res: Response) => {
  try {
    const token = req.headers['x-access-token'] as string;
    const jwtSecret = process.env.JWT_SECRET as string;
    const decoded = jwt.verify(token, jwtSecret) as { userDataJWT: UserJwt };
    const ipAddress = getIpAddress(req)

    const { id } = decoded.userDataJWT;
    const { name, email, password, currentPassword } = req.body;

    if (!id) return res.status(404).json({ msgError: 'Id Usuário não encontrado.'});

    const user: User = await userModel.getUserById(id);

    if (!user) return res.status(404).json({ msgError: 'Usuário não encontrado.'});
    if (!user.auth_status) return res.status(401).json({ error: 'Falha ao efetuar login. Conta não autorizada.' });

    if (currentPassword && !bcrypt.compareSync(currentPassword, user.password)) {
      return res.status(401).json({ msgError: 'Senha atual incorreta.' });
    }

    const updatedUser: UserBase = {
      name: name || user.name,
      email: email || user.email,
      password: password ? password.trim() : user.password,
    };

    const oldUser = {
      ipAddress,
      name: decoded.userDataJWT.name,
      email: decoded.userDataJWT.email,
      password: user.password
    }

    const updateResponse = await userModel.updateUser(id, updatedUser, oldUser);

    if (!updateResponse.success) return res.status(400).json({ msgError: updateResponse.message });

    const responseUser: Partial<UserBase> = { ...updatedUser };
    delete responseUser.password;

    const _userDataJWT = {
      id,
      name: updatedUser.name,
      email: updatedUser.email
    }

    await setToken(_userDataJWT);

    res.status(200).json({
      message: 'Usuário atualizado com sucesso.',
      data: responseUser,
      token
    });
  } catch (err) {
    console.error('Erro ao tentar atualizar conta:', err);
    res.status(500).json({ msgError: 'Erro interno ao tentar atualizar conta.' });
  }
};

export default updateController;
