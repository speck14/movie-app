import React from "react";

//list items for individual movies
var Movie = ({ name }) => <li>{name}</li>;

function MovieList({allMovies, selectedMovie, movieClick}) {
  return (
  <div className="ListMovies">
        <h1>Movies:</h1>
        <div className="MovieList">
          <ul>
            {allMovies.map((movie) => (
              /*
              I wanted the user to "feel" like they're being directed to individual movie's page, but under the hood React 
              is conditionally rendering the movie view component, not directing the user somewhere.
              
              I used button's ability to perform an action, with CSS styling to make the button look like a link instead.
              */
              <button
                key={movie.pk} //list items in React must have unique keys
                className="buttonToLink"
                onClick={(e) => {
                  e.preventDefault();
                  selectedMovie.current = movie;
                  movieClick();
                }}
              >
                <Movie name={movie.name} pk={movie.pk} />
              </button>
            ))}
          </ul>
        </div>
      </div>
    )
};

export default MovieList;