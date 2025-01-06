import firebase from 'firebase-admin';

firebase.initializeApp({
  credential: firebase.credential.cert('serviceAccountKey.json'),
});

export default firebase;

export const firestore = firebase.firestore();
export const userCollection = firestore.collection('users');
