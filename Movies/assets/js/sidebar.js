'use-strict';

import{api_key,fetchDataFromServer} from "./api.js"

export function sidebar(){
    const genreList = {};

    fetchDataFromServer(`https://api.themoviedb.org/3/genre/movie/list?api_key=${api_key}`,function({genres}){
        for(const {id,name} of genres){
            genreList[id] = name;
        }

        genreLink();
    });


    const sidebarInner = document.createElement("div");
    sidebarInner.classList.add("sidebar-inner");

    sidebarInner.innerHTML = `
        

    `


}

