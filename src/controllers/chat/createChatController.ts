import { Request, Response } from 'express';
import chatModel from '../../models/chatModel';
import { texts } from '../../config/textsLogs/index';
import UserModel from '../../models/userModel';

const createChatController: any = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { senderEmail, recipientsEmails, title, content } = req.body;

    if (!senderEmail || !recipientsEmails || !content || !title)
      return res.status(400).json({ response: texts.chat.invalidRequest });

    if (recipientsEmails.includes(senderEmail))
      return res.status(400).json({ error: texts.user.emailsDuplicated });

     const userSender = await UserModel.getUserByEmail(senderEmail);

     if (!userSender)
       return res
         .status(404)
         .json({ response: texts.user.userNotFound, email: senderEmail });

    const recipientIds = await Promise.all(
      recipientsEmails.map(async (email: string) => {
        const user = await UserModel.getUserByEmail(email);
        if (!user) return null;
        return user.id;
      })
    );

    if (recipientIds.includes(null)) {
      return res.status(404).json({ response: texts.user.emailNotFound });
    }

    const chatContent = {
      senderId: userSender.id,
      recipientIds,
      title,
      content,
    };

    const chatId = await chatModel.createChat(chatContent);
    if (!chatId) return res.status(400).json({ error: texts.user.userNotFound });

    return res.status(201).json({
      success: texts.chat.success,
      chatId,
      content: {
        senderEmail,
        recipientsEmails,
        title,
        content,
      },
    });
  } catch (err) {
    return res.status(500).json({ response: texts.chat.errorCreateMessage });
  }
};

export default createChatController;
