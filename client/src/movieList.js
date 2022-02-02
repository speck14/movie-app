import React from "react";

/*
  I wanted the user to "feel" like they're being directed to individual movie's page, but under the hood React 
  is conditionally rendering the movie view component, not directing the user somewhere.
              
  I used button's ability to perform an action, with CSS styling to make the button look like a link instead.
*/
var Movie = ({ clickHandler, name }) => (
  <li>
    <button onClick={clickHandler} className="buttonToLink">
      {name}
    </button>
  </li>
);

function MovieList({ allMovies, selectedMovie, movieClick }) {
  return (
    <div className="ListMovies">
      <h1>Movies:</h1>
      <div className="MovieList">
        <ul>
          {allMovies.map((movie) => (
            <Movie
              key={movie.pk}
              clickHandler={function (e) {
                e.preventDefault();
                selectedMovie.current = movie;
                movieClick();
              }}
              name={movie.name}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

export default MovieList;