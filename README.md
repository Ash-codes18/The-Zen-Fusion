<p align="center">
  <div align="center">
    <a href="https://github.com/Ash-codes18/The-Zen-Fusion">
      <img src="/assets/zenfusion-high-resolution-logo-transparent.svg" alt="Logo">
    </a>
    <h3>Entertainment Redefined</h3>
   
<a href="https://github.com/Ash-codes18/The-Zen-Fusion/stargazers">
      <img src="https://img.shields.io/github/stars/Ash-codes18/The-Zen-Fusion?style=flat-square" alt="Github Stars">
    </a>
    <a href="https://github.com/Ash-codes18/issues">
      <img src="https://img.shields.io/github/issues/Ash-codes18/The-Zen-Fusion?style=flat-square">
    </a>
    <a href="https://github.com/Ash-codes18/forks">
      <img src="https://img.shields.io/github/forks/Ash-codes18/The-Zen-Fusion?style=flat-square">
    </a>
  </div>

  <hr />

  <p align="center">
    The open-source Movie, anime, and music streaming service made with HTML, Bootstrap and plain JS. It lets you search and watch movies, anime and listen to music in the highest quality possible without any ads with a beautiful ui. It can be self hosted or deployed online.
  </p>
</p>


<p align="center">
  <a href="https://firebase.google.com/">
    <img src="https://img.shields.io/badge/firebase-%23039BE5.svg?style=for-the-badge&logo=firebase">
  </a>
  <a href="http://vanilla-js.com/">
    <img src="https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E">
  </a>
  <a href="https://nodejs.org/en">
    <img src="https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white">
  </a>
  <a href="https://getbootstrap.com/">
    <img src="https://img.shields.io/badge/bootstrap-%238511FA.svg?style=for-the-badge&logo=bootstrap&logoColor=white">
  </a>
</p>


<img src="/assets/demo1.png">

<hr/>

## Acknowledgements

Consumet and JioSaavn are the underlying public free API's that are used for fetching the data about Anime and Music. The TMDb official api is used for fetching the data about Movies. 

[consumet-api](https://github.com/consumet/api.consumet.org) is used for interacting with GogoAnime and scrape video soures and anime information.

[jiosaavn-api](https://github.com/sumitkolhe/jiosaavn-api) is used for fetching the music data from JioSaavn.

[TMDb API](https://www.themoviedb.org/documentation/api) is used for fetching the movie data.


## Online Deployment

Following are the recommended online deployment services which are tested to work with this project. If you want to add a deployment service just open an issue.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Ash-codes18/The-Zen-Fusion&repo-name=The-Zen-Fusion)

[![Deploy with netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/Ash-codes18/The-Zen-Fusion)

## Docker Deployment

The docker images for this app is available at dockerhub. [ashmitmehta/zenfusion](https://hub.docker.com/repository/docker/ashmitmehta/zenfusion).

Run it easily using this command

```
docker run -p 3000:3000 ashmitmehta/zenfusion
```

This will start ZenFusion at port 3000. You can change the port by doing `-p <port>:3000`,

You can run this as a background service by adding `-d` flag

## Local Deployment

You need to have `nodejs` and `git` installed on your pc for following the intructions

First download the repository using
```
git clone https://github.com/Ash-codes18/The-Zen-Fusion
```

Next make sure you have node installed on your system
```
node -v
```
> this step probably requires admin perms

This should download this repository to your computer. Next, to download the dependencies run
```
npm install
```


