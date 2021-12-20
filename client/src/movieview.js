import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

var Movie = ({ name, pk }) => (
  <li>
    <Link to={`/movies/${pk}`}>
      {name}
    </Link>
  </li>
);

//function using hooks
function ListMovies() {
  //initial state set to empty array
  var [movies, setMovies] = useState([]);

  async function getMovies() {
    var res = await fetch("http://localhost:5000/movies");
    var data = await res.json();
    //fetches data, sets state to data (the JSON response)
    setMovies(data);
  }
  //useEffect hook calls getMovies after render, and React will also call this after performing the DOM updates
  //runs after every render by default
  useEffect(() => {
    getMovies();
  }, []);

  return (
    <div className="ListMovies">
      <h2>Movies:</h2>
      <div className="MovieList">
        <ul>
          {movies.map((movie) => (
            <Movie
              key={`${movie.pk}`}
              name={`${movie.name}`}
              pk={`${movie.pk}`}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ListMovies;
