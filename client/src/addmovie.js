import React, { useState } from "react";
import ListMovies from "./movieview";

function AddMovie(props) {
  var [addMovieView, setAddMovieView] = useState(true);
  var [submitted, setSubmitted] = useState(false);
  var [movieTitle, setMovieTitle] = useState("");
  var [movieGenre, setMovieGenre] = useState("");

  /*   var submitMovie = () => {
    fetch("http://localhost:5000/movies", {
      method: 'POST',
      body: {name: movieTitle, }
    })
  } */

  function handleSubmit(event) {
    event.preventDefault();

    if (!movieTitle || !movieGenre) {
      alert("All fields must be completed");
      setSubmitted(false);
    } else {
      setSubmitted(true);
    }
    //onAdd({movieTitle, movieGenre})
  }

  function handleBackClick(e) {
    e.preventDefault();
    setAddMovieView(false);
    <ListMovies />;
  }

  if (!addMovieView) {
    return <ListMovies />;
  } else {
    return (
      <div>
        <h2>Add a movie:</h2>
        <form className="add-movie" onSubmit={handleSubmit}>
          <fieldset>
            <div>
              <label for="movieTitle">Movie Title:</label>
              <input
                type="text"
                id="movieTitle"
                placeholder="Movie Title"
                value={movieTitle}
                onChange={(e) => setMovieTitle(e.target.value)}
              ></input>
            </div>
            <div>
              <label for="genre">Genre(s):</label>
              <input
                type="genre"
                id="genre"
                placeholder="Genre"
                value={movieGenre}
                onChange={(e) => setMovieGenre(e.target.value)}
              ></input>
            </div>
          </fieldset>
          <button type="submit">Submit</button>
          <button
            onClick={(e) => {
              e.preventDefault();
              setMovieTitle("");
              setMovieGenre("");
              setSubmitted(false);
            }}
          >
            Clear
          </button>
        </form>
        {submitted && (
          <div>
            <h3>Movie Title: {movieTitle}</h3> <p>Movie genre: {movieGenre}</p>
          </div>
        )}
        <button onClick={handleBackClick}>Back to all movies</button>
      </div>
    );
  }
}

export default AddMovie;
