import React, { useState } from "react";
import MovieForm from "./form";
import "./index.css";

var SubmittedGenres = ({ name }) => <li>{name}</li>;

function AddMovie({ genres }) {
  //genres: an array of objects with pk and name
  var [checkedState, setCheckedState] = useState(
    new Array(genres.length).fill(false)
  );
  var [movieTitle, setMovieTitle] = useState("");
  var [selectedGenreNames, setSelectedGenreNames] = useState([]);
  var [submitted, setSubmitted] = useState(false);
  var selectedGenres = [];

  var checkedStateWrapper = function (data) {
    setCheckedState(data);
  };

  var titleStateWrapper = function (data) {
    setMovieTitle(data);
  };

  var submitStateWrapper = function (data) {
    setSubmitted(data);
  };

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

  return (
    <div>
      {!submitted ? (
        <div>
          <h2>Add a movie:</h2>
          <div className="add-padding">
            <MovieForm
              className="add-movie"
              submitStateHandler={submitStateWrapper}
              submitHandler={handleSubmit}
              allGenres={genres}
              checkedState={checkedState}
              checkHandler={checkedStateWrapper}
              titleChangeHandler={titleStateWrapper}
              movieTitle={movieTitle}
            />
          </div>
        </div>
      ) : (
        <div>
          <h3>Submitted movie: {movieTitle}</h3>
          <ul>
            {selectedGenreNames.map((genre, index) => (
              <SubmittedGenres key={`${index}`} name={`${genre}`} />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default AddMovie;
