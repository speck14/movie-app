import { React, useState } from "react";
import Button from "./button";
import EditMovie from "./editMovie";
import "./index.css";

//Genres associated with the current movie are listed
var MovieGenres = ({ genreName }) => <li>{genreName}</li>;

function MovieItem({
  selectedMovieTitle,
  selectedMoviePK,
  currentGenres,
  allGenres,
  movieViewSetter,
}) {
  var [editMovieView, setEditMovieView] = useState(false);

  function onEditCancelClick(e) {
    e.preventDefault();
    setEditMovieView(!editMovieView);
  }

  async function onDeleteClick(e) {
    e.preventDefault();
    if (
      window.confirm(`Are you sure you want to delete ${selectedMovieTitle}?`)
    ) {
      await fetch(`http://localhost:5000/movies/${selectedMoviePK}`, {
        method: "DELETE",
      }).then(movieViewSetter(false));
    }
  }

  return (
    <div>
      {editMovieView ? (
        <div className="add-padding">
          <EditMovie
            movieTitle={selectedMovieTitle}
            currentGenres={currentGenres}
            allGenres={allGenres}
          />
          <div className="display-inline lft-pd">
          <Button clickHandler={onEditCancelClick} text="Cancel" />
          <div className="display-inline lft-pd">
          <Button clickHandler={onDeleteClick} text="Delete" />
          </div>
          </div>
        </div>
      ) : (
        <div className="movieItemView add-padding">
          <h2>{selectedMovieTitle}</h2>
          <div className="genreList">
            <ul>
              {currentGenres.map((genre) => (
                <MovieGenres key={genre.pk} genreName={genre.name} />
              ))}
            </ul>
          </div>
          <div className="display-inline">
            <Button clickHandler={onEditCancelClick} text="Edit" />
          </div>
          <div className="display-inline lft-pd">
            <Button clickHandler={onDeleteClick} text="Delete" />
          </div>
        </div>
      )}
    </div>
  );
}

export default MovieItem;
