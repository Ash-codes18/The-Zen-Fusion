import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getAuth, updateProfile } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";

import { getDatabase, ref } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-database.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-storage.js";

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
const auth = getAuth(app);

const database = getDatabase(app);
const storage = getStorage(app);
const itemsInDb = ref(database, "lostItems");

document.getElementById("changeProfile").addEventListener("click", function () {
  const fileInput = document.getElementById("newProfilePicture");
  const file = fileInput.files[0];

  if (file) {
    const storageRefChild = storageRef(storage, 'photos/' + file.name);
    uploadBytes(storageRefChild, file)
      .then((snapshot) => {
        console.log('Uploaded a blob or file!');
        // Get the download URL of the uploaded file
        getDownloadURL(storageRefChild)
          .then((url) => {
            console.log('File available at', url);
            
            updateProfile(auth.currentUser, { photoURL: url })
              .then(() => {
        
                // Update the UI with the new profile picture
                const profile = document.getElementById("profile");
                profile.style.backgroundImage = `url(${url})`;
                window.location.reload()
              })
              .catch((error) => {
    
                console.error('Error updating profile:', error);
                alert(error);
              });
          })
          .catch((error) => {
           
            console.error('Error getting download URL:', error);
            alert(error);
          });
      })
      .catch((error) => {
        console.error("Error uploading file:", error);
        alert(error);
      });
  } else {
    console.error("No file selected");
    alert("No file selected");
  }
});


