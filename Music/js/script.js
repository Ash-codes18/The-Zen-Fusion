console.log('Lets write JavaScript');
let currentSong = new Audio();
let currFolder;
let songs = [];
let currentPage = 1; // Track the current page number
const songsPerPage = 10;
let currentSongIndex = -1; // Initialize index to -1

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function fetchSongs(query) {
    const apiUrl = `https://music-api-sigma-one.vercel.app/api/search/songs?query=${query}`;
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.success) {
            return data.data.results.map(song => ({
                name: song.name,
                year: song.year,
                duration: song.duration,
                artists: song.artists.all.map(artist => artist.name),
                thumbnail: song.image.find(img => img.quality === '500x500').url,
                downloadUrl: song.downloadUrl.find(url => url.quality === '320kbps').url
            }));
        } else {
            console.log('Failed to retrieve data from the API');
            return [];
        }
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}

async function displaySongs(query = 'top+hits') {
    songs = await fetchSongs(query);
    const cardContainer = document.querySelector(".cardContainer");
    cardContainer.innerHTML = '';

    songs.forEach(song => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `
            <div class="play">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" fill="#000" stroke-width="1.5" stroke-linejoin="round"/>
                </svg>
            </div>
            <img src="${song.thumbnail}" alt="">
            <div class="songDetails">
                <h2>${song.name}</h2>
                <p>${song.artists.slice(0, 2).join(', ')}</p>
                <p>${song.year} | ${secondsToMinutesSeconds(song.duration)}</p>
            </div>
        `;
        cardContainer.appendChild(card);

        card.addEventListener("click", () => {
            playMusic(song);
            currentSongIndex = songs.findIndex(s => s.name === song.name); // Update current song index
        });
    });
}

const playMusic = (song) => {
    currentSong.src = song.downloadUrl;
    currentSong.play();
    document.querySelector(".songinfo").innerHTML = song.name;
    document.querySelector(".songtime").innerHTML = "00:00 / " + secondsToMinutesSeconds(song.duration);

    play.src = "img/pause.svg";

}

async function main() {
    await displaySongs();

    const searchField = document.getElementById("searchfield");
    searchField.addEventListener("input", async (event) => {
        const query = event.target.value.trim();
        if (query.length > 0) {
            await displaySongs(query);
        } else {
            await displaySongs();
        }
    });

    // Attach an event listener to play, next and previous
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "img/pause.svg";
        } else {
            currentSong.pause();
            play.src = "img/play.svg";
        }
    });

    // Add event listener to previous
    previous.addEventListener("click", () => {
        currentSong.pause();
        console.log("Previous clicked");
        if (currentSongIndex > 0) {
            playMusic(songs[currentSongIndex - 1]);
            currentSongIndex--;
        } else if (currentSongIndex === 0) {
            playMusic(songs[songs.length - 1]); // Play the last song if currently playing the first song
            currentSongIndex = songs.length - 1;
        }
    });

    // Add event listener to next
    next.addEventListener("click", () => {
        currentSong.pause();
        console.log("Next clicked");
        if (currentSongIndex < songs.length - 1) {
            playMusic(songs[currentSongIndex + 1]);
            currentSongIndex++;
        } else if (currentSongIndex === songs.length - 1) {
            playMusic(songs[0]); // Play the first song if currently playing the last song
            currentSongIndex = 0;
        }
    });

    // Listen for timeupdate event
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    });



    // Listen for the 'ended' event on the currentSong audio element
    currentSong.addEventListener('ended', () => {
        // Check if there are more songs in the playlist
        if (currentSongIndex < songs.length - 1) {
            // Play the next song
            playMusic(songs[currentSongIndex + 1]);
            currentSongIndex++;
        } else {
            // If the last song in the playlist has ended, play the first song
            playMusic(songs[0]);
            currentSongIndex = 0;
        }
    });




    // Add an event listener for seek bar
    document.querySelector(".seekbar").addEventListener("click", (e) => {
        const seekPosition = (e.offsetX / e.target.offsetWidth) * currentSong.duration;
        currentSong.currentTime = seekPosition;
    });


    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })

    // Add an event listener for close button
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })

    // Add an event listener for volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log("Setting volume to", e.target.value, "/ 100")
        currentSong.volume = parseInt(e.target.value) / 100
        if (currentSong.volume > 0) {
            document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("mute.svg", "volume.svg")
        }
    });

    // Add event listener to mute the track 
    document.querySelector(".volume>img").addEventListener("click", e => {
        if (e.target.src.includes("volume.svg")) {
            e.target.src = e.target.src.replace("volume.svg", "mute.svg")
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        } else {
            e.target.src = e.target.src.replace("mute.svg", "volume.svg")
            currentSong.volume = .10;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }
    });
}

main();
