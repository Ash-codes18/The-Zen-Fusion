'use strict';

// ! ========== ADD EVENT ON MULTIPLE ELEMENTS ==========

const addEventOnElements = function (elements, eventType, callback) {
    elements.forEach((elem) => {
        elem.addEventListener(eventType, callback);
    });
}

// ! ========== TOGGLE SEARCH BOX IN SMALL DEVICES ==========

const searchBox = document.querySelector('[search-box]');
const searchTogglers = document.querySelectorAll('[search-toggler]');
addEventOnElements(searchTogglers, 'click', function () {
    searchBox.classList.toggle('active');
});

/**
 * ! store movieId in 'localStorage' when you click any movie card
 */

const getMovieDetail = function (movieId) {
    window.localStorage.setItem('movieId', String(movieId));
}

/**
 * ! store urlParam & genreName in 'localStorage' when you click any sidebar link
 */

const getMovieList = function (urlParam, genreName) {
    window.localStorage.setItem('urlParam', urlParam);
    window.localStorage.setItem('genreName', genreName);
}
