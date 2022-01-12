import React, { useState, useEffect, useRef } from "react";
import "./index.css";
import AddMovie from "./addmovie";
import Button from "./button";
import MovieItem from "./movieItem";

//list items for individual movies
var Movie = ({ name }) => <li>{name}</li>;

function MovieList() {
  var [allMovieGenres, setAllMovieGenres] = useState([]);
  var [movies, setMovies] = useState([]);
  var [viewMovie, setViewMovie] = useState(false);
  var [addMovieView, setAddMovieView] = useState(false);
  /*
  useRef- hook that accepts initial argument and returns a reference referred to using current property
    reference.current = newValue
  useRef persists between re-renderings, updates synchronously, and update doesn't trigger a re-rendering (unlike useState)
  */
  var selectedMovie = useRef({});
  var selectedMovieGenres = useRef([]);

  function movieViewWrapper(data) {
    setViewMovie(data);
  }

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
    //this is what renders initially on startup, when neither a single movie view nor "add movie" are selected (all movies list)
    return (
      <div className="ListMovies">
        <h1>Movies:</h1>
        <div className="MovieList">
          <ul>
            {movies.map((movie) => (
              /*
              I wanted the user to "feel" like they're being directed to individual movie's page, but under the hood React 
              is conditionally rendering the movie view component, not directing the user somewhere.
              
              I used button's ability to perform an action, with CSS styling to make the button look like a link instead.
              */
              <button
                key={movie.pk} //list items in React must have unique keys
                className="buttonToLink"
                onClick={(e) => {
                  e.preventDefault();
                  selectedMovie.current = movie;
                  handleMovieViewClick();
                }}
              >
                <Movie name={movie.name} pk={movie.pk} />
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
    //renders when addMovieView is selected
    return (
      <div>
        <AddMovie genres={allMovieGenres} />
        <Button clickHandler={handleBackClick} text="Back to all movies" />
      </div>
    );
  } else {
    //when individual movie view has been selected
    return (
      <div>
        <MovieItem
          selectedMovieTitle={selectedMovie.current.name}
          selectedMoviePK={selectedMovie.current.pk}
          currentGenres={selectedMovieGenres.current}
          allGenres={allMovieGenres}
          movieViewSetter={movieViewWrapper}
        />
        <Button clickHandler={handleBackClick} text="Back to all movies" />
      </div>
    );
  }
}

export default MovieList;
