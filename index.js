let data;
const apiKey = '42ee719896b25f8821890615eeabf17f';
const movieUrl = 'https://api.themoviedb.org/3/movie/';
const imageUrl = 'https://image.tmdb.org/t/p/original';
let movieIds;
let movieIdsAfterDecadeFilter;
let movieIdsAfterSearchFilter;
let filterByGenresIds;
let selectedLanguage;
let selectedGenres = [];
let selectedLogicCondition;
let hindiMoviesData;

import('./src/moviesPlay.js')
  .then(res => {
    console.log('Data imported into data constant');
    data = res;
    hindiMoviesData = res.hindiMovies;
    run();
    populateGenres();
  });

function run() {
  const movies = data.movies;
  const decades = getDecadesArray(movies);
  decades.sort();
  populateDecadeDropdown(decades);
}

function getDecadesArray(movies) {
  const decadesSet = new Set(); //[1990 -1999, 2000 -2009]
  movies.forEach(movie => {
    const decade = getDecade(movie.releaseDate);
    decadesSet.add(decade);
  });
  return Array.from(decadesSet);
  
}

function populateDecadeDropdown(decades) {
  const dropdown = document.getElementById('decadeDropdown');
  decades.forEach(decade => {
    const option = document.createElement('option');
    option.value = decade;
    option.textContent = decade;
    dropdown.appendChild(option);
  });
}

function filterMovies() {
  selectedLanguage = document.querySelector('input[name="fav_language"]:checked').value;
  if (selectedLanguage === "International") {
    movieIds = data.movies.map(movie => movie.tmdbId);
  } else if (selectedLanguage === "Hindi") {
    movieIds = data.hindiMovies.map(movie => movie.tmdbId);
  } else if (selectedLanguage === "Both") {
    const internationalMovieIds = data.movies.map(movie => movie.tmdbId);
    const hindiMovieIds = data.hindiMovies.map(movie => movie.tmdbId);
    movieIds = internationalMovieIds.concat(hindiMovieIds);
  }
  getMovieInformation(movieIds);
}

function filterDecade() {
  if (selectedLanguage == 'International') {
    const selectedDecade = document.getElementById('decadeDropdown').value;
    const filterMovieId = data.movies.filter(movie => getDecade(movie.releaseDate) === selectedDecade);
    movieIds = filterMovieId.map(movie => movie.tmdbId);
  } else if (selectedLanguage == 'Hindi') {
    const selectedDecade = document.getElementById('decadeDropdown').value;
    const filterMovieId = data.hindiMovies.filter(movie => getDecade(movie.releaseDate) === selectedDecade);
    movieIds = filterMovieId.map(movie => movie.tmdbId);
  } else if (selectedLanguage == 'Both') {
    const selectedDecade = document.getElementById('decadeDropdown').value;
    const internationalMovieIds = data.movies.filter(movie => getDecade(movie.releaseDate) === selectedDecade);
    const hindiMovieIds = data.hindiMovies.filter(movie => getDecade(movie.releaseDate) === selectedDecade);
    const concatemovieIds = internationalMovieIds.concat(hindiMovieIds);
    movieIds = concatemovieIds.map(movie => movie.tmdbId);
  }
  console.log('Filtered Movie Ids in Decade: ', movieIds);
  movieIdsAfterDecadeFilter = movieIds;
  getMovieInformation();
}

function filterMoviesByDecade(movies, decade) {
  return movies.filter(movie => getDecade(movie.releaseDate) === decade);
}

function getDecade(releaseDate) {
  const year = new Date(releaseDate).getFullYear();
  const decade = Math.floor(year / 10) * 10;
  return `${decade}-${decade + 9}`;
}

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
  console.log('Selected Logic Condition', selectedLogicCondition);
}

function populateGenres() {
  const genres = data.genres;
  const genresContainer = document.getElementById('genres-container');
  genres.forEach(genre => {
    const genreCheckbox = document.createElement('input');
    genreCheckbox.type = 'checkbox';
    genreCheckbox.name = 'genre';
    genreCheckbox.value = genre.id;
    genreCheckbox.addEventListener('change', function () {
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

function filterMoviesByTitleOrCast() {
  const filterText = document.getElementById('filterInput').value.toLowerCase();
  console.log('filterText=', filterText);

  const filteredMovies = movieIdsAfterDecadeFilter.reduce((result, movieId) => {
    const movie = data.movies.find(m => m.tmdbId === movieId) ||
      data.hindiMovies.find(m => m.tmdbId === movieId);

    if (movie) {
      const matchesTitle = movie.title.toLowerCase().includes(filterText);
      const matchesCast = movie.cast.some(actor => actor.name.toLowerCase().includes(filterText));

      if (matchesTitle || matchesCast) {
        result.push(movie);
      }
    }

    return result;
  }, []);

  document.getElementById('content').innerHTML = getMovieHtml(filteredMovies);
  movieIds = filteredMovies.map(movie => movie.tmdbId);
  movieIdsAfterSearchFilter = movieIds;
  getMovieInformation();
}

function filterGenres() {
  let filteredMovieIds = [];
  if (selectedLogicCondition === "AND") {
    filteredMovieIds = movieIdsAfterSearchFilter.reduce((result, movieId) => {
      const movie = data.movies.find(movie => movie.tmdbId === movieId) ||
        data.hindiMovies.find(movie => movie.tmdbId === movieId);

      if (movie) {
        const hasAllSelectedGenres = selectedGenres.every(genreId =>
          movie.genres.some(genre => genre.id === genreId)
        );

        if (hasAllSelectedGenres) {
          result.push(movieId);
        }
      }
      return result;
    }, []);
  } else {
    selectedGenres.forEach(genreId => {
      const moviesWithGenre = movieIdsAfterSearchFilter.filter(movieId => {
        const movie = data.movies.find(movie => movie.tmdbId === movieId) ||
          data.hindiMovies.find(movie => movie.tmdbId === movieId);

        return movie && movie.genres.some(genre => genre.id === genreId);
      });

      // Avoid duplicates when concatenating arrays
      filteredMovieIds = [...new Set([...filteredMovieIds, ...moviesWithGenre])];
    });
  }
  console.log('Filtered Movie Ids after genre:', filteredMovieIds);
  movieIds = filteredMovieIds;
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
          id: resp.id, overview: resp.overview,
          posterPath: resp.poster_path, releaseDate: resp.release_date,
          runTime: resp.runtime, tagLine: resp.tagline,
          title: resp.title
        };
      });
      console.log(moviesInfo);
      document.getElementById('content').innerHTML = getMovieHtml(moviesInfo);
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
