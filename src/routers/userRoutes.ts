import { config } from '../../config';
import { Router } from 'express';
import registerController from '../controllers/users/insertController';
import readController from '../controllers/users/readController';
import loginController from '../controllers/users/loginController';
import { verifyToken } from '../middlewares/verifyToken';
import {
    homeController,
    listUsersController,
    // listUsersHistoryUpdateController,
    // listUsersHistoryDeleteController
  } from '../controllers/tests/index';

const router = Router();

router.get('/', homeController);
router.get('/user', verifyToken, readController);
router.post('/register', registerController);
router.post('/login', loginController);
// router.put('/update/user/', verifyToken, updateController);
// router.delete('/delete/user/', verifyToken, deleteController);

if (config.testMode) router.get('/users', listUsersController);
// if (config.testMode) userRouter.get('/users/update/history', listUsersHistoryUpdateController);
// if (config.testMode) userRouter.get('/users/delete/history', listUsersHistoryDeleteController);

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
