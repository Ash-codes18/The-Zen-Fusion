document.addEventListener('DOMContentLoaded', () => {
  const searchForm = document.getElementById('search-form');
  const searchResults = document.getElementById('search-results');
  const prevPageButton = document.getElementById('prev-page');
  const nextPageButton = document.getElementById('next-page');
  const toggleSwitch = document.querySelector('.switch input[type="checkbox"]');
  const toggleState = document.getElementById('toggle-state');

  let query = '';
  let pageNumber = 1;

  // When the document loads, set the initial toggle state from localStorage
  window.onload = function() {
    const savedToggleState = JSON.parse(localStorage.getItem('toggleState'));
    if (savedToggleState === null) {
      localStorage.setItem('toggleState', JSON.stringify(true));
      toggleSwitch.checked = true;
      toggleState.textContent = 'Sub';
    } else {
      toggleSwitch.checked = savedToggleState;
      toggleState.textContent = savedToggleState ? 'Sub' : 'Dub';
    }
  };

  // Listen for form submission, update query and fetch data
  searchForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    query = event.target.search.value;
    pageNumber = 1;
    await fetchAndDisplayData(query, pageNumber);
  });

  // Allow toggling via 'Enter' key
  toggleSwitch.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.keyCode === 13) {
      event.preventDefault();
      toggleSwitch.click(); 
    }
  });

  // When toggle changes, update localStorage and refresh search
  toggleSwitch.addEventListener('change', function() {
    localStorage.setItem('toggleState', JSON.stringify(this.checked));
    toggleState.textContent = this.checked ? 'Sub' : 'Dub';
    searchForm.dispatchEvent(new Event('submit', { cancelable: true }));
  });

  // Filter results by checking if the anime name contains "(dub)"
  function filterResults(results) {
    if (toggleSwitch.checked) {
      return results.filter(result => !result.name.toLowerCase().includes('(dub)'));
    } else {
      return results.filter(result => result.name.toLowerCase().includes('(dub)'));
    }
  }

  function showLoadingSpinner() {
    document.getElementById('loading-spinner').style.display = 'block';
  }

  function hideLoadingSpinner() {
    document.getElementById('loading-spinner').style.display = 'none';
  }

  async function fetchAndDisplayData(query, pageNumber) {
    if (!query.trim()) {
      searchResults.innerHTML = '';
      togglePaginationVisibility(false);
      hideLoadingSpinner();
      return;
    }

    // New API endpoint for fetching anime details
    const apiUrl = `https://ashanime-liart.vercel.app/api/v2/hianime/search?q=${encodeURIComponent(query)}&page=${pageNumber}`;

    console.log(apiUrl);
    showLoadingSpinner();

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`Error fetching data from API: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();

      // Use the new JSON structure:
      // data.data.animes holds the anime list,
      // and data.data.totalPages the total number of pages.
      const animes = data.data.animes || [];
      const filteredResults = filterResults(animes.slice(0, 20));

      displayImages(filteredResults);
      updateNextPageButton(animes.length, data.data.totalPages);
      return data.data.totalPages;
    } catch (error) {
      console.error('Error fetching data from API:', error.message);
    } finally {
      hideLoadingSpinner();
    }
  }

  const pagination = document.getElementById('pagination');
  
  nextPageButton.addEventListener('click', async () => {
    pageNumber++;
    await fetchAndDisplayData(query, pageNumber);
  });

  prevPageButton.addEventListener('click', async () => {
    pageNumber--;
    await fetchAndDisplayData(query, pageNumber);
  });

  // Determine if next page or previous page buttons should be enabled
  function updateNextPageButton(resultsCount, totalPages) {
    nextPageButton.disabled = pageNumber >= totalPages;
    prevPageButton.disabled = pageNumber <= 1;
  }

  // Display anime images and names
  function displayImages(results) {
    searchResults.innerHTML = '';

    if (results.length > 0) {
      results.forEach((item) => {
        const imgContainer = document.createElement('div');
        const img = document.createElement('img');
        // Use poster and name as provided by the new API response
        img.src = item.poster;
        img.alt = item.name;
        img.title = item.name;
        img.classList.add('search-result-image');
        img.tabIndex = 0;
        img.addEventListener('click', () => {
          sessionStorage.setItem('selectedAnime', JSON.stringify(item));
          window.location.href = `anime-details.html?animeId=${item.id}`;
        });
        img.addEventListener('keydown', function(event) {
          if (event.keyCode === 13) {
            sessionStorage.setItem('selectedAnime', JSON.stringify(item));
            window.location.href = `anime-details.html?animeId=${item.id}`;
          }
        });

        const name = document.createElement('span');
        name.textContent = item.name;
        name.classList.add('search-result-name');
        imgContainer.appendChild(img);
        imgContainer.appendChild(name);

        searchResults.appendChild(imgContainer);
      });

      togglePaginationVisibility(true);
    } else {
      const noResultsMessage = document.createElement('p');
      noResultsMessage.textContent = 'No results found. Please try a different search term.';
      searchResults.appendChild(noResultsMessage);
      togglePaginationVisibility(false);
    }
  }

  function togglePaginationVisibility(visible) {
    if (visible) {
      pagination.classList.remove('hidden');
    } else {
      pagination.classList.add('hidden');
    }
  }
});