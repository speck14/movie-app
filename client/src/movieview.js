import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./index.css";

var Movie = ({ name }) => <li>{name}</li>;

var MovieGenres = ({ genreName }) => <li>{genreName}</li>;

//function using hooks
function ListMovies() {
  var [movies, setMovies] = useState([]);
  var [viewMovie, setViewMovie] = useState(false);
  var selectedMovie = useRef({});
  var selectedMovieGenres = useRef([]);
  /*   var [selectedMovie, setSelectedMovie] = useState({});
  var [selectedMovieGenres, setSelectedMovieGenres] = useState([]); */

  useEffect(() => {
    async function getMovies() {
      try {
        var res = await fetch("http://localhost:5000/movies");
        var data = await res.json();
        //fetches data, sets state to data (the JSON response)
        setMovies(data);
      } catch (e) {
        console.error(e);
      }
    }

    getMovies();
  }, []);

  //remember: 1) page renders 2) browser paints page 3) REACT STATES CHANGE
  //this is rendering the initial state, not the changed one- HOW TO FIX THAT?
  function handleMovieViewClick() {
    async function getAllGenres() {
      try {
        var res = await fetch(`http://localhost:5000/genres`);
        var data = await res.json();
        getCurrentMovieGenres(data);
      } catch (e) {
        console.error(e);
      }
    }
    async function getCurrentMovieGenres(allGenres) {
      var movieGenres = await allGenres.filter((genre) => {
        return selectedMovie.current.genre_fks.includes(genre.pk);
      });
      selectedMovieGenres.current = movieGenres;
      setViewMovie(true);
    }

    getAllGenres();
  }

  function handleBackClick(e) {
    selectedMovie.current = {};
    selectedMovieGenres.current = [];
    setViewMovie(false);
  }

  if (!viewMovie) {
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
          <button>
            <Link to={`/add`}>Add</Link>
          </button>
        </div>
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
