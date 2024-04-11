document.addEventListener('DOMContentLoaded', () => {
  const searchForm = document.getElementById('search-form');
  const searchResults = document.getElementById('search-results');
  const prevPageButton = document.getElementById('prev-page');
  const nextPageButton = document.getElementById('next-page');
  const toggleSwitch = document.querySelector('.switch input[type="checkbox"]');
  const toggleState = document.getElementById('toggle-state');

  let query = '';
  let pageNumber = 1;

  searchForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    query = event.target.search.value;
    pageNumber = 1;
    await fetchAndDisplayData(query, pageNumber);
  });

  toggleSwitch.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.keyCode === 13) {
      event.preventDefault(); // Prevent form submission
      toggleSwitch.click(); // Toggle the switch
    }
  });



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

  toggleSwitch.addEventListener('change', function() {
    localStorage.setItem('toggleState', JSON.stringify(this.checked));

    if (this.checked) {
      toggleState.textContent = 'Sub';
    } else {
      toggleState.textContent = 'Dub';
    }

    searchForm.dispatchEvent(new Event('submit', { cancelable: true }));
  });

  searchForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    query = event.target.search.value;
    pageNumber = 1;
    await fetchAndDisplayData(query, pageNumber);
  });

  function filterResults(results) {
    if (toggleSwitch.checked) {
      return results.filter(result => !result.title.toLowerCase().includes('(dub)'));
    } else {
      return results.filter(result => result.title.toLowerCase().includes('(dub)'));
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

    const primaryApiUrl = `https://api-consumet-org-six.vercel.app/anime/gogoanime/${query}?page=${pageNumber}&limit=21`;
    const fallbackUrl = `https://api.consumet.org/anime/gogoanime/${query}?page=${pageNumber}&limit=21`;

    console.log(primaryApiUrl);
    showLoadingSpinner();

    try {
      const response = await fetch(primaryApiUrl);

      if (!response.ok) {
        throw new Error(`Error fetching data from primary API: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const filteredResults = filterResults(data.results.slice(0, 20));

      displayImages(filteredResults);
      updateNextPageButton(data.results.length);

      return data.total_pages;
    } catch (primaryApiError) {
      console.error('Error fetching data from primary API:', primaryApiError.message);

      console.log('Fetching data from fallback API...');
      try {
        const fallbackResponse = await fetch(fallbackUrl);

        if (!fallbackResponse.ok) {
          throw new Error(`Error fetching data from fallback API: ${fallbackResponse.status} ${fallbackResponse.statusText}`);
        }

        const fallbackData = await fallbackResponse.json();
        const fallbackFilteredResults = filterResults(fallbackData.results.slice(0, 20));

        displayImages(fallbackFilteredResults);
        updateNextPageButton(fallbackData.results.length);

        return fallbackData.total_pages;
      } catch (fallbackApiError) {
        console.error('Error fetching data from fallback API:', fallbackApiError.message);
      }
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

  function updateNextPageButton(resultsCount) {
    nextPageButton.disabled = resultsCount <= 19;
    prevPageButton.disabled = pageNumber <= 1;
  }

  function displayImages(results) {
    searchResults.innerHTML = '';

    if (results.length > 0) {
      results.forEach((item) => {
        const imgContainer = document.createElement('div'); 
        const img = document.createElement('img');
        img.src = item.image;
        img.alt = item.title;
        img.title = item.title;
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
        name.textContent = item.title;
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
