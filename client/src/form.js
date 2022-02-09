import { React, useState } from "react";
import Checkbox from "./checkbox";
import "./index.css";

function MovieForm({
  className,
  setSubmitted,
  submitHandler,
  allMovieGenres,
  checkedState,
  setCheckedState,
  titleChangeHandler,
  movieTitle = "",
}) {
  var [initTitle] = useState([movieTitle]);
  /*When you update a state, the existing state is totally replaced with the new value.
  Checks the checkedState array for which value has been changed, creates a new array of
  true/false values based on the change, and updates checkedState with the new array
  */
  var handleCheckChange = function (checkedIndex) {
    var updatedCheckState = checkedState.map((item, index) =>
      index === checkedIndex ? !item : item
    );
    setCheckedState(updatedCheckState);
  };

  function handleClearClick(e) {
    e.preventDefault();
    setSubmitted(false);
    setCheckedState(checkedState.map((item) => false));
    titleChangeHandler(initTitle ? initTitle : "");
  }

  return (
    <form className={` add-padding ${className}`} onSubmit={submitHandler}>
      <fieldset>
        <div className="movie-title add-padding">
          <label htmlFor="movieTitle">Movie Title:</label>
          <input
            type="text"
            id="movieTitle"
            placeholder={movieTitle ? movieTitle : "Movie Title"}
            value={movieTitle}
            onChange={(e) => titleChangeHandler(e.target.value)}
          ></input>
        </div>
        <div className="genre-checklist add-padding">
          <legend className="genre-legend">Select genres:</legend>
          {allMovieGenres?.map(function (genre, index) {
            var changeHandler = () => handleCheckChange(index);
            return (
              <Checkbox
                key={genre.pk}
                name={genre.name}
                id={genre.pk}
                index={index}
                isChecked={checkedState[index]}
                eventHandler={changeHandler}
              />
            );
          })}
        </div>
        <div className="display-inline">
          <button onClick={submitHandler}>Submit</button>
          <div className="display-inline lft-pd">
            <button onClick={handleClearClick}>Clear</button>
          </div>
        </div>
      </fieldset>
    </form>
  );
}

export default MovieForm;
