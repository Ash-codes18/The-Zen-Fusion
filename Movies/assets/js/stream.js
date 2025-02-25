const movieId = window.localStorage.getItem('movieId');

setTimeout(function() {
  let popup = document.getElementById('popup');
  let btn = document.getElementById('stream-button');
  let popupContainer = document.getElementById('popupContainer');
  let closePopupBtn = document.getElementById('closePopupBtn');
  let popupIframe = document.getElementById('popupIframe');

  btn.addEventListener('click', function () {
    toggleGreyOut();
    popup.style.display = 'block';
    popupIframe.src = `https://www.2embed.cc/embed/${movieId}`;
    closePopupBtn.addEventListener('click', function () {
      popup.style.display = 'none';
      toggleGreyOut();
      popupIframe.src = '';
    });
  });


  
  
  function toggleGreyOut() {
    const entirePage = document.getElementById('entire-page');
    entirePage.classList.toggle('greyed-out');
  }



}, 3000);
