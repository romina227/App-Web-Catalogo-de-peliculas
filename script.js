const apiKey = 'ac559daa4ef1341c6e1cc2b10f80169c';
const apiUrl = 'https://api.themoviedb.org/3';
const movieList = document.querySelector('.movie-list');
const movieDetails = document.querySelector('.movie-details');
const favoritesList = document.querySelector('.favorites-list');
const addToFavoritesButton = document.getElementById('add-to-favorites');

let selectedMovieId = null;
let favoriteMovies = JSON.parse(localStorage.getItem('favorites')) || [];

// Función para obtener y mostrar películas populares
async function fetchPopularMovies() {
    try {
        const response = await fetch(`${apiUrl}/movie/popular?api_key=${apiKey}`);
        const data = await response.json();
        displayMovies(data.results);
    } catch (error) {
        console.error('Error al obtener películas populares:', error);
    }
}

// Función para mostrar las películas
function displayMovies(movies) {
    movieList.innerHTML = '';
    movies.forEach(movie => {
        const li = document.createElement('li');
        li.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
            <span>${movie.title}</span>
            <button data-movie-id="${movie.id}">Ver detalles</button>
        `;
        li.querySelector('button').addEventListener('click', (event) => {
            const movieId = event.target.dataset.movieId;
            showMovieDetails(movieId);
        });
        movieList.appendChild(li);
    });
}

// Función para mostrar los detalles de una película
async function showMovieDetails(movieId) {
    try {
        const response = await fetch(`${apiUrl}/movie/${movieId}?api_key=${apiKey}`);
        const data = await response.json();

        movieDetails.classList.add('show');
        movieList.classList.add('hide');

        movieDetails.querySelector('h3').textContent = data.title;
        movieDetails.querySelector('img').src = `https://image.tmdb.org/t/p/w500${data.poster_path}`;
        movieDetails.querySelector('p').textContent = data.overview;

        addToFavoritesButton.dataset.movieId = movieId;
    } catch (error) {
        console.error('Error al obtener detalles de la película:', error);
    }
}

// Función para agregar una película a favoritos
function addToFavorites() {
    const movieId = addToFavoritesButton.dataset.movieId;
    const favoriteMovie = {
        id: movieId,
        title: document.querySelector('.movie-details h3').textContent
    };
    if (!favoriteMovies.some(movie => movie.id === movieId)) {
        favoriteMovies.push(favoriteMovie);
        localStorage.setItem('favorites', JSON.stringify(favoriteMovies));
        displayFavorites();
    }
}

// Función para mostrar las películas favoritas
function displayFavorites() {
    const favoritesListUl = document.querySelector('.favorites-list ul');
    favoritesListUl.innerHTML = '';
    favoriteMovies.forEach(movie => {
        const li = document.createElement('li');
        li.textContent = movie.title;
        favoritesListUl.appendChild(li);
    });
}

// Event listener para el botón "Agregar a favoritos"
addToFavoritesButton.addEventListener('click', addToFavorites);

// Obtener y mostrar las películas populares al cargar la página
fetchPopularMovies();
displayFavorites();
