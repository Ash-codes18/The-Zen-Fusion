import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";


const firebaseConfig = {
  apiKey: "AIzaSyC-fcT7czqu5Ttn-DsVGlx1sF9cLe0m_xs",
  authDomain: "thezenfusion.firebaseapp.com",
  projectId: "thezenfusion",
  storageBucket: "thezenfusion.appspot.com",
  messagingSenderId: "725185974268",
  appId: "1:725185974268:web:fc64a1bbc97c6f9117ac79"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.languageCode = 'en'; 
const provider = new GoogleAuthProvider();

const googleLogin = document.getElementById("google-btn");

googleLogin.addEventListener("click", function(){
  signInWithPopup(auth, provider)
  .then((result) => {
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const user = result.user;
    console.log(user);
    window.location.href="./home.html";
  }).catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
  });
}); 