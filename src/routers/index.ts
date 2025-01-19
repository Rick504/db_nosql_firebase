import { Router } from 'express';
import userRoutes from './userRoutes';
import chatRoutes from './chatRoutes';

const router = Router();
router.use('/', userRoutes);
router.use('/', chatRoutes);

export default router;
