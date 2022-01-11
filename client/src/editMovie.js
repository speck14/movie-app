import { React, useState } from "react";
import MovieForm from "./form";

function EditMovie({ movieTitle, currentGenres, allGenres }) {
  var [checkedState, setCheckedState] = useState(
    new Array(allGenres.length).fill(false)
  );
  var [updatedTitle, setUpdatedTitle] = useState(movieTitle);
  var [submitted, setSubmitted] = useState(false);

  var checkedStateWrapper = function (data) {
    setCheckedState(data);
  };
  var submitStateWrapper = function (data) {
    setSubmitted(data);
  };
  var updatedTitleWrapper = function (data) {
    setUpdatedTitle(data);
  };

  async function handleSubmit(e) {
    e.preventDefault();
    if (!updatedTitle) {
      alert("Movie must have a title");
      setSubmitted(false);
    } else {
      setSubmitted(true);
      console.log(updatedTitle);
      //submitMovie();
    }
  }

  return (
    <div>
      <h2>Edit {movieTitle}</h2>
      <MovieForm
        className="edit-form"
        submitStateHandler={submitStateWrapper}
        submitHandler={handleSubmit}
        allGenres={allGenres}
        checkedState={checkedState}
        checkHandler={checkedStateWrapper}
        titleChangeHandler={updatedTitleWrapper}
        movieTitle={updatedTitle}
        currentGenres={currentGenres}
      />
    </div>
  );
}

export default EditMovie;
