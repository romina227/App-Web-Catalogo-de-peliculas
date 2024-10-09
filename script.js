const API_KEY = 'ac559daa4ef1341c6e1cc2b10f80169c';
const BASE_URL = 'https://api.themoviedb.org/3';
const API_URL = BASE_URL + '/discover/movie?sort_by=popularity.desc&api_key=' + API_KEY;
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const searchURL = BASE_URL + '/search/movie?api_key=' + API_KEY;

const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');

getMovies(API_URL);

function getMovies(url) {
    fetch(url).then(res => res.json()).then(data => {
        showMovies(data.results);
    })
}

function showMovies(data) {
    main.innerHTML = '';

    data.forEach(movie => {
        const {title, poster_path, vote_average, overview, id} = movie;
        const movieEl = document.createElement('div');
        movieEl.classList.add('movie');
        movieEl.innerHTML = `
            <img src="${poster_path? IMG_URL+poster_path: "http://via.placeholder.com/1080x1580" }" alt="${title}">
            <div class="movie-info">
                <h3>${title}</h3>
                <span class="${getColor(vote_average)}">${vote_average}</span>
            </div>
            <div class="overview">
                <h3>Overview</h3>
                ${overview}
                <br/> 
                <button class="know-more" id="${id}">Know More</button>
            </div>
        `

        main.appendChild(movieEl);

        document.getElementById(id).addEventListener('click', () => {
            openNav(movie)
        })
    })
}

function getColor(vote) {
    if(vote>= 8){
        return 'green'
    }else if(vote >= 5){
        return "orange"
    }else{
        return 'red'
    }
}

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const searchTerm = search.value;
    
    if(searchTerm) {
        getMovies(searchURL+'&query='+searchTerm)
    }else{
        getMovies(API_URL);
    }
})

function openNav(movie) {
    let id = movie.id;
    fetch(BASE_URL + '/movie/'+id+'?api_key='+API_KEY).then(res => res.json())
    .then(movieData => {
        console.log(movieData);
        const modalContent = document.createElement('div');
        modalContent.classList.add('modal-content');
        modalContent.innerHTML = `
            <span class="close">&times;</span>
            <img class="modal-movie-poster" src="${IMG_URL+movieData.poster_path}" alt="${movieData.title}">
            <div class="modal-movie-info">
                <h2>${movieData.title}</h2>
                <p><strong>Release Date:</strong> ${movieData.release_date}</p>
                <p><strong>Runtime:</strong> ${movieData.runtime} minutes</p>
                <p><strong>Rating:</strong> ${movieData.vote_average}</p>
                <p><strong>Overview:</strong> ${movieData.overview}</p>
            </div>
        `;

        const modal = document.createElement('div');
        modal.classList.add('modal');
        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        modal.style.display = "block";

        const closeBtn = modalContent.querySelector('.close');
        closeBtn.onclick = function() {
            document.body.removeChild(modal);
        }

        window.onclick = function(event) {
            if (event.target == modal) {
                document.body.removeChild(modal);
            }
        }
    })
}