import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

var genres = [];
async function getGenres() {
  var res = await fetch(`http://localhost:5000/genres`);
  var data = await res.json();
  genres = data;
}

var MovieInfo = ({ name, fk }) => (
  <div>
    <h4>Name: {name}</h4>
    <p>FK: {fk}</p>
  </div>
);

function MovieItemView({ match }) {
  var [movieItem, setMovieItem] = useState({}); //obj, key: genre_fks
  var [movieGenre, setGenres] = useState([]);

  getGenres();

  async function getMovieInfo() {
    var res = await fetch(`http://localhost:5000/movies/${match.params.pk}`);
    var data = await res.json();
    setMovieItem(data);
  }

  useEffect(() => {
    getMovieInfo();
  }, []);

  return (
    <div>
      <h3>Movie item view:</h3>
      <MovieInfo name={`${movieItem.name}`} fk={`${movieItem.genre_fks}`} />
    </div>
  );
}

export default MovieItemView;
