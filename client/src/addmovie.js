import React, { useState } from "react";
import MovieForm from "./form";
import MovieItem from "./movieItem";
import "./index.css";

//once a movie is added, the newly added movie title is rendered & associated genres are listed
var SubmittedGenres = ({ name }) => <li>{name}</li>;

function AddMovie({ genres }) {
  var [checkedState, setCheckedState] = useState(
    /*Generates new array of "false" values, same length as array of all genres.
      When user selects a genre, the index of that is associated with the genre in the original "allGenres"
      array.
      */
    new Array(genres.length).fill(false)
  );
  var [movieTitle, setMovieTitle] = useState("");
  var [selectedGenreNames, setSelectedGenreNames] = useState([]);
  var [submitted, setSubmitted] = useState(false);
  var selectedGenres = [];

  /*Wrapper functions can be passed to child components, allowing the child component to update state in
    its parent
  */
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
    }).then((data) => {
      console.log(data)
    });
  }

  /*
  For each checked box in checkedGenres when form is submitted, pushes the genre from all genres to an array,
  which is then used to get pks and names for selected genres.
  PKs are used when submitting to the database (as genre_fks), and names are used when rendering added movie
  to the user
  */
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
          <h1>Add a movie:</h1>
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
          <h1>Submitted: </h1>
          <h2>{movieTitle}</h2>
          <h3>Genres:</h3>
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
