import { Request, Response } from 'express';
import chatModel from '../../models/chatModel';
import { texts } from '../../config/textsLogs/index';
import { CreateMessage } from '../../types/chat';

const createMessageController: any = async (req: Request, res: Response) => {
  try {
    let messageData: CreateMessage = req.body;
    const messages = await chatModel.createMessageChats(messageData);
    if (!messages)
      return res.status(400).json({ response: texts.chat.errorCreateMessage });

    return res.json({ response: 'List messages', messages });
  } catch (error) {
    res.status(500).json({ error: texts.chat.errorGetChats });
  }
};

export default createMessageController;
