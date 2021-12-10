import React, { useState, useEffect } from "react";

var Movie = ({ name }) => <li>{name}</li>;

//function using hooks
function ListMovies() {
  //initial state set to empty array
  var [movies, setMovies] = useState([]);

  async function getMovies() {
    const res = await fetch("http://localhost:5000/movies");
    const data = await res.json();
    //fetches data, sets state to data (the JSON response)
    setMovies(data);
  }
  //useEffect hook calls getMovies after render, and React will also call this after performing the DOM updates
  //runs after every render by default
  useEffect(() => {
    getMovies();
  }, []);

  return (
    <div>
      <h2>Hello from react</h2>
      <div>
        <ul>
          {movies.map((movie) => (
            <Movie key={`${movie.pk}`} name={`${movie.name}`} />
          ))}
        </ul>
      </div>
    </div>
  );
}

//Using a class, this is the method originally introduced in React before hooks (used above)
/* class MovieList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      movies: [],
    };

    this.getMovies = this.getMovies.bind(this);
  }

  async getMovies() {
    const res = await fetch(`http://localhost:5000/movies`);
    const data = await res.json();
    return data;
  }

  async componentDidMount() {
    const movies = await this.getMovies();
    this.setState({ movies });
  }

  render() {
    return (
      <div>
        <h2>Hello from react</h2>
        <div>
          <ul>
            {this.state.movies.map((movie) => (
              <Movie key={`${movie.pk}`} name={`${movie.name}`} />
            ))}
          </ul>
        </div>
      </div>
    );
  }
} */

export default ListMovies;
