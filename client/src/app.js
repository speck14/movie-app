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
  var [selectedMovie, setSelectedMovie] = useState({});
  var [selectedMovieGenres, setSelectedMovieGenres] = useState([]);

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
  function handleMovieViewClick(movie) {
    setSelectedMovie(movie);
    //compare selected movie's genre foreign keys to all genres for matches
    var movieGenres = allMovieGenres.filter((genre) =>
      movie.genre_fks.includes(genre.pk)
    );
    setSelectedMovieGenres(movieGenres);
    setViewMovie(true);
  }

  //from movie view, runs when back button is clicked (returns to list view)
  function handleBackClick() {
    setSelectedMovie({});
    setSelectedMovieGenres([]);
    setViewMovie(false);
    setAddMovieView(false);
  }
  //this is what renders initially on startup, when neither a single movie view nor "add movie" are selected (all movies list)
  return (
    <div>
      {!viewMovie && !addMovieView && (
        <>
          <MovieList
            allMovies={movies}
            selectedMovie={selectedMovie}
            setSelectedMovie={setSelectedMovie}
            handleMovieViewClick={handleMovieViewClick}
          />
          <div className="addMovie">
            <button onClick={handleAddMovieClick}>Add Movie</button>
          </div>
        </>
      )}
      {addMovieView && (
        <AddMovie genres={allMovieGenres} handleBackClick={handleBackClick} />
      )}
      {viewMovie && (
        <MovieItem
          selectedMovieTitle={selectedMovie.name}
          selectedMoviePK={selectedMovie.pk}
          currentGenres={selectedMovieGenres}
          allGenres={allMovieGenres}
          movieViewSetter={movieViewWrapper}
          movieUpdater={updateMovie}
          handleBackClick={handleBackClick}
        />
      )}
    </div>
  );
}

export default App;
