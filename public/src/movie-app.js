/*
Note: Each JSX element is syntatic sugar for calling React.createElement(component, props, ...children)
shorthand for React.createElement: const e = React.createElement;

What to do next:
-Once you do that, figure out how to make the list display your DB items (A list of movies)

*/
function Header () {
  return(
    <h1>Hello from React!</h1>
  );
}
function NumList(props) {
  var numbers = props.numbers;
  var listItems = numbers.map(num =>
    <li key={num.toString()}>
      {num}
      </li>
  );
  return (
    <ul>{listItems}</ul>
  );
}

/* var  movieNames = [];
var getMovies = $.getJSON('http://localhost:3000/movies').done(function(data) {  
  data.map(movie => (
    movieNames.push(movie.name.toString())
  ))
}) */

function MovieList(props) {
  var url = props.url;
  var  movieNames = [];
  $.getJSON(url).done(function(data) {
    data.map(movie => 
      movieNames.push(<li key={movie.pk.toString()}>
        {movie.name.toString()}
        </li>)
    )
  })
  return (
    <ul>{movieNames}</ul>
  )
}


var numbers = [1, 2, 3, 4, 5, 6];
ReactDOM.render(
  <Header />,
  //this generates a "Target container not DOM element" error in-browser.
  //<MovieList url = 'http://localhost:3000/movies' />, 
  document.getElementById('root')
)