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



const mail = document.getElementById("email");

onAuthStateChanged(auth, function(user) {

    
    if(user) {
        mail.value = user.email;
    } 
    else {
        window.location.href = "index.html";
    }
});

document.querySelectorAll('.faq li .question').forEach(function(question) {
    question.addEventListener('click', function() {
      var toggle = this.querySelector('.plus-minus-toggle');
      if (toggle) {
        toggle.classList.toggle('collapsed');
      }
      this.parentNode.classList.toggle('active');
    });
  });


let faq = document.getElementById("faq-btn");
faq.addEventListener("click", scrollToContent);

function scrollToContent(){
    let faqSection = document.getElementById("faqs");
    faqSection.scrollIntoView({ behavior: 'smooth' });
}
  

let back = document.getElementById("back-btn");
back.addEventListener("click", goback);

function goback(){
    window.history.back();
}
