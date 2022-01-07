import React, { useState } from "react";
import ListMovies from "./movieview";
import Checkbox from "./checkbox";
import "./index.css";

var SubmittedGenres = ({ name }) => <li>{name}</li>;

function AddMovie({ genres }) {
  //genres: an array of objects with pk and name
  var [addMovieView, setAddMovieView] = useState(true);
  var [checkedState, setCheckedState] = useState(
    new Array(genres.length).fill(false)
  );
  var [movieTitle, setMovieTitle] = useState("");
  var [selectedGenreNames, setSelectedGenreNames] = useState([]);
  //var [selectedGenres, setSelectedGenres] = useState([]);
  var [submitted, setSubmitted] = useState(false);

  var selectedGenres = [];

  async function submitMovie() {
    await fetch("http://localhost:5000/movies", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ name: movieTitle, genre_fks: selectedGenres }),
    });
  }

  async function checkedGenres() {
    var checkedGenreArr = [];
    await checkedState.forEach((item, index) => {
      if (item) {
        checkedGenreArr.push(genres[index]);
      }
    });
    selectedGenres = await checkedGenreArr.map((item) => {
      return item.pk;
    });
    setSelectedGenreNames(
      await checkedGenreArr.map((item) => {
        return item.name;
      })
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!movieTitle) {
      alert("Movie must have a title");
      setSubmitted(false);
    } else {
      setSubmitted(true);
      await checkedGenres();
      submitMovie();
    }
  }

  var handleCheckChange = function (checkedIndex) {
    var updatedCheckState = checkedState.map((item, index) =>
      index === checkedIndex ? !item : item
    );
    setCheckedState(updatedCheckState);
  };

  function handleClearClick(e) {
    e.preventDefault();
    setMovieTitle("");
    setSubmitted(false);
    setCheckedState(checkedState.map((item) => false));
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
            <div className="movie-title add-padding">
              <label htmlFor="movieTitle">Movie Title:</label>
              <input
                type="text"
                id="movieTitle"
                placeholder="Movie Title"
                value={movieTitle}
                onChange={(e) => setMovieTitle(e.target.value)}
              ></input>
            </div>
            <div className="genre-checklist add-padding">
              <legend className="genre-legend">Select genres:</legend>
              {genres.map((genre, index) => (
                <Checkbox
                  key={genre.pk}
                  name={genre.name}
                  id={genre.pk}
                  index={index}
                  isChecked={checkedState[index]}
                  eventHandler={handleCheckChange}
                />
              ))}
            </div>
          </fieldset>
          <button type="submit" onClick={handleSubmit}>
            Submit
          </button>
          <button onClick={handleClearClick}>Clear</button>
        </form>
        {submitted && (
          <div>
            <h3>Submitted movie: {movieTitle}</h3>
            <ul>
              {selectedGenreNames.map((genre, index) => (
                <SubmittedGenres key={`${index}`} name={`${genre}`} />
              ))}
            </ul>
          </div>
        )}
        <button onClick={handleBackClick}>Back to all movies</button>
      </div>
    );
  }
}

export default AddMovie;
