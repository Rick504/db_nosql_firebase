import { Request, Response } from 'express';
import { getIpAddress } from '../../utils/getIpAddress'
import userModel from '../../models/userModel';
import { UserBase, UserJwt, User } from '../../types/user';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { setToken } from '../../security/token';
import { messages } from '../../../config/messages/index';

const updateController: any = async (req: Request, res: Response) => {
  try {
    const token = req.headers['x-access-token'] as string;
    const jwtSecret = process.env.JWT_SECRET as string;

    if (!jwtSecret)
    return res.status(500).json({ msgError: messages.jwt.notFoudJwt });

    const decoded = jwt.verify(token, jwtSecret) as { userDataJWT: UserJwt };
    const ipAddress = getIpAddress(req)

    const { id } = decoded.userDataJWT;
    const { name, email, password, currentPassword } = req.body;

     if (!id)
    return res.status(404).json({ msgError: messages.user.userIdNotFound });

    const user: User = await userModel.getUserById(id);

    if (email === user.email)
    return res.status(404).json({ msgError: messages.update.emailAlreadyUpdated });

    if (currentPassword && !bcrypt.compareSync(currentPassword, user.password)) {
      return res.status(401).json({ msgError: messages.update.currentPasswordIncorrect });
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
      message: messages.update.updateSuccess,
      data: responseUser,
      token
    });
  } catch (err) {
    res.status(500).json({ msgError: messages.update.internalError });
  }
};

export default updateController;
