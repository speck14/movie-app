import { React, useState} from "react";
import MovieForm from "./form";

function EditMovie({ movieTitle, currentGenres, allGenres }) {
  var [checkedState, setCheckedState] = useState(initialCheck());
  var [updatedTitle, setUpdatedTitle] = useState(movieTitle);
  var [submitted, setSubmitted] = useState(false);

    /*Wrapper functions can be passed to child components, allowing the child component to update state in
    its parent
  */
  var checkedStateWrapper = function (data) {
    setCheckedState(data);
  };
  var submitStateWrapper = function (data) {
    setSubmitted(data);
  };
  var updatedTitleWrapper = function (data) {
    setUpdatedTitle(data);
  };

  /*Creates new array (initSelectedGenres) with "true" values for movie's current genres on initial rendering.
  CurrentGenre's genre locations are checked with allGenres, to ensure that the genre's index in allGenres is
  marked true in initSelectedGenres. This way, if the order of currentGenres changes, the correct genre will 
  be associated with the movie when it is updated.

  This function "checks" the checkboxes for the genres currently associated with the movie when user enters
  the edit form.
  */ 
  function initialCheck() {
    var initSelectedGenres = new Array(allGenres.length).fill(false);
    currentGenres.forEach((movieGenre) => {
      allGenres.forEach((genre, index) => {
        if (genre.pk === movieGenre.pk) {
          initSelectedGenres[index] = true;
        }
      });
    });
    return initSelectedGenres;
  }

  /*async function submitMovie() {

  }
  */

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
