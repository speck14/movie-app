import React, { useState} from "react";
import ListMovies from "./movieview";
import Checkbox from "./checkbox";
import "./index.css";

function AddMovie({genres}) {
  var [addMovieView, setAddMovieView] = useState(true);
  var [submitted, setSubmitted] = useState(false);
  var [movieTitle, setMovieTitle] = useState("");
  var [checkedState, setCheckedState] = useState(
    new Array(genres.length).fill(false)
  );
  
  //var [checked, setChecked] = useState(false);
  /*   var submitMovie = () => {
    fetch("http://localhost:5000/movies", {
      method: 'POST',
      body: {name: movieTitle, }
    })
  } */

  function handleSubmit(e) {
    e.preventDefault();
    if (!movieTitle) {
      alert("Movie must have a title");
      setSubmitted(false);
    } else {
      setSubmitted(true);      
    }
    //onAdd({movieTitle, movieGenre})
  }

  var handleCheckChange = function (checkedIndex) {
    var updatedCheckState = checkedState.map((item, index) => index === checkedIndex ? !item : item)
    setCheckedState(updatedCheckState)
  }

  function handleClearClick(e) {
      e.preventDefault();
      setMovieTitle("");
      setSubmitted(false);
      setCheckedState(checkedState.map((item) => false))
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
          <button type="submit">Submit</button>
          <button
            onClick={handleClearClick}>
            Clear
          </button>
        </form>
        {submitted && (
          <div>
            <h3>Movie Title: {movieTitle}</h3>
          </div>
        )}
        <button onClick={handleBackClick}>Back to all movies</button>
      </div>
    );
  }
}

export default AddMovie;
