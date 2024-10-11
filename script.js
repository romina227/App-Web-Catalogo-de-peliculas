const API_KEY = 'ac559daa4ef1341c6e1cc2b10f80169c';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const popularMoviesContainer = document.getElementById('movie-list');
const movieDetailsContainer = document.getElementById('movie-details');
const favoriteMoviesContainer = document.getElementById('favorite-movies');
const searchInput = document.getElementById('search-input');
let favoriteMovies = JSON.parse(localStorage.getItem('favoriteMovies')) || [];

async function fetchPopularMovies() {
  const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}`);
  const data = await response.json();
  displayMovies(data.results);
}

function displayMovies(movies) {
  popularMoviesContainer.innerHTML = '';
  movies.forEach(movie => {
    const movieCard = `
      <div class="movie-card" onclick="showMovieDetails(${movie.id})">
        <img src="${IMG_URL}${movie.poster_path}" alt="${movie.title}">
        <h3>${movie.title}</h3>
      </div>
    `;
    popularMoviesContainer.innerHTML += movieCard;
  });
}

async function showMovieDetails(movieId) {
  const response = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`);
  const movie = await response.json();
  
  const movieDetails = `
    <h2>${movie.title}</h2>
    <img src="${IMG_URL}${movie.poster_path}" alt="${movie.title}">
    <p>${movie.overview}</p>
    <p>Fecha de lanzamiento: ${movie.release_date}</p>
    <button onclick="toggleFavorite('${movie.title}')">
      ${favoriteMovies.includes(movie.title) ? 'Quitar de Favoritos' : 'Agregar a Favoritos'}
    </button>
  `;
  movieDetailsContainer.innerHTML = movieDetails;
}

async function searchMovies(query) {
  const response = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}`);
  const data = await response.json();
  displayMovies(data.results);
}

function toggleFavorite(movieTitle) {
  const index = favoriteMovies.indexOf(movieTitle);
  if (index === -1) {
    favoriteMovies.push(movieTitle);
  } else {
    favoriteMovies.splice(index, 1);
  }
  localStorage.setItem('favoriteMovies', JSON.stringify(favoriteMovies));
  displayFavoriteMovies();
  showMovieDetails(document.querySelector('.movie-card').getAttribute('onclick').match(/\d+/)[0]);
}

function displayFavoriteMovies() {
  favoriteMoviesContainer.innerHTML = '<h2>Películas Favoritas</h2>';
  favoriteMovies.forEach(movie => {
    favoriteMoviesContainer.innerHTML += `<li>${movie}</li>`;
  });
}

searchInput.addEventListener('input', (e) => {
  if (e.target.value.length > 2) {
    searchMovies(e.target.value);
  } else if (e.target.value.length === 0) {
    fetchPopularMovies();
  }
});

fetchPopularMovies();
displayFavoriteMovies();
