import { Request, Response } from 'express';
import chatModel from '../../models/chatModel';
import { texts } from '../../config/textsLogs/index';

const getMessageController: any = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;

    if (!id)
      return res.status(400).json({ error: texts.chat.idNotFound });

    const messages: any = await chatModel.getAllMessageChats(id);

    if (!messages)
      return res.status(404).json({ error: texts.chat.chatNotFound });

    return res.status(200).json({ response: 'List chats', messages });
  } catch (error) {
    return res.status(500).json({ error: texts.chat.errorGetChats });
  }
};


export default getMessageController;
