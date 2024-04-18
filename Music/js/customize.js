import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getAuth, onAuthStateChanged, updatePassword, updateEmail, updateProfile ,deleteUser } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";

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
let auth;




// Listen for auth state changes
onAuthStateChanged(getAuth(app), (user) => {
 auth = getAuth(app);

 //delete account

const deleteAccount = document.getElementById("deleteProfile")

deleteAccount.addEventListener("click", function(){

  deleteUser(user).then(() => {
    // User deleted.

    alert("Profile deleted..")
    window.location.href ="../index.html"
  }).catch((error) => {
    // An error ocurred
    alert(error)
  });
})
});


// Function to handle change password
document.getElementById("changePassword").addEventListener("click", () => {
  const newPassword = document.getElementById('newPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  // Validate input fields
  if (newPassword.length < 6 || confirmPassword.length < 6) {
      alert("Passwords must have at least 6 characters.");
      return;
  }

  if (newPassword !== confirmPassword) {
      alert("New password and confirm password do not match.");
      return;
  }

  const user = auth.currentUser;


  updatePassword(user, newPassword)
      .then(() => {

          alert("Password updated successfully!");
          window.location.reload();
      })
      .catch((error) => {

          alert("Error updating password: " + error.message);
      });
});

// Function to handle change email
document.getElementById("changeEmail").addEventListener("click", () => {
  const newEmail = document.getElementById("newEmail").value;
  const user = auth.currentUser;

  // Validate input field
  if (!newEmail) {
      alert("Please enter a new email address.");
      return;
  }


  if (newEmail !== user.email) {
      updateEmail(user, newEmail)
          .then(() => {
 
              alert("Email updated successfully! Please verify your new email address.");
              window.location.reload();
          })
          .catch((error) => {

              alert("Error updating email: " + error.message);
          });
  } else {

      alert("The new email address is the same as the current one.");
  }
});

// Function to handle change display name
document.getElementById("changeDisplayName").addEventListener("click", () => {
  const newDisplayName = document.getElementById("newDisplayName").value;
  const user = auth.currentUser;

  // Validate input field
  if (!newDisplayName) {
      alert("Please enter a new display name.");
      return;
  }



  updateProfile(user, { displayName: newDisplayName })
      .then(() => {

          alert("Username updated successfully!");
          window.location.reload();
      })
      .catch((error) => {

          alert("Error updating username: " + error.message);
      });
});



