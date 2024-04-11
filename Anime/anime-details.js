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
    const primaryApiUrl = `https://api-consumet-org-six.vercel.app/anime/gogoanime/info/${animeId}`;
    const fallbackUrl = `https://api-consumet-psi.vercel.app/anime/gogoanime/info/${animeId}`;

    try {
      const response = await fetch(primaryApiUrl);

      if (!response.ok) {
        throw new Error('Error fetching data from primary API:', response.statusText);
      }

      const data = await response.json();
      await displayDetails(data);
    } catch (primaryApiError) {
      console.error('Error:', primaryApiError);
      console.log('Fetching data from fallback API...');
      try {
        const fallbackResponse = await fetch(fallbackUrl);

        if (!fallbackResponse.ok) {
          throw new Error('Error fetching data from fallback API:', fallbackResponse.statusText);
        }

        const fallbackData = await fallbackResponse.json();
        await displayDetails(fallbackData);
      } catch (fallbackApiError) {
        console.error('Error:', fallbackApiError);
      }
    }
  } else {
    window.location.href = 'index.html';
  }
});

async function displayDetails(anime) {
  const title = document.getElementById('anime-title');
  const image = document.getElementById('anime-image');
  const description = document.getElementById('anime-description');
  const episodesList = document.getElementById('anime-episodes');
  const genres = document.getElementById('anime-genres');
  const episodeDropdown = document.getElementById('episode-dropdown');

  title.textContent = anime.title;
  image.src = anime.image;
  image.alt = anime.title;
  description.textContent = anime.description;

  genres.innerHTML = '';
  episodesList.innerHTML = '';

  for (const genre of anime.genres) {
    const genreItem = document.createElement('span');
    genreItem.textContent = genre;
    genres.appendChild(genreItem);
  }

  populateEpisodeDropdown(anime.episodes);

  const defaultRange = episodeDropdown.options[0].value;
  const [startEpisode, endEpisode] = defaultRange.split('-');
  await displayEpisodes(anime.episodes, parseInt(startEpisode), parseInt(endEpisode));

  episodeDropdown.addEventListener('change', async (event) => {
    const selectedRange = event.target.value.split('-');
    const startEpisode = parseInt(selectedRange[0]);
    const endEpisode = parseInt(selectedRange[1]);
    await displayEpisodes(anime.episodes, startEpisode, endEpisode);
  });
}

async function displayEpisodes(allEpisodes, startEpisode, endEpisode) {
  const episodesList = document.getElementById('anime-episodes');
  episodesList.innerHTML = ''; 

  for (let i = startEpisode - 1; i < endEpisode; i++) {
    const episode = allEpisodes[i];
    const listItem = document.createElement('li');
    const link = document.createElement('a');
    link.textContent = `Episode ${episode.number}`;
    link.tabIndex = 0; // Make the link focusable
    link.href = `javascript:void(0);`; // Prevent default navigation

    link.dataset.episodeNumber = episode.number;
    link.dataset.episodeId = episode.id;
    link.classList.add('episode');

    // Handle click and Enter key press
    link.addEventListener('click', navigateToEpisode);
    link.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        navigateToEpisode(event);
      }
    });

    listItem.appendChild(link);
    episodesList.appendChild(listItem);
  }
}

function navigateToEpisode(event) {
  const episodeNumber = event.target.dataset.episodeNumber;
  const episodeId = event.target.dataset.episodeId;
  window.location.href = `video-player.html?episodeNumber=${episodeNumber}&episodeId=${episodeId}`;
}

function populateEpisodeDropdown(allEpisodes) {
  const episodeDropdown = document.getElementById('episode-dropdown');
  episodeDropdown.tabIndex = 0;
  const maxEpisodesPerRange = 100;
  let startEpisode = 1;

  episodeDropdown.innerHTML = '';

  while (startEpisode <= allEpisodes.length) {
    const endEpisode = Math.min(startEpisode + maxEpisodesPerRange - 1, allEpisodes.length);
    const option = document.createElement('option');
    option.value = `${startEpisode}-${endEpisode}`;
    option.textContent = `${startEpisode}-${endEpisode}`;
    episodeDropdown.appendChild(option);

    startEpisode += maxEpisodesPerRange;
  }
  if (allEpisodes.length > 1) {
    episodeDropdown.tabIndex = 0;
  } else {
    // If there is only one option, no need to focus on the dropdown
    episodeDropdown.tabIndex = -1;
  }
}