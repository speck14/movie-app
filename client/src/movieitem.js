/*
12/23: Sometimes get a fetch error: Unhandled Rejection (TypeError): Cannot read properties of undefined (reading 'includes') 
-Error occurs when:
  -Navigating to movie item view from main movie view page using links
  -Refreshing from movie item view
-App works when:
  -A change is made to this JS file, saved, and the server automatically restarts
-Response headers are OK, but movieItemData is undefined
  -Might have something to do with using match to trigger useCallback? Is there something else I can use?

Read up on fetch Type errors Monday
*/

import React, { useState, useEffect, useCallback } from "react";
//import { Link } from "react-router-dom";

var MovieInfo = ({ name }) => (
  <div>
    <h4>Name: {name}</h4>
  </div>
);

var DisplayGenres = ({ genreName }) => <li>{genreName}</li>;

function MovieItemView({ match }) {
  var [movieItem, setMovieItem] = useState({}); //obj, key: genre_fks
  var [movieGenres, setGenres] = useState([]);

  //useCallback to prevent infinite calls- this function will only run when match changes
  const getMovieInfo = useCallback(async () => {
    var res = await fetch(`http://localhost:5000/movies/${match.params.pk}`);
    var data = await res.json();
    setMovieItem(data);
  }, [match]);

  //useMemo so we don't have to run this with every render??
  async function getGenres() {
    var res = await fetch(`http://localhost:5000/genres`);
    var data = await res.json();
    console.log(`Genre data: ${data}`);
    console.log(`MovieItem data: ${movieItem.genre_fks}`); //this is undefined when the fetch error occurs
    var genres = await data.filter((datum) => {
      return movieItem.genre_fks.includes(datum.pk);
    });
    setGenres(genres);
  }

  useEffect(() => {
    getMovieInfo()
      .then(getGenres())
      .then(console.log("useEffect ran!"))
      .catch((err) => console.err);
  }, [getMovieInfo]); //useEffect will only trigger when getMovieInfo runs (when match changes)

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
