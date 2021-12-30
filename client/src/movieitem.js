import React, { useState, useEffect } from "react";
//import { Link } from "react-router-dom";

var MovieInfo = ({ name }) => (
  <div>
    <h4>Name: {name}</h4>
  </div>
);

var DisplayGenres = ({ genreName }) => <li>{genreName}</li>;

function MovieItemView({ match }) {
  //Would useReducer be better than useState to capture initial state?
var initialMovieViewState = {
    pk: "",
    name: "",
    genre_fks: [],
  };
  var [movieItem, setMovieItem] = useState(initialMovieViewState); //obj, key: genre_fks
  var [currentMovieGenres, setGenres] = useState([]);  
  //var [allGenres, setAllGenres] = useState([]);

  async function getCurrentMovieGenres(allGenres) {
    console.log(`AllGenres: ${allGenres}`);
    console.log(`MovieItem: ${movieItem}`);
    var movieGenres = allGenres.filter((genre) => {
      return movieItem.genre_fks.includes(genre.pk);
    }); //if the genre is in moveItem's genre array, add to currentMovieGenres
/*Currently, I think this is using the initialMovieViewState on the first rendering (not the movieItem fetched in getMovieInfo)
    -Based on the fact that if I don't initialize initialMovieViewState, I get a "Cannot read properties of undefined (reading'includes')" 
    -Would useReducer (or another hook) fix that?
*/
    setGenres(movieGenres);
  };

  async function getAllGenres() {
    try {
      var res = await fetch(`http://localhost:5000/genres`);
      var data = await res.json();
      console.log(data);
      getCurrentMovieGenres(data);
    } catch (e) {
      console.error(e);
    }
  };

  async function getMovieInfo(pk) {
    try {
      var res = await fetch(`http://localhost:5000/movies/${pk}`);
      var data = await res.json();
      setMovieItem(data);
      //await getAllGenres();
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    getMovieInfo(match.params.pk)
    .then(getAllGenres())
    .catch((e)=> console.error(e));

  }, [match]);

  return (
    <div>
      <h3>Movie item view:</h3>
      <MovieInfo name={`${movieItem.name}`} />
      <h4>Genres:</h4>
      <ul>
        {currentMovieGenres.map((genre) => (
          <DisplayGenres key={`${genre.pk}`} genreName={`${genre.name}`} />
        ))}
      </ul>
    </div>
  );
}

export default MovieItemView;