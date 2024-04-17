import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";

// Your web app's Firebase configuration
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
const auth = getAuth();



var submit = document.getElementById("login");

submit.addEventListener("click", function () {

  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;

  if (!isValidEmail(email)) {
    alert("Enter a valid email address");
    return; // Exit the function early if email is not valid
  }

  if (password.length < 6) {
    alert("Password must be at least 6 characters long");
    return; // Exit the function early if password is too short
  }

  if (email === "" || password === "") {
    alert("Fill All input fields");
    return; // Exit the function early if any other field is empty
  }


  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      window.location.href = "./home.html";

    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorMessage);

    });

});

function isValidEmail(email) {
  // Regular expression for validating email addresses
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
