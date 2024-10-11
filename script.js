const API_URL = 'https://api.themoviedb.org/3/movie/popular?api_key=ac559daa4ef1341c6e1cc2b10f80169c';
const IMG_URL = 'https://image.tmdb.org/t/p/w200';
const popularMoviesContainer = document.getElementById('popular-movies');
const movieDetailsContainer = document.getElementById('movie-details');
const favoritesContainer = document.getElementById('favorites');

// Oculta inicialmente el contenedor de detalles de la película
movieDetailsContainer.style.display = 'none';

document.addEventListener('DOMContentLoaded', fetchPopularMovies);

function fetchPopularMovies() {
    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            displayPopularMovies(data.results);
        })
        .catch(error => console.error('Error al cargar películas populares:', error));
}

function displayPopularMovies(movies) {
    popularMoviesContainer.innerHTML = ''; // Limpia el contenedor
    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');

        const moviePoster = movie.poster_path 
            ? `<img src="${IMG_URL}${movie.poster_path}" alt="${movie.title}">`
            : `<img src="placeholder.jpg" alt="Imagen no disponible">`;

        movieCard.innerHTML = `
            ${moviePoster}
            <h3>${movie.title}</h3>
        `;
        movieCard.addEventListener('click', () => showMovieDetails(movie));
        popularMoviesContainer.appendChild(movieCard);
    });
}

function showMovieDetails(movie) {
    movieDetailsContainer.style.display = 'block'; // Muestra el contenedor de detalles
    
    const moviePoster = movie.poster_path 
        ? `<img src="${IMG_URL}${movie.poster_path}" alt="${movie.title}">`
        : `<img src="placeholder.jpg" alt="Imagen no disponible">`;
    
    const movieOverview = movie.overview 
        ? movie.overview
        : 'Descripción no disponible';

    movieDetailsContainer.innerHTML = `
        <h2>Detalles de la Película</h2>
        ${moviePoster}
        <h3>${movie.title}</h3>
        <p>${movieOverview}</p>
        <p><strong>Fecha de lanzamiento:</strong> ${movie.release_date}</p>
        <button id="add-to-favorites">Agregar a Favoritos</button>
    `;

    // Agregar evento al botón de "Agregar a Favoritos"
    document.getElementById('add-to-favorites').addEventListener('click', () => addToFavorites(movie));
}

function addToFavorites(movie) {
    const favoriteMovieCard = document.createElement('div');
    favoriteMovieCard.classList.add('movie-card');

    const moviePoster = movie.poster_path 
        ? `<img src="${IMG_URL}${movie.poster_path}" alt="${movie.title}">`
        : `<img src="placeholder.jpg" alt="Imagen no disponible">`;

    favoriteMovieCard.innerHTML = `
        ${moviePoster}
        <h3>${movie.title}</h3>
    `;

    favoritesContainer.appendChild(favoriteMovieCard);
}
