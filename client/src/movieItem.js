import { React, useState } from "react";
import Button from "./button";
import EditMovie from "./editMovie";

var MovieGenres = ({ genreName }) => <li>{genreName}</li>;

function MovieItem({ selectedMovieTitle, currentGenres, allGenres }) {
  var [editMovieView, setEditMovieView] = useState(false);

  function onButtonClick(e) {
    e.preventDefault();
    setEditMovieView(!editMovieView);
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
          <Button clickHandler={onButtonClick} text="Cancel" />
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
          <Button clickHandler={onButtonClick} text="Edit" />
        </div>
      )}
    </div>
  );
}

export default MovieItem;
