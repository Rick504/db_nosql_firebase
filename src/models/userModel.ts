

import { firestore } from 'firebase-admin';
import { User, UserWithId } from '../types/user';
import bcrypt from 'bcrypt';

const db = firestore();
const userCollection = db.collection('users');

function hashPassword(password: string) {
  const saltRounds = 10
  return bcrypt.hash(password, saltRounds)
}

const UserModel = {
  async getAllUsers(): Promise<UserWithId[]> {
    const snapshot = await userCollection.get();
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as UserWithId[];
  },

  async getUserByEmail(email: string) {
    const querySnapshot = await userCollection.where('email', '==', email).get();
    if (querySnapshot.empty) {
      return false;
    }
    const user = querySnapshot.docs[0].data();
    return { id: querySnapshot.docs[0].id, ...user };
  },

  async createUser(user: User): Promise<UserWithId> {
    const auth_status = true;
    const { name, email, password, history } = user;

    const _hashPassword = await hashPassword(password);

    const data = {
      name,
      email,
      password: _hashPassword,
      auth_status,
      history
    };

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
