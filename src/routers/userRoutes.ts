import { Router, Request, Response } from 'express';
import registerController from '../controllers/users/insertController';
import userModel from '../models/userModel';

const router = Router();

router.post('/register', registerController);

router.get('/', (req: Request, res: Response) => {
  res.json({ mensagem: 'Bem-vindo ao backend em node!' })
});

router.get('/users', async (req: Request, res: Response) => {
  try {
    const users = await userModel.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
});

router.get('/users/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // Pega o id da URL
    const user = await userModel.getUserById(id); // Chama a função getUserById passando o id
    res.json(user); // Retorna os dados do usuário
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuário' });
  }
});

router.put('/users/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // Pega o id da URL
    const userData = req.body; // Pega os dados a serem atualizados no corpo da requisição
    const updatedUser = await userModel.updateUser(id, userData); // Chama a função updateUser
    res.json(updatedUser); // Retorna o usuário atualizado
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar usuário' });
  }
});

router.delete('/users/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // Pega o id da URL
    const response = await userModel.deleteUser(id); // Chama a função deleteUser
    res.json(response); // Retorna a resposta da deleção
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar usuário' });
  }
});

export default router;
