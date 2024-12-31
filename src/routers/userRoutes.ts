import { config } from '../../config';
import { Router } from 'express';
import registerController from '../controllers/users/insertController';
import readController from '../controllers/users/readController';
import loginController from '../controllers/users/loginController';
import {
    homeController,
    listUsersController,
    // listUsersHistoryUpdateController,
    // listUsersHistoryDeleteController
  } from '../controllers/tests/index';

const router = Router();

router.get('/', homeController);
router.get('/user', readController);
router.post('/register', registerController);
router.post('/login', loginController);

if (config.testMode) router.get('/users', listUsersController);

// router.put('/users/:id', async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params; // Pega o id da URL
//     const userData = req.body; // Pega os dados a serem atualizados no corpo da requisição
//     const updatedUser = await userModel.updateUser(id, userData); // Chama a função updateUser
//     res.json(updatedUser); // Retorna o usuário atualizado
//   } catch (error) {
//     res.status(500).json({ error: 'Erro ao atualizar usuário' });
//   }
// });

// router.delete('/users/:id', async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params; // Pega o id da URL
//     const response = await userModel.deleteUser(id); // Chama a função deleteUser
//     res.json(response); // Retorna a resposta da deleção
//   } catch (error) {
//     res.status(500).json({ error: 'Erro ao deletar usuário' });
//   }
// });

export default router;
