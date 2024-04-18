import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getAuth, onAuthStateChanged, sendEmailVerification, signOut } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";

// Firebase configuration
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

onAuthStateChanged(auth, (user) => {
 if (user) {
  const { uid, displayName, email, photoURL, emailVerified } = user;

  const profile = document.getElementById("profile");
  const username = document.getElementById("username");
  const userEmail = document.getElementById("email");
  const accountEmail = document.getElementById("account-email");
  const verified = document.getElementById("verified-status");
  const userId = document.getElementById("user-id");

  // Set background image
  profile.style.backgroundImage = photoURL ? `url('${photoURL}')` : "";

  // Set username
  username.innerText = displayName || "User Name";

  // Set email
  const userEmailText = email || "user@email.com";
  userEmail.innerText = userEmailText;
  accountEmail.innerText = userEmailText;

  // Set verified status
 // Set verified status
verified.innerHTML = emailVerified ? 'Yes <i class="fas fa-check-circle icon-success"></i>' : 'No   <i class="fa-solid fa-circle-exclamation icon-danger">  </i>';

// If user is not verified, add a button to resend verification email
if (!emailVerified) {
  verified.innerHTML += '<button id="resendVerificationBtn" class = "btn btn-warning mx-2" > Verify </button>';
  
  // Add event listener to the button to resend verification email
  const resendVerificationBtn = document.getElementById('resendVerificationBtn');
  resendVerificationBtn.addEventListener('click', () => {
    sendEmailVerification(auth.currentUser)
      .then(() => {
        // Email verification sent!
        // You can display a message or perform any other actions here
        alert('Verification email sent!');
      })
      .catch((error) => {
        // Handle errors
        console.error('Error sending verification email:', error.message);
        alert(error.message)
      });
  });
}

  // Set user ID
  userId.innerText = uid || 56413561; // Default user ID if uid is empty

 } else {
  window.location.href = "../index.html";
 }
});



const logout = document.getElementById("logout")

logout.addEventListener('click', function(){
 signOut(auth).then(() => {
  // Sign-out successful.
  window.location.href = "../index.html"
}).catch((error) => {
  // An error happened.
  alert("Error , login out")
});
})
