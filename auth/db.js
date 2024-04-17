import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, updateProfile } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

import { getDatabase, ref } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA9s5b2-OQA4wY3AwMFRt6qNOz-RYyth34",
  authDomain: "login-example-dff35.firebaseapp.com",
  projectId: "login-example-dff35",
  storageBucket: "login-example-dff35.appspot.com",
  messagingSenderId: "745268124885",
  appId: "1:745268124885:web:8529e4339ca902e7ec565c"
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
    const storageRefChild = storageRef(storage, 'some-child/' + file.name);
    uploadBytes(storageRefChild, file)
      .then((snapshot) => {
        appendSpinner(document.getElementById("changeProfile"));
        console.log('Uploaded a blob or file!');
        // Get the download URL of the uploaded file
        getDownloadURL(storageRefChild)
          .then((url) => {
            console.log('File available at', url);
            
            updateProfile(auth.currentUser, { photoURL: url })
              .then(() => {
                removeSpinner(document.getElementById("changeProfile"));
                // Update the UI with the new profile picture
                const profile = document.getElementById("profile");
                profile.style.backgroundImage = `url(${url})`;
                window.location.reload()
              })
              .catch((error) => {
                removeSpinner(document.getElementById("changeProfile"));
                console.error('Error updating profile:', error);
                alert(error);
              });
          })
          .catch((error) => {
            removeSpinner(document.getElementById("changeProfile"));
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

// Function to create and append spinner
function appendSpinner(button) {
  const spinner = document.createElement('span');
  spinner.classList.add('spinner-border', 'spinner-border-sm', 'ms-1');
  button.appendChild(spinner);
}

// Function to remove spinner
function removeSpinner(button) {
  const spinner = button.querySelector('.spinner-border');
  if (spinner) {
    spinner.remove();
  }
}