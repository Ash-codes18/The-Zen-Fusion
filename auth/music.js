import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getAuth,onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";

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
const auth = getAuth();



const profileImage = document.getElementById("profile-image");
const profileicon = document.getElementById("profile-icon");

onAuthStateChanged(auth, function(user) {

    
    if(user) {
        const profileUrl = user.photoURL;
        profileicon.style.display = "block";
        if (profileUrl) {
            profileImage.src = profileUrl;
        }
        else{
            profileImage.classList.add("invert");
        }
    } 
});