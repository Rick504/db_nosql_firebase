import { config } from '../config';
import { Router } from 'express';
import registerController from '../controllers/users/insertController';
import readController from '../controllers/users/readController';
import loginController from '../controllers/users/loginController';
import updateController from '../controllers/users/updateController';
import deleteController from '../controllers/users/deleteController';
import { verifyToken } from '../middlewares/verifyToken';
import {
    homeController,
    listUsersController,
  } from '../controllers/tests/index';

const router = Router();

router.get('/', homeController);
router.get('/user', verifyToken, readController);
router.post('/register', registerController);
router.post('/login', loginController);
router.put('/update/user/', verifyToken, updateController);
router.delete('/delete/user/', verifyToken, deleteController);

if (config.testMode) router.get('/users', listUsersController);

export default router;
