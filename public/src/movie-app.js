//Note: Each JSX element is syntatic sugar for calling React.createElement(component, props, ...children)
/*
shorthand for React.createElement: const e = React.createElement;

What to do next:
-Figure out how to render a list
var nums = [1, 2, 3, 4]
var displayNums = nums.map(n => {
  return <li>n</li>
})
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
var numbers = [1, 2, 3, 4, 5, 6];
ReactDOM.render(
  //<Header />,
  <NumList numbers = {numbers} />,
  document.getElementById('root')
)