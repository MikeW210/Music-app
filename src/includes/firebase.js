import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyCNWaoOCIto40rA1v2irZMUu0N0N1t3cso",
  authDomain: "music-bc2f4.firebaseapp.com",
  projectId: "music-bc2f4",
  storageBucket: "music-bc2f4.appspot.com",
  messagingSenderId: "720194644169",
  appId: "1:720194644169:web:2ae19da37b8fa44584c518",
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

db.enablePersistence();

const storage = firebase.storage();
const usersCollection = db.collection("users");
const songsCollection = db.collection("songs");
const commentsCollection = db.collection("comments");
export {
  auth,
  db,
  usersCollection,
  storage,
  songsCollection,
  commentsCollection,
};
