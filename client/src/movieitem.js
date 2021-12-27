/* 
1)useEffect is called on render (re-render triggered when match.params.pk changes)
2) useEffect triggers a call to getMovieInfo, which does a get request to /genres/pk
  -Get movie name and genre_fks from JSON response, set movieItem state to that data via setMovieItem
3)getMovieInfo then calls getCurrentMovieGenres
  -Makes a get request to /genres to get all genre information
  ****
  -sets allGenres to JSON response via setAllGenres
    -This is where the app isn't working. The request is successful, the JSON response contains genre data,
      but the setAllGenres call isn't setting allGenres to the JSON data
    -The setAllGenres works if I'm already on the movieItemView page and restart the app, it doesn't work when
      navigating from the movieView page via the link, and it doesn't work if the the page is refreshed
    -Calls are happening in the correct order, so I don't *think* it's an async/call stack order problem
      ****
4) getAllGenres then calls getCurrentMovieGenres
  -This uses the genre_fks from movieItem, compares it to pks for all genres, and adds matching pk/fks to
    movieGenres via setGenres
5)Display movie name and a list of genres for current movie
*/

import React, { useState, useEffect } from "react";
//import { Link } from "react-router-dom";

var MovieInfo = ({ name }) => (
  <div>
    <h4>Name: {name}</h4>
  </div>
);

var DisplayGenres = ({ genreName }) => <li>{genreName}</li>;

function MovieItemView({ match }) {
  var initialMovieViewState = {
    pk: "",
    name: "",
    genre_fks: [],
  };
  var [movieItem, setMovieItem] = useState(initialMovieViewState); //obj, key: genre_fks
  var [movieGenres, setGenres] = useState([]);
  var [allGenres, setAllGenres] = useState([]);

  function getCurrentMovieGenres() {
    console.log(`AllGenres: ${allGenres}`);
    console.log(`MovieItem: ${movieItem}`);
    var currentMovieGenres = allGenres.filter((genre) => {
      return movieItem.genre_fks.includes(genre.pk);
    });
    setGenres(currentMovieGenres);
  };

  async function getAllGenres() {
    try {
      var res = await fetch(`http://localhost:5000/genres`);
      var data = await res.json();
      console.log(data);
      await setAllGenres([...data]);
      console.log(`getAllGenres ran, allGenres: ${allGenres}`);
      getCurrentMovieGenres();
    } catch (e) {
      console.error(e);
    }
  };

  async function getMovieInfo(pk) {
    try {
      var res = await fetch(`http://localhost:5000/movies/${pk}`);
      var data = await res.json();
      setMovieItem(data);
      await getAllGenres();
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    getMovieInfo(match.params.pk).catch((e) => console.error(e));
  }, [match.params.pk]);

  return (
    <div>
      <h3>Movie item view:</h3>
      <MovieInfo name={`${movieItem.name}`} />
      <h4>Genres:</h4>
      <ul>
        {movieGenres.map((genre) => (
          <DisplayGenres key={`${genre.pk}`} genreName={`${genre.name}`} />
        ))}
      </ul>
    </div>
  );
}

export default MovieItemView;
