import React from "react";

function App() {
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    return fetch("http://localhost:3000/express_backend")
      .then((res) => res.text())
      .then((data) => resolve(data? JSON.parse(data) : {}))
      .catch(err => reject(err));
}, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>{!data ? "Loading..." : data}</p>
      </header>
    </div>
  );
}

export default App;