import { React, useState } from "react";
import EditMovie from "./editMovie";
import "./index.css";

function MovieItem({
  selectedMovie,
  currentGenres,
  allGenres,
  movieViewSetter,
  movieUpdater,
  handleBackClick,
}) {
  var [editMovieView, setEditMovieView] = useState(false);

  function onEditCancelClick(e) {
    e.preventDefault();
    setEditMovieView(!editMovieView);
  }

  async function onDeleteClick(e) {
    e.preventDefault();
    if (
      window.confirm(`Are you sure you want to delete ${selectedMovie.name}?`)
    ) {
      await fetch(`http://localhost:5000/movies/${selectedMovie.pk}`, {
        method: "DELETE",
      }).then((data, err) => {
        if (!data.ok || err) {
          throw Error;
        }
        movieViewSetter(false);
      });
    }
  }

  return (
    <div>
      {editMovieView ? (
        <div className="add-padding">
          <EditMovie
            selectedMovie={selectedMovie}
            currentGenres={currentGenres}
            allGenres={allGenres}
            cancelClickHandler={onEditCancelClick}
            deleteClickHandler={onDeleteClick}
            movieUpdater={movieUpdater}
          />
        </div>
      ) : (
        <div className="movieItemView add-padding">
          <h2>{selectedMovie.name}</h2>
          <div className="genreList">
            <ul>
              {currentGenres.map((genre) => (
                <li key={genre.pk}>{genre.name}</li>
              ))}
            </ul>
          </div>
          <div className="display-inline lft-pd">
            <button onClick={onEditCancelClick}>Edit</button>
            <div className="display-inline lft-pd">
              <button onClick={onDeleteClick}>Delete</button>
            </div>
          </div>
        </div>
      )}
      <button onClick={handleBackClick}>Back to all movies</button>
    </div>
  );
}

export default MovieItem;
