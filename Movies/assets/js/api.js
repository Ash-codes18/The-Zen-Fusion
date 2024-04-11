'use-strict';

const api_key = '0c47217bbf65aa2dcc3cf53dffded77f';
const imageBaseUrl = 'http://image.tmdb.org/t/p/'


/*
 fetch data from a server using the 'url' and passes
 the result in JSON data to a 'callback' funtion
  along with an optional parameter if has 'optionalParam'
  */

const fetchDataFromServer = function(url,callback,optionalParam){
    fetch(url)
    .then(response=>response.json())
    .then(data=>callback(data,optionalParam));
}

export{imageBaseUrl,api_key,fetchDataFromServer};
