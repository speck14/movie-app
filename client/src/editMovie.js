import { React, useState } from "react";
import MovieForm from "./form";

var UpdatedGenres = ({ name }) => <li>{name}</li>;

function EditMovie({
  selectedMovie,
  selectedMovieGenres,
  allMovieGenres,
  cancelClickHandler,
  deleteClickHandler,
  updateMovie,
}) {
  var [checkedState, setCheckedState] = useState(initialCheck());
  var [updatedTitle, setUpdatedTitle] = useState(selectedMovie.name);
  var [submitted, setSubmitted] = useState(false);
  var [submittedGenreNames, setSubmittedGenreNames] = useState([selectedMovieGenres]);
  var selectedGenrePKs = [];

  /*Creates new array (initSelectedGenres) with "true" values for movie's current genres on initial rendering.
  CurrentGenre's genre locations are checked with allGenres, to ensure that the genre's index in allGenres is
  marked true in initSelectedGenres. This way, if the order of currentGenres changes, the correct genre will 
  be associated with the movie when it is updated.

  This function "checks" the checkboxes for the genres currently associated with the movie when user enters
  the edit form.
  */
  function initialCheck() {
    var initSelectedGenres = new Array(allMovieGenres.length).fill(false);
    selectedMovieGenres.forEach((movieGenre) => {
      allMovieGenres.forEach((genre, index) => {
        if (genre.pk === movieGenre.pk) {
          initSelectedGenres[index] = true;
        }
      });
    });
    return initSelectedGenres;
  }

  /*   async function updateMovie() {
    await fetch(`http://localhost:5000/movies/${moviePK}`, {
      method: "PUT",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        name: updatedTitle,
        genre_fks: selectedGenrePKs,
        pk: moviePK,
      }),
    }).then((data, err) => {
      if (!data.ok || err) {
        throw Error;
      }
      setSubmitted(true);
    });
  } */

  async function checkedGenres() {
    var checkedGenreArr = [];
    await checkedState.forEach((item, index) => {
      if (item) {
        checkedGenreArr.push(allMovieGenres[index]);
      }
    });
    await checkedGenreArr.forEach((item) => {
      selectedGenrePKs.push(item.pk);
    });
    setSubmittedGenreNames(
      await checkedGenreArr.map((item) => {
        return item.name;
      })
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!updatedTitle) {
      alert("Movie must have a title");
      setSubmitted(false);
    } else {
      await checkedGenres();
      await updateMovie(selectedMovie.pk, updatedTitle, selectedGenrePKs);
      setSubmitted(true);
    }
  }

  return (
    <div>
      {!submitted ? (
        <div>
          <h2>Edit {selectedMovie.name}</h2>
          <MovieForm
            className="edit-form"
            setSubmitted={setSubmitted}
            submitHandler={handleSubmit}
            allMovieGenres={allMovieGenres}
            checkedState={checkedState}
            setCheckedState={setCheckedState}
            titleChangeHandler={setUpdatedTitle}
            movieTitle={updatedTitle}
          />
          <div className="display-inline lft-pd">
            <button onClick={cancelClickHandler}>Cancel</button>
            <div className="display-inline lft-pd">
              <button onClick={deleteClickHandler}>Delete</button>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <h1>Updated {selectedMovie.name}!</h1>
          <h2>Updated Title: {updatedTitle}</h2>
          <h2>Genres:</h2>
          <ul>
            {submittedGenreNames.map((genre, index) => (
              <UpdatedGenres key={index} name={genre} />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default EditMovie;
