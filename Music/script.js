// Function to fetch songs based on user input query
async function fetchSongsByQuery() {
    const query = document.getElementById('query').value.trim();
    
    if (!query) {
      alert('Please enter a search query.');
      return;
    }
  
    const songs = await fetchSongs(query);
    displaySongs(songs);
  }
  
  // Function to fetch songs based on query using YouTube Data API
  async function fetchSongs(query) {
    const apiKey = 'AIzaSyAk4Z6WfWCOsKXRExrmXDOI2IhRIRqQ7s8'; // Replace with your own YouTube API key
  
    try {
      // Fetch songs based on query
      const response = await fetch(`https://www.googleapis.com/youtube/v3/search?key=${apiKey}&part=snippet&type=video&q=${query}`);
  
      const data = await response.json();
  
      // Extract relevant data from the search results
      const songs = data.items.map(item => ({
        thumbnail: item.snippet.thumbnails.default.url,
        name: item.snippet.title,
        artist: item.snippet.channelTitle,
        videoId: item.id.videoId
      }));
  
      return songs;
    } catch (error) {
      console.error('Error fetching songs:', error);
      return [];
    }
  }
  
  // Function to display songs on the UI
  function displaySongs(songs) {
    const songList = document.getElementById('song-list');
    songList.innerHTML = '';
  
    if (songs.length === 0) {
      const message = document.createElement('p');
      message.textContent = 'No songs found.';
      songList.appendChild(message);
    } else {
      songs.forEach(song => {
        const listItem = document.createElement('div');
        listItem.classList.add('song-item');
  
        const thumbnail = document.createElement('img');
        thumbnail.src = song.thumbnail;
        thumbnail.alt = 'Thumbnail';
        listItem.appendChild(thumbnail);
  
        const songInfo = document.createElement('div');
        songInfo.classList.add('song-info');
  
        const title = document.createElement('p');
        title.textContent = song.name;
        songInfo.appendChild(title);
  
        const artist = document.createElement('p');
        artist.textContent = `Artist: ${song.artist}`;
        songInfo.appendChild(artist);
  
        const playButton = document.createElement('button');
        playButton.classList.add('play-button');
        playButton.textContent = 'Play';
        playButton.addEventListener('click', () => playSong(song.videoId));
        songInfo.appendChild(playButton);
  
        listItem.appendChild(songInfo);
  
        songList.appendChild(listItem);
      });
    }
  }
  
  // Function to play a song
  function playSong(videoId) {
    const audioPlayer = document.getElementById('audio');
    const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
    audioPlayer.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  }
  
  // Event listener for the search button
  const searchButton = document.getElementById('search-button');
  searchButton.addEventListener('click', fetchSongsByQuery);
  