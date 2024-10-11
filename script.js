const API_URL = 'https://api.themoviedb.org/3/movie/popular?api_key=ac559daa4ef1341c6e1cc2b10f80169c';
const IMG_URL = 'https://image.tmdb.org/t/p/w200'; // Para las imágenes de las películas
const popularMoviesContainer = document.getElementById('popular-movies');
const movieDetailsContainer = document.getElementById('movie-details');

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
    popularMoviesContainer.innerHTML = '<h2>Películas Populares</h2>'; // Asegura que el título permanezca
    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');
        movieCard.innerHTML = `
            <img src="${IMG_URL}${movie.poster_path}" alt="${movie.title}">
            <h3>${movie.title}</h3>
        `;
        movieCard.addEventListener('click', () => showMovieDetails(movie));
        popularMoviesContainer.appendChild(movieCard);
    });
}

function showMovieDetails(movie) {
    // Muestra los detalles de la película en el contenedor de detalles
    movieDetailsContainer.style.display = 'block';
    movieDetailsContainer.innerHTML = `
        <h2>Detalles de la Película</h2>
        <img src="${IMG_URL}${movie.poster_path}" alt="${movie.title}">
        <h3>${movie.title}</h3>
        <p>${movie.overview}</p>
        <p><strong>Fecha de lanzamiento:</strong> ${movie.release_date}</p>
    `;
}

