import React, { useState, useEffect, useRef } from "react";
import "./index.css";
import MovieList from "./movieList";
import AddMovie from "./addmovie";
import MovieItem from "./movieItem";

function App() {
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

    /*Wrapper functions can be passed to child components, allowing the child component to update state in
    its parent
  */
  function movieViewWrapper(data) {
    setViewMovie(data);
  }

  async function updateMovie(moviePK, updatedTitle, selectedGenrePKs) {
    await fetch(`http://localhost:5000/movies/${moviePK}`, {
      method: "PUT",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        name: updatedTitle,
        genre_fks: selectedGenrePKs,
        pk: moviePK,
      }),
    }).then((data, err) => {
      if (!data.ok || err) {
        throw Error;
      }
      return;
    });
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
      <div>
        <MovieList
          allMovies={movies}
          selectedMovie={selectedMovie}
          movieClick={handleMovieViewClick}
        />
        <div className="addMovie">
          <button onClick={handleAddMovieClick}>Add Movie</button>
        </div>
      </div>
    );
  } else if (!viewMovie && addMovieView) {
    //renders when addMovieView is selected
    return (
      <div>
        <AddMovie genres={allMovieGenres} />
        <button onClick={handleBackClick}>Back to all movies</button>
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
          movieUpdater={updateMovie}
        />
        <button onClick={handleBackClick}>Back to all movies</button>
      </div>
    );
  }
}

export default App;
