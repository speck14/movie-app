import React from "react";

function App() {
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    fetch("http://localhost:5000/express_backend")
      .then((res) => res.json())
      .then(data => setData(data.express));
  }, []);

  return (
    <div className="App">
      <h1 className="App-heading">Hello from React!</h1>
      <p>{!data ? "Loading..." : data}</p>
    </div>
  );
}
export default App;
