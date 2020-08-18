import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyDKjSl_kC0KLEFhBE6gQQ8xg2qokGgtIwo",
  authDomain: "devspeak-eabda.firebaseapp.com",
  databaseURL: "https://devspeak-eabda.firebaseio.com",
  projectId: "devspeak-eabda",
  storageBucket: "devspeak-eabda.appspot.com",
  messagingSenderId: "821951839632",
  appId: "1:821951839632:web:acaf2430f743ddf5074715",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { db, auth, provider };
