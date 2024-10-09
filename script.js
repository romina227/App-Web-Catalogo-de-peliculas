const apiKey = 'YOUR API KEY'; // Reemplaza con tu clave API
const apiUrl = 'https://api.themoviedb.org/3';
const movieList = document.getElementById('movies');
const movieDetails = document.getElementById('movie-details');
const detailsContainer = document.getElementById('details');
const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('search-input');
const favoritesList = document.getElementById('favorites-list');
const addToFavoritesButton = document.getElementById('add-to-favorites');
let selectedMovieId = null;
let favoriteMovies = JSON.parse(localStorage.getItem('favorites')) || [];

// Fetch and display popular movies
async function fetchPopularMovies() {
    try {
        const response = await fetch(`${apiUrl}/movie/popular?api_key=${apiKey}&language=es-ES&page=1`);
        if (!response.ok) {
            throw new Error('Error en la respuesta de la API');
        }
        const data = await response.json();
        displayMovies(data.results);
    } catch (error) {
        console.error('Error fetching popular movies:', error);
        movieList.innerHTML = '<p>Error al cargar las películas populares. Por favor, intenta de nuevo más tarde.</p>';
    }
}

// Display movies
function displayMovies(movies) {
    movieList.innerHTML = ''; // Limpia la lista de películas
    movies.forEach(movie => {
        const li = document.createElement('li');
        li.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" onerror="this.src='placeholder.jpg'">
            <span>${movie.title}</span>
        `;
        li.onclick = () => showMovieDetails(movie.id); // Muestra detalles al hacer clic en la película
        movieList.appendChild(li);
    });
}

// Show movie details
async function showMovieDetails(movieId) {
    try {
        const response = await fetch(`${apiUrl}/movie/${movieId}?api_key=${apiKey}&language=es-ES`);
        if (!response.ok) {
            throw new Error('Error en la respuesta de la API');
        }
        const movie = await response.json();
        selectedMovieId = movie.id;
        detailsContainer.innerHTML = `
            <h3>${movie.title}</h3>
            <p><strong>Fecha de lanzamiento:</strong> ${movie.release_date}</p>
            <p><strong>Puntuación:</strong> ${movie.vote_average}/10</p>
            <p><strong>Resumen:</strong> ${movie.overview}</p>
        `;
        movieDetails.style.display = 'block';
    } catch (error) {
        console.error('Error fetching movie details:', error);
        detailsContainer.innerHTML = '<p>Error al cargar los detalles de la película. Por favor, intenta de nuevo más tarde.</p>';
    }
}

// Search movies
searchButton.addEventListener('click', async () => {
    const query = searchInput.value.trim();
    if (query) {
        try {
            const response = await fetch(`${apiUrl}/search/movie?api_key=${apiKey}&language=es-ES&query=${encodeURIComponent(query)}&page=1`);
            if (!response.ok) {
                throw new Error('Error en la respuesta de la API');
            }
            const data = await response.json();
            if (data.results.length === 0) {
                movieList.innerHTML = '<p>No se encontraron películas con ese título. Intenta con otra búsqueda.</p>';
            } else {
                displayMovies(data.results);
            }
        } catch (error) {
            console.error('Error searching movies:', error);
            movieList.innerHTML = '<p>Error al buscar películas. Por favor, intenta de nuevo más tarde.</p>';
        }
    } else {
        alert('Por favor, ingresa un título de película para buscar.');
    }
});

// Add movie to favorites
addToFavoritesButton.addEventListener('click', () => {
    if (selectedMovieId) {
        const favoriteMovie = {
            id: selectedMovieId,
            title: document.querySelector('#details h3').textContent
        };
        if (!favoriteMovies.some(movie => movie.id === selectedMovieId)) {
            favoriteMovies.push(favoriteMovie);
            localStorage.setItem('favorites', JSON.stringify(favoriteMovies)); // Guarda en localStorage
            displayFavorites(); // Muestra la lista actualizada de favoritos
            alert('Película añadida a favoritos.');
        } else {
            alert('Esta película ya está en tus favoritos.');
        }
    } else {
        alert('Por favor, selecciona una película primero.');
    }
});

// Display favorite movies
function displayFavorites() {
    favoritesList.innerHTML = ''; // Limpia la lista de favoritos
    favoriteMovies.forEach(movie => {
        const li = document.createElement('li');
        li.textContent = movie.title;
        li.onclick = () => showMovieDetails(movie.id);
        favoritesList.appendChild(li);
    });
}

// Initial fetch of popular movies and display favorites
fetchPopularMovies(); // Obtiene y muestra las películas populares
displayFavorites(); // Muestra las películas favoritas guardadas