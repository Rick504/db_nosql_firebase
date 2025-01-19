import { usersCollection, chatsCollection } from '../firebaseAdmin';
import { CreateChat, CreateMessage } from '../types/chat';
import userModel from './userModel';
const { Timestamp } = require('firebase-admin').firestore;

const chatModel = {
  async getAllChats() {
    try {
      const snapshot = await chatsCollection.get();
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      throw new Error('Erro ao pegar collection chats');
    }
  },

  async getAllMessageChats(id: string) {
    try {
      const chatDocRef = chatsCollection.doc(id);
      const chatDoc = await chatDocRef.get();
      if (!chatDoc.exists) return false;
      const messagesSnapshot = await chatDocRef.collection('messages').get();
      const messages = messagesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return messages;
    } catch (error) {
      throw new Error('Erro ao pegar mensagens do chat');
    }
  },

  async createChat(chatContent: any) {
    const { senderId, recipientIds, title, content }: CreateChat = chatContent;

    if (!recipientIds.length)
      return false

    try {
      const participants = [senderId, ...recipientIds].sort();
      const existingChatSnapshot = await usersCollection
        .where('participants', '==', participants)
        .get();

      let chatId: string;

      if (!existingChatSnapshot.empty) {
        chatId = existingChatSnapshot.docs[0].id;
      } else {
        const newChatRef = chatsCollection.doc();
        chatId = newChatRef.id;

        await newChatRef.set({
          participants,
          lastMessage: null,
          updatedAt: Timestamp.now(),
        });
      }

      const setMessage = {
        chatId,
        senderId,
        content,
      };

      await this.createMessageChats(setMessage);

      await chatsCollection.doc(chatId).update({
        lastMessage: {
          title,
          content,
          timestamp: Timestamp.now(),
          senderId,
        },
        updatedAt: Timestamp.now(),
      });

      await this.addUChatsUser(senderId, chatId);
      await Promise.all(
        recipientIds.map((recipientId: string) => this.addUChatsUser(recipientId, chatId))
      );

      return chatId;
    } catch (error) {
      console.error('Erro ao criar chat:', error);
      throw new Error('Erro ao criar mensagem.');
    }
  },

  async createMessageChats(messageData: CreateMessage) {
    try {
      let { chatId, senderId, content } = messageData;
      if (!chatId) return false;

      let sender = await userModel.getUserById(senderId);

      const messagesCollection = chatsCollection
        .doc(chatId)
        .collection('messages');

      const messageRef = messagesCollection.doc();

      await messageRef.set({
        senderId: senderId,
        senderName: sender.name,
        senderEmail: sender.email,
        content,
        timestamp: Timestamp.now(),
        read: false,
        type: 'text',
      });

      return messageRef;
    } catch (error) {
      throw new Error('Erro ao pegar mensagens do chat');
    }
  },

  async addUChatsUser(userId: string, chatId: string) {
    try {
      const userRef = usersCollection.doc(userId);
      const userDoc = await userRef.get();

      if (userDoc.exists) {
        const userData = userDoc.data();
        const chatIds = userData?.chatIds || [];

        if (!chatIds.includes(chatId)) {
          await userRef.update({
            chatIds: [...chatIds, chatId],
          });
        }
      } else {
        console.error(`Usuário com ID ${userId} não encontrado.`);
      }
    } catch (error) {
      throw new Error(`Erro ao atualizar chats para o usuário ${userId}:`);
    }
  },
};

export default chatModel;
