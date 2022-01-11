import { React } from "react";
import Checkbox from "./checkbox";
import Button from "./button";
import "./index.css"

function MovieForm({
  className,
  submitStateHandler,
  submitHandler,
  allGenres,
  checkedState,
  checkHandler,
  titleChangeHandler,
  movieTitle = "",
  currentGenres = "",
}) {
  var handleCheckChange = function (checkedIndex) {
    var updatedCheckState = checkedState.map((item, index) =>
      index === checkedIndex ? !item : item
    );
    checkHandler(updatedCheckState);
  };

  function handleClearClick(e) {
    e.preventDefault();
    titleChangeHandler("");
    submitStateHandler(false);
    checkHandler(checkedState.map((item) => false));
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
          {allGenres.map((genre, index) => (
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
        <div className="display-inline">
        <Button clickHandler={submitHandler} text="Submit" />
        <div className="display-inline lft-pd">
        <Button clickHandler={handleClearClick} text="Clear" />
        </div>
        </div>
      </fieldset>
    </form>
  );
}

export default MovieForm;