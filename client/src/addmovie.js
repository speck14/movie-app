import React, {useState, useEffect} from 'react';

function AddMovie() {
  const [submitting, setSubmitting] = useState(false);

const handleSubmit = event => {
  event.preventDefault();
  setSubmitting(true);

  setTimeout(() => {
    setSubmitting(false);
  }, 2000)
};

  return(
    <div>
      <h2>Add a movie:</h2>
      {submitting &&
      <div>Submitting Form...</div>
      }
      <form onSubmit={handleSubmit}>
        <fieldset>
          <div>
          <label for="movieName">Movie Title:</label>
          <input type="text" id="movieName" placeholder="Movie Title"></input>
          </div>
          <div>
            <label for="genre">Genre(s):</label>
            <input type="genre" id="genre" placeholder="Genre"></input>
          </div>
        </fieldset>
        <button type="submit">Submit</button>
      </form>
    </div>
  )
};

export default AddMovie;