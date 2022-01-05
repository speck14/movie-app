import React, { useState, useEffect, useRef } from "react";
import "./index.css";
import AddMovie from "./addmovie.js";

var Movie = ({ name }) => <li>{name}</li>;

var MovieGenres = ({ genreName }) => <li>{genreName}</li>;

function ListMovies() {
  var [allMovieGenres, setAllMovieGenres] = useState([]);
  var [movies, setMovies] = useState([]);
  var [viewMovie, setViewMovie] = useState(false);
  var [addMovieView, setAddMovieView] = useState(false);
  var selectedMovie = useRef({});
  var selectedMovieGenres = useRef([]);

  useEffect(() => {
    //fetch all movies from server
    async function getMovies() {
      var res = await fetch("http://localhost:5000/movies");
      var data = await res.json();
      //fetches data, sets state to data (the JSON response)
      setMovies(data);
    }
    async function getAllGenres() {
      var res = await fetch(`http://localhost:5000/genres`);
      var data = await res.json();
      setAllMovieGenres(data);
    }
    //fetch all genres from server
    getMovies()
      .then(getAllGenres())
      .catch((err) => {
        if (err) throw err;
      });
  }, []);

  //remember: 1) page renders 2) browser paints page 3) REACT STATES CHANGE
  //this is rendering the initial state, not the changed one- HOW TO FIX THAT?

  //runs when add movie button is clicked
  function handleAddMovieClick(e) {
    e.preventDefault();
    setAddMovieView(true);
  }

  //runs when movie is clicked
  function handleMovieViewClick() {
    //compare selected movie's genre foreign keys to all genres for matches
    async function getCurrentMovieGenres(allGenres) {
      var movieGenres = await allGenres.filter((genre) => {
        return selectedMovie.current.genre_fks.includes(genre.pk);
      });
      selectedMovieGenres.current = movieGenres;
      setViewMovie(true);
    }

    getCurrentMovieGenres(allMovieGenres);
  }
  //from movie view, runs when back button is clicked (returns to list view)
  function handleBackClick(e) {
    selectedMovie.current = {};
    selectedMovieGenres.current = [];
    setViewMovie(false);
  }

  if (!viewMovie && !addMovieView) {
    return (
      <div className="ListMovies">
        <h2>Movies:</h2>
        <div className="MovieList">
          <ul>
            {movies.map((movie) => (
              <button
                className="buttonToLink"
                onClick={(e) => {
                  e.preventDefault();
                  selectedMovie.current = movie;
                  handleMovieViewClick(movie);
                }}
              >
                <Movie
                  key={`${movie.pk}`}
                  name={`${movie.name}`}
                  pk={`${movie.pk}`}
                />
              </button>
            ))}
          </ul>
        </div>
        <div className="addMovie">
          <button onClick={handleAddMovieClick}>Add Movie</button>
        </div>
      </div>
    );
  } else if (!viewMovie && addMovieView) {
    return (
      <div>
        <AddMovie genres={allMovieGenres} />
      </div>
    );
  } else {
    return (
      <div className="movieItemView">
        <h2>{selectedMovie.current.name}</h2>
        <div className="genreList">
          <ul>
            {selectedMovieGenres.current.map((genre) => (
              <MovieGenres key={`${genre.pk}`} genreName={`${genre.name}`} />
            ))}
          </ul>
        </div>
        <button onClick={handleBackClick}>Back to all movies</button>
      </div>
    );
  }
}

export default ListMovies;
