var search = document.getElementById('search');
var searchbox = document.getElementById('searchbox');
var inputbox = document.getElementById('searchfield');
var val = document.getElementById('searchfield').value;

search.addEventListener('click', function() {

    searchbox.style.display = 'block';
    inputbox.focus();

});


inputbox.addEventListener('blur', function() {
    
    if(val==''){
        searchbox.style.display = 'none';
    }
    
});


