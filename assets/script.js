let movies = document.getElementsByClassName("movie-button")[0];
let anime = document.getElementsByClassName("anime-button")[0];
let music = document.getElementsByClassName("music-button")[0];
let explore = document.getElementById("explore-btn");

function redirectToMovies(){
    window.open("./Movies/index.html","_self");
}

function redirectToAnime(){
    window.open("./Anime/index.html","_self");
}

function redirectToMusic(){
    window.open("./Music/index.html","_self");
}

function scrollToContent(){
    let exploreSection = document.getElementById("explore");
    exploreSection.scrollIntoView({ behavior: 'smooth' });
}

movies.addEventListener("click", redirectToMovies);
anime.addEventListener("click", redirectToAnime);
music.addEventListener("click", redirectToMusic);
explore.addEventListener("click", scrollToContent);
