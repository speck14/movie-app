import React, { useState, useEffect, useRef } from "react";
import "./index.css";
import AddMovie from "./addmovie";
import Button from "./button";
import MovieItem from "./movieItem";

var Movie = ({ name }) => <li>{name}</li>;

function MovieList() {
  var [allMovieGenres, setAllMovieGenres] = useState([]);
  var [movies, setMovies] = useState([]);
  var [viewMovie, setViewMovie] = useState(false);
  var [addMovieView, setAddMovieView] = useState(false);
  var selectedMovie = useRef({});
  var selectedMovieGenres = useRef([]);

  useEffect(() => {
    async function getMovies() {
      var res = await fetch("http://localhost:5000/movies");
      var data = await res.json();
      setMovies(data);
    }
    async function getAllGenres() {
      var res = await fetch(`http://localhost:5000/genres`);
      var data = await res.json();
      setAllMovieGenres(data);
    }

    getMovies()
      .then(getAllGenres())
      .catch((err) => {
        if (err) throw err;
      });
  }, [addMovieView, viewMovie]);

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
    e.preventDefault();
    selectedMovie.current = {};
    selectedMovieGenres.current = [];
    setViewMovie(false);
    setAddMovieView(false);
  }

  if (!viewMovie && !addMovieView) {
    return (
      <div className="ListMovies">
        <h1>Movies:</h1>
        <div className="MovieList">
          <ul>
            {movies.map((movie) => (
              <button
                className="buttonToLink"
                onClick={(e) => {
                  e.preventDefault();
                  selectedMovie.current = movie;
                  handleMovieViewClick();
                }}
              >
                <Movie key={movie.pk} name={movie.name} pk={movie.pk} />
              </button>
            ))}
          </ul>
        </div>
        <div className="addMovie">
          <Button clickHandler={handleAddMovieClick} text="Add Movie" />
        </div>
      </div>
    );
  } else if (!viewMovie && addMovieView) {
    return (
      <div>
        <AddMovie genres={allMovieGenres} />
        <Button clickHandler={handleBackClick} text="Back to all movies" />
      </div>
    );
  } else {
    return (
      <div>
        <MovieItem
          selectedMovieTitle={selectedMovie.current.name}
          currentGenres={selectedMovieGenres.current}
          allGenres={allMovieGenres}
        />
        <Button clickHandler={handleBackClick} text="Back to all movies" />
      </div>
    );
  }
}

export default MovieList;
