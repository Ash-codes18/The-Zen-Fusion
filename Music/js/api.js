const apiUrl = 'https://music-api-sigma-one.vercel.app/api/search/songs?query=${wannabe+why+mona}';

fetch(apiUrl)
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      const results = data.data.results.slice(0, 10); 
      results.forEach(song => {
        console.log('Song Name:', song.name);
        console.log('Release Date:', song.year);
        console.log('Duration:', song.duration + ' seconds');
        console.log('Singers:');
        song.artists.all.forEach(artist => {
          console.log(artist.name);
        });
        console.log('Thumbnail Image URL:', song.image.find(img => img.quality === '500x500').url);
        const downloadUrl = song.downloadUrl.find(url => url.quality === '320kbps');
        console.log('Download URL (320kbps):', downloadUrl.url);
        console.log('------------------------------------');
      });
    } else {
      console.log('Failed to retrieve data from the API');
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });