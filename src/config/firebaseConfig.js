import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyBaeqFF6nF03HbQ1obz8GM5r68zrFXF1qo",
  authDomain: "chatbot-a06fe.firebaseapp.com",
  projectId: "chatbot-a06fe",
  storageBucket: "chatbot-a06fe.appspot.com",
  messagingSenderId: "796537024344",
  appId: "1:796537024344:web:0881e4ee2ed555e12b7f2d",
  measurementId: "G-929FG9VFYJ"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app)

export {auth};