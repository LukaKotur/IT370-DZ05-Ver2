$(function () {
    $("#navbar").load("navbar.html");
})


function getMovies() {
    axios.get('https://api.themoviedb.org/3/discover/movie?api_key=fa155f635119344d33fcb84fb807649b&sort_by=popularity.desc').then((response) => {
        var movies = response.data.results;
        console.log(movies);
        var output = '';
        var modal = '';
        $.each(movies, function (index, movie) {
            output += `
                <div class="col-md-3 " style="margin-bottom: 15px;">
                    <div class="card">
                      <img class="card-img-top img-fluid" src="http://image.tmdb.org/t/p/w1000/${movie.poster_path}">
                      <div class="card-block">
                        <h4 class="card-title"><a onclick="movieSelected('${movie.id}')" style="cursor:pointer;">${movie.title}</a></h4>
                        <p class="card-text">Rating: ${movie.vote_average}</p>
                        <div class="container buttons">
                            <a onclick="movieSelected('${movie.id}')" class="btn btn-outline-primary col-md-12 col-xs-12" href="#" style="margin-bottom: 15px;">Movie Details</a>
                            <button onclick="makeModal(${movie.id})" type="button" class="btn btn-outline-success col-md-12 col-xs-12" data-toggle="modal" data-target="#${movie.id}" style="cursor:pointer;">Quick View</button>
                        </div>
                      </div>
                    </div>
                </div>
            `;
        });


        $('#modal').html(modal);
        $('#movies').html(output);
    }).catch((err) => {
        console.log(err);
    });
}

function movieSelected(id) {
    sessionStorage.setItem('movieId', id);
    window.location = 'moviedetail.html';
    return false;
}

function makeModal(movieId) {

    var modal = '';
    axios.get('https://api.themoviedb.org/3/movie/' + movieId + '?api_key=fa155f635119344d33fcb84fb807649b').then((response) => {
        let movie = response.data;
        var genres = '';
        $.each(movie.genres, function (k, v) {
            genres += v.name + ', ';

        });
        genres = genres.substring(0, genres.length - 2);
        console.log(response);
        modal += `
            
                <div class="modal-dialog modal-lg" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">${movie.title}</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <div class="text-center" style="margin-bottom: 15px;">                           
                             <img src="http://image.tmdb.org/t/p/w1000/${movie.backdrop_path}" alt="" class="img-fluid" >
                             </div>
                            <ul class="list-group">
                                <li class="list-group-item">
                                    <span><strong>Genre: </strong> ${genres}</span>
                                </li>
                                <li class="list-group-item">
                                   <span> <strong>Release Date: </strong> ${movie.release_date}</span>
                                </li>
                                <li class="list-group-item">
                                   <span> <strong>Status: </strong> ${movie.status}</span>
                                </li>
                                <li class="list-group-item">
                                    <span><strong>Tagline: </strong> "${movie.tagline}"</span>
                                </li>
                                <li class="list-group-item">
                                    <span style="text-align: justify"><strong>Overview: </strong> ${movie.overview}</span>
                                </li>
                            </ul>
                        </div>
                        <div class="modal-footer">
                            <button onclick="movieSelected('${movie.id}')" type="button" class="btn btn-outline-success mr-auto" style="cursor:pointer;">View Details</button>
                            <button type="button" class="btn btn-outline-primary" style="cursor:pointer;" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            
            `

        $("#modal").html(modal);
        $("#modal").modal('show');
    });

}

function getMovie() {
    let movieId = sessionStorage.getItem('movieId');

    axios.get('https://api.themoviedb.org/3/movie/' + movieId + '?api_key=fa155f635119344d33fcb84fb807649b&append_to_response=credits').then((response) => {
        console.log(response);
        let movie = response.data;
        genres = '';
        productionCompanies = ''
        $.each(movie.genres, function (k, v) {
            genres += v.name + ', ';

        });
        var actors = '';
        for(var i = 0; i < 5; i++){
            actors += movie.credits.cast[i].name +', ';
        }

        $.each(movie.production_companies, function (k, v) {
            productionCompanies += v.name + ', ';

        });
        genres = genres.substring(0, genres.length - 2);
        actors = actors.substring(0, actors.length - 2);
        productionCompanies = productionCompanies.substring(0, productionCompanies.length - 2);

        let output = `
            <div class=row style="margin-top:15px">
                <div class="col-md-4">
                    <img class="img-fluid" src="http://image.tmdb.org/t/p/w1000/${movie.poster_path}">
                    <div class="ml-auto text-center" style="margin-top: 20px;">
                        <a href="${movie.homepage}" target="_blank"  class="btn btn-outline-success" style="width: 100%; margin-bottom:15px;">Visit Movie Site</a>
                        <a href="index.html" class="btn btn-outline-primary" style="width: 100%;">Go back </a>
                    </div>
                </div>
                <div class="col-md-8">
                    <h2>${movie.title}</h2>
                    <ul class="list-group">
                        <li class="list-group-item">
                            <span><strong>Genre: </strong> ${genres}</span>
                        </li>
                        <li class="list-group-item">
                           <span> <strong>Release Date: </strong> ${movie.release_date}</span>
                        </li>
                        <li class="list-group-item">
                           <span> <strong>Status: </strong> ${movie.status}</span>
                        </li>
                        <li class="list-group-item">
                            <span><strong>Tagline: </strong> "${movie.tagline}"</span>
                        </li>
                        <li class="list-group-item">
                            <span style="text-align: justify"><strong>Overview: </strong> ${movie.overview}</span>
                        </li>
                        <li class="list-group-item">
                            <span><strong>Homepage: </strong> <a href="${movie.homepage}" target="_blank">${movie.homepage}</a></span>
                        </li>
                        <li class="list-group-item">
                            <span><strong>Production Companies: </strong> ${productionCompanies}</span>
                        </li>
                        <li class="list-group-item">
                            <span><strong>Average rating: </strong> ${movie.vote_average} <br><strong>Rated: </strong> ${movie.vote_count} times</span>
                        </li>
                        <li class="list-group-item">
                            <span><strong>Runtime: </strong> ${movie.runtime} minutes</span>
                        </li>
                        <li class="list-group-item">
                            <span><strong>IMDB link: </strong> <a href = "http://www.imdb.com/title/${movie.imdb_id}" target="_blank">Link</a></span>
                        </li>
                        <li class="list-group-item">
                            <span><strong>Actors: </strong> ${actors}</span>
                        </li>
                        
                    </ul>
                </div>
            </div>
        `;



        $('#movie').html(output);

    }).catch((err) => {
        console.log(err);
    });
}