import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getDatabase, ref } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-database.js";
import { getStorage, ref as storageRef, listAll , uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-storage.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";


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
  
  var popup = document.getElementById('popup');
  var overlay = document.getElementById('overlay');
  var uploadPopup = document.getElementById('upload-song');
  var cancel =  document.getElementById('cancelPopupButton');
  var upload =  document.getElementById('uploadPopupButton');
  var fileInput = document.getElementById('song-input');
  

  function displayUploadedFile(url) {
    // Extract the file name from the URL
    const fileName = decodeURIComponent(url.substring(url.lastIndexOf('%2F') + 3, url.lastIndexOf('?')));
    
    // Create HTML elements to display the file
    const songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
    songUL.innerHTML += `<li> <img class="invert" width="34" src="./img/music.svg" alt="song-icon">
        <div class="info">
        <div>${fileName}</div>
        </div>
        <div class="playnow">
        <span>Play Now</span>
        <img class="invert" src="./img/play.svg" alt="play-icon">
        </div>
        </li>`;
}

  
  // Event listener for opening upload popup
  uploadPopup.addEventListener('click', function() {
      document.getElementById('overlay').style.display = 'block';
      document.getElementById('popup').style.display = 'flex';
  });
  
  // Event listener for closing upload popup
  cancel.addEventListener('click', function() {
      overlay.style.display = 'none';
      popup.style.display = 'none';
  });
  
  // Event listener for file input change
  fileInput.addEventListener('change', function() {
      var fileName = fileInput.files[0].name;
      document.getElementById('selectedFileName').innerText = fileName;
  });

  function fetchAndDisplayUploadedFiles() {
    console.log("Fetching and displaying uploaded files...");
    if (auth.currentUser) {
      const { uid } = auth.currentUser;
      console.log("Current user UID:", uid);
      const userStorageRef = storageRef(storage, `songs/${uid}/`);
      console.log("User storage reference:", userStorageRef);
  
      // Use listAll to list the files in the directory
      listAll(userStorageRef)
        .then((result) => {
          result.items.forEach((fileRef) => {
            // Get the download URL for each file
            getDownloadURL(fileRef).then((url) => {
              console.log("Download URL:", url);
              const fileName = fileRef.name;
              console.log("File name:", fileName);
              displayUploadedFile(url, fileName);
            });
          });
        }).catch((error) => {
          console.error('Error retrieving uploaded files:', error);
        });
    } else {
      console.log("No user logged in.");
    }
  }
  

  
  // Event listener for upload button
  upload.addEventListener('click', function() {
      const file = fileInput.files[0];
  
      if (file) {
          const storageRefChild = storageRef(storage, `songs/${auth.currentUser.uid}/` + file.name);
          uploadBytes(storageRefChild, file)
              .then((songs) => {
                  console.log('Uploaded a song!');
                  getDownloadURL(storageRefChild)
                      .then((url) => {
                          console.log('File available at', url);
                          const fileName = url.substring(url.lastIndexOf('/') + 1);
                          displayUploadedFile(fileName);
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
  
      alert('Uploading song...');
      overlay.style.display = 'none';
      popup.style.display = 'none';
  });
  
//   Check authentication state and fetch/display uploaded files on page load
  onAuthStateChanged(auth, (user) => {
      if (user) {
          fetchAndDisplayUploadedFiles();
      }
  });
  