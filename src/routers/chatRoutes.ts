import { Router } from 'express';
import createChatController from '../controllers/chat/createChatController';
import createMessageController from '../controllers/chat/createMessageController';
import getMessageController from '../controllers/chat/getMessageController';

const router = Router();
router.post('/chat-create', createChatController);
router.post('/chat-message', createMessageController);
router.get('/chat-message', getMessageController);

export default router;
