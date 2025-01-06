import firebase from 'firebase-admin';

firebase.initializeApp({
  credential: firebase.credential.cert('serviceAccountKey.json'),
});

export default firebase;

export const firestore = firebase.firestore();
export const usersCollection = firestore.collection('users');
export const usershistoryDeleteCollection = firestore.collection('users_history_delete');
