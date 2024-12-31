

import { firestore } from 'firebase-admin';
import { User, UserWithId } from '../types/user';

const db = firestore();
const userCollection = db.collection('users');

const UserModel = {
  async getAllUsers(): Promise<UserWithId[]> {
    const snapshot = await userCollection.get();
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as UserWithId[];
  },

  async createUser(data: User): Promise<UserWithId> {
    const docRef = await userCollection.add(data);
    return { id: docRef.id, ...data };
  },

  async getUserById(userId: string): Promise<UserWithId> {
    const doc = await userCollection.doc(userId).get();
    if (!doc.exists) throw new Error('Usuário não encontrado');
    return { id: doc.id, ...doc.data() } as UserWithId;
  },

  async updateUser(userId: string, data: Partial<User>) {
    await userCollection.doc(userId).update(data);
    return { id: userId, ...data };
  },

  async deleteUser(userId: string): Promise<{ message: string }> {
    await userCollection.doc(userId).delete();
    return { message: 'Usuário deletado com sucesso' };
  },
};

export default UserModel;
