import React from "react";

var Movie = ({ name, pk }) => <li>{name}</li>;

class MovieList extends React.Component {
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
}

export default MovieList;
