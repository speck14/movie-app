import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import ListMovies from "./movieview";
import MovieItemView from "./movieitem";
import AddMovie from "./addmovie";

ReactDOM.render(
  <Router>
    <Switch>
      <Route exact path="/">
        <ListMovies />
      </Route>
      <Route exact path="/movies/:pk" component={MovieItemView} />
      <Route exact path="/add" component={AddMovie} />
    </Switch>
  </Router>,
  document.getElementById("root")
);
