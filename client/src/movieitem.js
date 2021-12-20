/*
12/20: On first load, the movieGenres is at least populating and list displaying
On reloads, getting unhandled rejection (typeerror): cannot read properties of undefines(reading 'includes)
WHY!?
--I'm guessing it has something to do with using the wrong React hooks?
To do:
1) Read up more on React hooks
2) Move getGenres() outside of MovieItemView? (so that localhost:5000/genres isn't called with each reload),
  but have to move data.forEach() inside because movieItem isn't available outside of MovieItemView
  ^Idea for if React articles aren't helpful
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
  var [movieItem, setMovieItem] = useState({}); //obj, key: genre_fks
  var [movieGenres, setGenres] = useState([]);
  //var genres = [];

  async function getMovieInfo() {
    var res = await fetch(`http://localhost:5000/movies/${match.params.pk}`);
    var data = await res.json();
    setMovieItem(data);
  }

  async function getGenres() {
    var res = await fetch(`http://localhost:5000/genres`);
    var data = await res.json();
    var genres = await data.filter((datum) => {
      return movieItem.genre_fks.includes(datum.pk) 
      });
    await setGenres(genres);
  }

  useEffect(() => {
    getMovieInfo()
      .then(getGenres())
      .then(console.log(movieGenres))
      .catch((err) => console.log(err));
  }, []);

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
