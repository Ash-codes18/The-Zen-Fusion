var search = document.getElementById('search');
var searchbox = document.getElementById('searchbox');
var inputbox = document.getElementById('searchfield');

search.addEventListener('click', function() {

    searchbox.style.display = 'block';
    inputbox.focus();

});


// inputbox.addEventListener('blur', function() {
//     if (!this.value.trim()) {
//         searchbox.style.display = 'none';
//     }
// });


