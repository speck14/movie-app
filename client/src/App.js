import React from "react";

function App() {
  fetch('http://localhost:5000/express_backend')
  .then(response => response.json())
  .then(data => console.log(data));
  return (
  <div className="App">
  app
  </div>
  );
  }
export default App;