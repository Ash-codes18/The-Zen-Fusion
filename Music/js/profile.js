document.addEventListener("DOMContentLoaded", function() {
    let btn = document.getElementById("back-btn");
    let contact = document.getElementById("contact");
    
    btn.addEventListener("click", function() {
        window.history.back();
    });


    contact.addEventListener("click", function() {
        window.location.href = "../contact.html";
    });

});


