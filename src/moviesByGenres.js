let data;
const apiKey = '42ee719896b25f8821890615eeabf17f';
const movieUrl = 'https://api.themoviedb.org/3/movie/';
const imageUrl = 'https://image.tmdb.org/t/p/original';
let movieIds;
let selectedGenres = [];
let selectedLogicCondition;

import('./moviesPlay.js')
  .then(res => {
    console.log('Data imported into data constant');
    data = res;
    populateGenres();
  });

function setLogicCondition() {
  const andConditionRadButton = document.getElementById("andCondition");
  const orConditionRadButton = document.getElementById("orCondition");

  if (andConditionRadButton.checked) {
    selectedLogicCondition = "AND";
   } else if (orConditionRadButton.checked) {
    selectedLogicCondition = "OR";
  } else {
    selectedLogicCondition = "";
  }
console.log(selectedLogicCondition);
}

function populateGenres() {
  const genres = data.genres;
  const genresContainer = document.getElementById('genres-container');

  genres.forEach(genre => {
    const genreCheckbox = document.createElement('input');
    genreCheckbox.type = 'checkbox';
    genreCheckbox.name = 'genre';
    genreCheckbox.value = genre.id;

    genreCheckbox.addEventListener('change', function() {
      if (genreCheckbox.checked) {
        selectedGenres.push(genre.id);
      } else {
        const index = selectedGenres.indexOf(genre.id);
        if (index !== -1) {
          selectedGenres.splice(index, 1);
        }
      }
      console.log('Selected Genres:', selectedGenres);
    });

    const genreLabel = document.createElement('label');
    genreLabel.appendChild(document.createTextNode(genre.name));

    genresContainer.appendChild(genreCheckbox);
    genresContainer.appendChild(genreLabel);
    genresContainer.appendChild(document.createElement('br'));
  });
}

function filterGenres() {
  let filteredMovies = [];
  if (selectedLogicCondition === "AND") {
    data.movies.forEach(movie => {
      const hasAllSelectedGenres = selectedGenres.every(genreId =>
        movie.genres.some(genre => genre.id === genreId)
      );

      if (hasAllSelectedGenres) {
        filteredMovies.push(movie);
      }
     });
     data.hindiMovies.forEach(movie => {
      const hasAllSelectedGenres = selectedGenres.every(genreId =>
        movie.genres.some(genre => genre.id === genreId)
      );

      if (hasAllSelectedGenres) {
        filteredMovies.push(movie);
      }
     });
  } else {
    selectedGenres.forEach(genreId => {
      const moviesWithGenre = data.movies.filter(movie =>
        movie.genres.some(genre => genre.id === genreId)
      );
      filteredMovies = filteredMovies.concat(moviesWithGenre);
    });
  }

  filteredMovies = Array.from(new Set(filteredMovies));
  movieIds = filteredMovies.map(movie => movie.tmdbId);
  console.log(filteredMovies);
  console.log(movieIds);

  getMovieInformation();
}

function getMovieInformation() {
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
  //console.log(movieHtml);
  return movieHtml;
}
