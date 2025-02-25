document.addEventListener("DOMContentLoaded", async () => {
  // Retrieve parameters from URL.
  const urlParams = new URLSearchParams(window.location.search);
  let animeId = urlParams.get("animeId") || (sessionStorage.getItem("selectedAnime") ? JSON.parse(sessionStorage.getItem("selectedAnime")).id : null);
  let episodeId = urlParams.get("episodeId");

  // Ensure we have an animeId.
  if (!animeId) {
    console.error("No animeId provided in URL or sessionStorage.");
    document.body.innerHTML = "<p>Error: No anime selected. Please go back and choose an anime.</p>";
    return;
  }

  // Helper function to transform an episode id from the site format to the API expected format.
  // e.g., "one-punch-man-63-episode-2" => "one-punch-man-63?ep=2"
  function transformEpisodeId(id) {
    // If the id already contains "?ep=", assume it's in the proper API format.
    if (id.includes("?ep=")) {
      return id;
    }
    return id.replace("-episode-", "?ep=");
  }

  // Transform episodeId if necessary.
  if (episodeId) {
    episodeId = transformEpisodeId(episodeId);
  }

  // Helper function to fetch the list of episodes.
  async function fetchEpisodes(animeId) {
    const episodesUrl = `https://ashanime-liart.vercel.app/api/v2/hianime/anime/${animeId}/episodes`;
    try {
      const resp = await fetch(episodesUrl);
      if (!resp.ok) {
        throw new Error(`Error fetching episodes: ${resp.statusText}`);
      }
      const data = await resp.json();
      if (data.success && data.data && Array.isArray(data.data.episodes)) {
        return data.data.episodes;
      }
      throw new Error("Episodes data not found.");
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  // If no episodeId is provided, display an episode selection UI.
  if (!episodeId) {
    const episodes = await fetchEpisodes(animeId);
    if (episodes) {
      const container = document.getElementById("episodes-container") || document.body;
      container.innerHTML = "<h2>Select an episode:</h2>";
      const select = document.createElement("select");
      select.id = "episodes-select";
      episodes.forEach((episode) => {
        // The API returns episode.episodeId in the correct format (e.g., "steinsgate-3?ep=213").
        const option = document.createElement("option");
        option.value = episode.episodeId;
        option.textContent = `Episode ${episode.number}: ${episode.title}`;
        select.appendChild(option);
      });
      container.appendChild(select);
      select.addEventListener("change", (event) => {
        const selectedEpisodeId = event.target.value;
        window.location.href = `video-player.html?animeId=${animeId}&episodeId=${selectedEpisodeId}`;
      });
      return;
    } else {
      document.body.innerHTML = "<p>Error fetching episodes.</p>";
      return;
    }
  }

  // Helper function: fetch streaming servers for a given episode.
  async function fetchStreamingServers(epId) {
    const serversUrl = `https://ashanime-liart.vercel.app/api/v2/hianime/episode/servers?animeEpisodeId=${epId}`;
    try {
      const resp = await fetch(serversUrl);
      if (!resp.ok) {
        throw new Error(`Error fetching servers: ${resp.statusText}`);
      }
      const data = await resp.json();
      if (data.success && data.data) {
        return data.data;
      }
      throw new Error("Servers data not found.");
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  // Helper function: fetch streaming sources.
  async function fetchViewingSources(finalEpisodeId, chosenServer, category = "sub") {
    const sourcesUrl = `https://ashanime-liart.vercel.app/api/v2/hianime/episode/sources?animeEpisodeId=${finalEpisodeId}&server=${chosenServer}&category=${category}`;
    try {
      const resp = await fetch(sourcesUrl);
      if (!resp.ok) {
        throw new Error(`Error fetching sources: ${resp.statusText}`);
      }
      const data = await resp.json();
      if (data.success && data.data && Array.isArray(data.data.sources)) {
        return data.data;
      }
      throw new Error("Sources data not found.");
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  // Fetch streaming servers using the transformed episodeId.
  const serversData = await fetchStreamingServers(episodeId);
  if (!serversData) {
    console.error("Failed to load streaming servers.");
    document.body.innerHTML = "<p>Error retrieving streaming servers.</p>";
    return;
  }

  // Use the final episode id provided by the servers endpoint.
  const finalEpisodeId = serversData.episodeId;
  console.log("Final episode id from server response:", finalEpisodeId);

  // Choose default category and server.
  const category = "sub";
  if (!serversData.sub || !Array.isArray(serversData.sub) || serversData.sub.length === 0) {
    console.error("No sub servers available.");
    document.body.innerHTML = "<p>Error: No sub servers available.</p>";
    return;
  }
  const chosenServer = serversData.sub[0].serverName;
  console.log("Chosen server:", chosenServer);

  // Fetch viewing sources using the final episode id.
  const sourcesData = await fetchViewingSources(finalEpisodeId, chosenServer, category);
  if (!sourcesData) {
    console.error("Failed to load viewing sources.");
    document.body.innerHTML = "<p>Error retrieving viewing sources.</p>";
    return;
  }

  if (!sourcesData.sources || sourcesData.sources.length === 0) {
    console.error("No streaming source links available.");
    document.body.innerHTML = "<p>Error: No streaming sources available.</p>";
    return;
  }

  const mainSource = sourcesData.sources[0];
  const mainUrl = mainSource.url;
  console.log("Main streaming URL:", mainUrl);

  // Get the video element.
  const videoElement = document.getElementById("player");
  if (!videoElement) {
    console.error("No video element found with id 'player'.");
    return;
  }

  // Remove any existing subtitle tracks.
  videoElement.querySelectorAll("track").forEach((track) => track.remove());

  // Add subtitle tracks if available.
  if (sourcesData.subtitles && Array.isArray(sourcesData.subtitles) && sourcesData.subtitles.length > 0) {
    sourcesData.subtitles.forEach((subtitle) => {
      const track = document.createElement("track");
      track.kind = "subtitles";
      track.label = subtitle.lang;
      track.srclang = subtitle.lang.slice(0, 2).toLowerCase();
      track.src = subtitle.url;
      videoElement.appendChild(track);
    });
    console.log("Subtitle tracks added.");
  }

  // Initialize Plyr.
  const player = new Plyr(videoElement, {
    controls: [
      "play-large", "rewind", "play", "fast-forward",
      "progress", "current-time", "duration", "mute",
      "quality", "volume", "captions", "settings", "pip", "airplay", "fullscreen"
    ],
    autoplay: false,
    loop: { active: false },
    keyboard: { focused: true, global: true }
  });

  // Use Hls.js for HLS streaming if supported.
  if (Hls.isSupported()) {
    const hls = new Hls();
    hls.loadSource(mainUrl);
    hls.attachMedia(videoElement);
    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      console.log("HLS manifest parsed; video is ready to play.");
    });
  } else if (videoElement.canPlayType("application/vnd.apple.mpegurl")) {
    videoElement.src = mainUrl;
  } else {
    console.error("This browser does not support HLS playback.");
  }
});