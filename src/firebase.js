// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCxyssm-wOl6dcqfBOd-HVvr23C0U07fwo",
    authDomain: "diligencetech-e4fb4.firebaseapp.com",
    projectId: "diligencetech-e4fb4",
    storageBucket: "diligencetech-e4fb4.appspot.com",
    messagingSenderId: "206617448671",
    appId: "1:206617448671:web:f656c94a35f2fc537e996a",
    measurementId: "G-KDBNSCDHQ8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
import { getStorage } from "firebase/storage";
const storage = getStorage(app);

export { storage }