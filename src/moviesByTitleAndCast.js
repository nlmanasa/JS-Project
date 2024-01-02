let data;
const apiKey = '42ee719896b25f8821890615eeabf17f';
const movieUrl = 'https://api.themoviedb.org/3/movie/';
const imageUrl = 'https://image.tmdb.org/t/p/original';
let movieIds;
let hindiMoviesData;

import('./moviesPlay.js')
  .then(res => {
    console.log('Data imported into data constant');
    data = res.movies;
    hindiMoviesData = res.hindiMovies;
  });

function filterMovies() {
  const filterText = document.getElementById('filterInput').value.toLowerCase();
  console.log('filterText=', filterText);
  const filteredInternationalMovies = data.filter(movie =>
    movie.title.toLowerCase().includes(filterText) ||
    movie.cast.some(actor => actor.name.toLowerCase().includes(filterText))
  );
  console.log('filteredInternationalMovies', filteredInternationalMovies);
  const filteredHindiMovies = hindiMoviesData.filter(movie =>
    movie.title.toLowerCase().includes(filterText) ||
    movie.cast.some(actor => actor.name.toLowerCase().includes(filterText))
  );
  const filteredMovies = filteredInternationalMovies.concat(filteredHindiMovies);
 document.getElementById('resultContainer').innerHTML = getMovieHtml(filteredMovies);
  console.log('filteredMovies', filteredMovies);
  getMovieInformation(filteredMovies);
}

function getMovieInformation(filteredMovies) {
  movieIds = filteredMovies.map(movie => movie.tmdbId);
  const fetchArray = movieIds.map(movieId => {
    return (
      fetch(`${movieUrl}${movieId}?api_key=${apiKey}`)
        .then(response => response.json())
    );
  });
  Promise.all(fetchArray)
    .then(fetchResponses => {
      const moviesInfo = fetchResponses.map(resp => {
        return {
          id: resp.id,
          overview: resp.overview,
          posterPath: resp.poster_path,
          releaseDate: resp.release_date,
          runTime: resp.runtime,
          tagLine: resp.tagline,
          title: resp.title
          //cast: resp.cast // Assuming cast information is available in the API response
        };
      });
      console.log(moviesInfo);
      document.getElementById('resultContainer').innerHTML = getMovieHtml(moviesInfo);
    });
}

function getMovieHtml(moviesInfo) {
  let movieHtml = '<div class="ui link cards">';

  const movieCards = moviesInfo.reduce((html, movie) => {
    return html + `
      <div class="card">
        <div class="image">
          <a href='./movie.html?id=${movie.id}&posterPath=${movie.posterPath}'>
          <img src='${imageUrl}${movie.posterPath}' />
          </a>
        </div>
        <div class="content">
          <div class="header">${movie.title}</div>
          <div class="meta">
            <a>${movie.releaseDate}</a>
          </div>
          <div class="description">
            ${movie.tagLine}
          </div>
        </div>
      </div>
    `;
  }, '');

  movieHtml += `${movieCards}</div>`;
  return movieHtml;
}
