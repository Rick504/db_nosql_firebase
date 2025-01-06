const { Timestamp } = require('firebase-admin').firestore;
import { firestore, usersCollection , usershistoryDeleteCollection} from '../firebaseAdmin';
import { User, UserWithId, UpdateUserRequest, UserOldUpdate } from '../types/user';
import bcrypt from 'bcrypt';

function hashPassword(password: string) {
  const saltRounds = 10
  return bcrypt.hash(password, saltRounds)
}

const UserModel = {
  async getAllUsers(): Promise<UserWithId[]> {
    const snapshot = await usersCollection.get();
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as UserWithId[];
  },

  async getUserByEmail(email: string) {
    const querySnapshot = await usersCollection.where('email', '==', email).get();
    if (querySnapshot.empty) {
      return false;
    }
    const user = querySnapshot.docs[0].data();
    return { id: querySnapshot.docs[0].id, ...user };
  },

  async authUserLogin(user: User) {
    const { email, password } = user;

    try {
      const querySnapshot = await usersCollection
        .where('email', '==', email)
        .where('password', '==', password)
        .get();

      if (querySnapshot.empty) {
        return null;
      }

      const doc = querySnapshot.docs[0];
      const userData = doc.data();

      return { id: doc.id, ...userData };
    } catch (err) {
      throw new Error(`Erro ao autenticar usuário: ${err}`);
    }
  },

  async createUser(user: User): Promise<UserWithId> {
    const authorization = true;
    const { name, email, password, history } = user;

    const _hashPassword = await hashPassword(password);

    const data = {
      name,
      email,
      password: _hashPassword,
      authorization,
      history
    };

    const docRef = await usersCollection.add(data);

    return { id: docRef.id, ...data };
  },

  async getUserById(userId: string): Promise<UserWithId> {
    const doc = await usersCollection.doc(userId).get();
    if (!doc.exists) throw new Error('Usuário não encontrado');
    return { id: doc.id, ...doc.data() } as UserWithId;
  },

  async updateUser(
    userId: string,
    user: Partial<UpdateUserRequest>,
    oldUser: UserOldUpdate
  ) {
    try {
      if (!user) {
        return {
          success: false,
          message: 'Usuário não foi passado como parâmetro.',
        };
      }

      const userExistsResult: User = await this.getUserById(userId);
      if (!userExistsResult) {
        return {
          success: false,
          message: 'Usuário não encontrado.',
        };
      }

      if (user.email) {
        const emailExistsResult = await this.getUserByEmail(user.email);
        if (emailExistsResult && emailExistsResult.id !== userId) {
          return {
            success: false,
            message: 'O e-mail fornecido já está em uso por outro usuário.',
          };
        }
      }

      const hashedPassword = user.password ? await hashPassword(user.password) : null;

      const updates: Partial<UpdateUserRequest> = {
        ...user,
        password: hashedPassword || undefined,
      };

      Object.keys(updates).forEach((key) => {
        if (updates[key as keyof UpdateUserRequest] == null) {
          delete updates[key as keyof UpdateUserRequest];
        }
      });

      const historyUpdate = {
        updatedAt: new Date().toISOString(),
        updatedBy: oldUser.ipAddress,
        oldData: {
          name: oldUser.name,
          email: oldUser.email,
          password: oldUser.password,
        },
        changes: updates,
      };

      const existingHistory = {
        updates: userExistsResult.history?.updates || [],
        deletions: userExistsResult.history?.deletions || [],
      };

     const updatedHistory = {
        updates: [...existingHistory.updates, historyUpdate],
        deletions: existingHistory.deletions,
      };

      await usersCollection.doc(userId).update({
        ...updates,
        history: updatedHistory,
      });

      return {
        success: true,
        data: {
          id: userId,
          ...updates,
          history: updatedHistory,
        },
        message: 'Usuário atualizado com sucesso.',
      };
    } catch (err) {
      return {
        success: false,
        message: 'Erro ao atualizar o usuário.',
      };
    }
  },

  async markUserAsDeleted(
      userId: string,
      ipAddress: string
    ): Promise<{ updated: boolean }> {
      try {
        const userRef = usersCollection.doc(userId);
        const userDoc = await userRef.get();
        const now = new Date();
        const seconds = Math.floor(now.getTime() / 1000);
        const nanoseconds = (now.getTime() % 1000) * 1000000;

        const firebaseTimestamp = {
          seconds: seconds,
          nanoseconds: nanoseconds
        };

        if (!userDoc.exists) {
          return { updated: false };
        }

        const updateFieldsUser = {
          authorization: false,
          "history.deletions": {
            deleted: true,
            date: firebaseTimestamp,
            ipAddress,
          },
        }

        await userRef.update(updateFieldsUser);
        return { updated: true };
      } catch (error) {
        throw new Error('Erro ao atualizar o registro de deleção.');
      }
  },

 async permanentlyDeleteUsers() {
    try {
     const thirtyDaysAgo = Timestamp.fromDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)); // 30 dias atrás

      const snapshot = await usersCollection
        .where('history.deletions.deleted', '==', true)
        .where('history.deletions.date.seconds', '>=', thirtyDaysAgo.seconds)
        .get();

     if (snapshot.empty) {
          console.log('Nenhum usuário encontrado.');
      } else {
          snapshot.forEach(doc => {
              let userAddDelete = {
                id: doc.id,
                user: doc.data()
              }
              usershistoryDeleteCollection.add(userAddDelete)
          });
      }

      const batch = firestore.batch();
      let count = 0;

      snapshot.forEach((doc) => {
        batch.delete(doc.ref);
        count++;
      });

      if (count > 0) {
        await batch.commit();
        console.log(`${count} usuários deletados permanentemente com sucesso.`);
      } else {
        console.log('Nenhum usuário a ser deletado.');
      }
    } catch (err) {
      console.error('Erro ao deletar usuários permanentemente:', err);
      throw new Error('Erro ao deletar usuários permanentemente.');
    }
  }
};

export default UserModel;
