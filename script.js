const API_KEY = 'ac559daa4ef1341c6e1cc2b10f80169c'; // Inserta tu API Key aquí
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const popularMoviesContainer = document.getElementById('movie-list');
const movieDetailsContainer = document.getElementById('movie-details');
const favoriteMoviesContainer = document.getElementById('favorite-movies');

let favoriteMovies = [];

// Función para obtener las películas populares
async function fetchPopularMovies() {
  const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}`);
  const data = await response.json();
  displayMovies(data.results);
}

// Función para mostrar las películas populares
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

// Función para mostrar detalles de la película seleccionada
async function showMovieDetails(movieId) {
  const response = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`);
  const movie = await response.json();
  
  const movieDetails = `
    <h2>${movie.title}</h2>
    <img src="${IMG_URL}${movie.poster_path}" alt="${movie.title}">
    <p>${movie.overview}</p>
    <p>Fecha de lanzamiento: ${movie.release_date}</p>
    <button onclick="addToFavorites('${movie.title}')">Agregar a Favoritos</button>
  `;
  movieDetailsContainer.innerHTML = movieDetails;
}

// Función para buscar películas
async function searchMovies(query) {
  const response = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}`);
  const data = await response.json();
  displayMovies(data.results);
}

// Función para agregar películas a favoritos
function addToFavorites(movieTitle) {
  if (!favoriteMovies.includes(movieTitle)) {
    favoriteMovies.push(movieTitle);
    displayFavoriteMovies();
  }
}

// Función para mostrar las películas favoritas
function displayFavoriteMovies() {
  favoriteMoviesContainer.innerHTML = '';
  favoriteMovies.forEach(movie => {
    favoriteMoviesContainer.innerHTML += `<li>${movie}</li>`;
  });
}

// Agregar event listener al botón de búsqueda
const searchButton = document.getElementById('search-button');
searchButton.addEventListener('click', () => {
  const query = document.getElementById('search-input').value;
  searchMovies(query);
});

// Inicializar cargando las películas populares
fetchPopularMovies();
