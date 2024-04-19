const movieId = window.localStorage.getItem('movieId');

// Wait 3 seconds before executing the code
setTimeout(function() {
  let btn = document.getElementById('stream-button');
  let popupContainer = document.getElementById('popupContainer');
  let closePopupBtn = document.getElementById('closePopupBtn');
  let popupIframe = document.getElementById('popupIframe');

  btn.addEventListener('click', function () {
    popupContainer.style.display = 'block';
    popupIframe.src = `https://www.2embed.cc/embed/${movieId}`;

    closePopupBtn.addEventListener('click', function () {
      popupContainer.style.display = 'none';
    });
  });
}, 3000);
