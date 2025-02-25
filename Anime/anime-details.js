document.addEventListener('DOMContentLoaded', async () => {
  let animeId;
  const selectedAnime = JSON.parse(sessionStorage.getItem('selectedAnime'));

  if (selectedAnime) {
    animeId = selectedAnime.id;
  } else {
    const urlParams = new URLSearchParams(window.location.search);
    animeId = urlParams.get('animeId');
  }

  if (animeId) {
    // New API endpoint
    const apiUrl = `https://streaming-steel.vercel.app/api/info?id=${animeId}`;

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("API Response:", data);

      if (data.success && data.results && data.results.data) {
        await displayDetails(data.results);
      } else {
        console.error('Anime details not found in the response.', data);
      }
    } catch (error) {
      console.error('Failed to fetch anime details:', error);
    }
  } else {
    window.location.href = 'index.html';
  }
});

async function displayDetails(animeData) {
  // Extract main data and seasons from the response
  const info = animeData.data;
  const seasons = animeData.seasons || [];
  
  const titleEl = document.getElementById('anime-title');
  const imageEl = document.getElementById('anime-image');
  const descriptionEl = document.getElementById('anime-description');
  const episodesListEl = document.getElementById('anime-episodes');
  const genresEl = document.getElementById('anime-genres');
  const episodeDropdownEl = document.getElementById('episode-dropdown');

  if (!titleEl || !imageEl || !descriptionEl || !episodesListEl || !genresEl || !episodeDropdownEl) {
    console.error('Some elements are missing in the DOM.');
    return;
  }

  // Set title, image from info
  titleEl.textContent = info.title || '';
  imageEl.src = info.poster || '';
  imageEl.alt = info.title || '';
  
  // Set description from animeInfo.Overview
  const overview = info.animeInfo ? (info.animeInfo.Overview || 'No description available.') : 'No description available.';
  descriptionEl.textContent = overview;

  // Populate genres
  genresEl.innerHTML = '';
  if (info.animeInfo && info.animeInfo.Genres && Array.isArray(info.animeInfo.Genres)) {
    info.animeInfo.Genres.forEach(genre => {
      const genreItem = document.createElement('span');
      genreItem.textContent = genre;
      genresEl.appendChild(genreItem);
    });
  } else {
    genresEl.textContent = 'No genres available';
  }

  // Attempt to fetch episodes for the current selected season
  try {
    // Check if there's a episodes listing in the current API response
    // This part depends on how the actual API response is structured
    let episodes = [];
    
    // First get the IDs we need based on the main anime ID
    const episodeCount = getEstimatedEpisodeCount(info);
    
    if (episodeCount > 0) {
      // Generate episodes based on the estimated count
      // We'll use the main anime ID plus a query parameter for the episode
      for (let i = 1; i <= episodeCount; i++) {
        episodes.push({
          number: i,
          id: `${info.id}?ep=${i}`, // Format: anime-id?ep=episode_number
          title: `Episode ${i}`
        });
      }
    } else if (seasons && seasons.length > 0) {
      // If no episode count but we have seasons, use the first season's ID
      const firstSeason = seasons[0];
      const seasonId = firstSeason.id;
      
      // Assume a default of 12 episodes per season if we can't determine
      const seasonEpisodes = 12;
      
      for (let i = 1; i <= seasonEpisodes; i++) {
        episodes.push({
          number: i,
          id: `${seasonId}?ep=${i}`,
          title: `Episode ${i}`
        });
      }
    }
    
    populateEpisodeDropdown(episodes);
    
    if (episodes.length > 0 && episodeDropdownEl.options.length > 0) {
      const defaultRange = episodeDropdownEl.options[0].value.split('-');
      const [startEpisode, endEpisode] = defaultRange.map(Number);
      await displayEpisodes(episodes, startEpisode, endEpisode);
    }
    
    episodeDropdownEl.addEventListener('change', async (event) => {
      const [startEpisode, endEpisode] = event.target.value.split('-').map(Number);
      await displayEpisodes(episodes, startEpisode, endEpisode);
    });
    
  } catch (error) {
    console.error('Failed to process episodes:', error);
    episodesListEl.textContent = 'Failed to load episodes';
  }
}

// Helper function to estimate episode count from anime info
function getEstimatedEpisodeCount(info) {
  // Try to find episode count from different possible locations in the API response
  
  // Check if there's a direct episode count in the info
  if (info.episodeCount && !isNaN(parseInt(info.episodeCount))) {
    return parseInt(info.episodeCount);
  }
  
  // Check anime info for episode count
  if (info.animeInfo) {
    // Look for common fields that might contain episode count
    const animeInfo = info.animeInfo;
    
    // Check if there's an Episodes field
    if (animeInfo.Episodes && !isNaN(parseInt(animeInfo.Episodes))) {
      return parseInt(animeInfo.Episodes);
    }
    
    // Sometimes it might be in the Status field like "Finished Airing (24 Episodes)"
    if (animeInfo.Status && animeInfo.Status.includes('Episodes')) {
      const match = animeInfo.Status.match(/(\d+)\s*Episodes/i);
      if (match && match[1] && !isNaN(parseInt(match[1]))) {
        return parseInt(match[1]);
      }
    }
  }
  
  // Default to 12 episodes if we can't determine
  return 12;
}

async function displayEpisodes(allEpisodes, startEpisode, endEpisode) {
  const episodesListEl = document.getElementById('anime-episodes');
  episodesListEl.innerHTML = '';

  if (!allEpisodes.length) {
    episodesListEl.textContent = 'No episodes available';
    return;
  }

  allEpisodes.slice(startEpisode - 1, endEpisode).forEach(episode => {
    const listItem = document.createElement('li');
    const link = document.createElement('a');
    link.textContent = episode.title || `Episode ${episode.number}`;
    link.href = `video-player.html?episodeNumber=${episode.number}&episodeId=${episode.id}`;
    link.classList.add('episode');
    listItem.appendChild(link);
    episodesListEl.appendChild(listItem);
  });
}

function populateEpisodeDropdown(allEpisodes) {
  const episodeDropdownEl = document.getElementById('episode-dropdown');
  if (!episodeDropdownEl) return;

  episodeDropdownEl.innerHTML = '';
  const maxEpisodesPerRange = 100;

  if (!allEpisodes.length) {
    const option = document.createElement('option');
    option.textContent = 'No episodes available';
    option.disabled = true;
    episodeDropdownEl.appendChild(option);
    return;
  }

  for (let i = 0; i < allEpisodes.length; i += maxEpisodesPerRange) {
    const startEpisode = i + 1;
    const endEpisode = Math.min(i + maxEpisodesPerRange, allEpisodes.length);
    const option = document.createElement('option');
    option.value = `${startEpisode}-${endEpisode}`;
    option.textContent = `${startEpisode}-${endEpisode}`;
    episodeDropdownEl.appendChild(option);
  }
}