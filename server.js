var sqlite3 = require("sqlite3");
var express = require("express");
var uuid = require("uuid");
var async = require("async");
var assert = require("assert");
var _ = require("underscore");
var bodyParser = require("body-parser");
var path = require("path");
var cors = require("cors");

var app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var db;

function requestHandlers() {
  // A (more-or-less) RESTful JSON API for the client-side Javascript to talk to
  //Handle all GET requests not otherwise specified using index.html
  app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "client/public", "index.html"));
  });

  app.get("/express_backend", (req, res) => {
    res.json({ express: "This is your express backend" });
  });

  app.get("/genres", function (req, res) {
    db.all("SELECT * FROM genre", function (err, rows) {
      if (err) throw err;
      res.send(rows);
    });
  });

  app.get("/movies", function (req, res) {
    db.all("SELECT * FROM movie", function (err, rows) {
      if (err) throw err;
      var movies = rows;
      movies.forEach(function (movie) {
        if (movie.genre_fks) movie.genre_fks = movie.genre_fks.split(",");
      });
      res.send(movies);
    });
  });

  app.get("/movies/:pk", function (req, res) {
    db.all(
      "SELECT * FROM movie WHERE pk=$1",
      [req.params.pk],
      function (err, rows) {
        if (err) throw err;
        var movie = rows[0];
        if (movie.genre_fks) movie.genre_fks = movie.genre_fks.split(",");
        res.send(movie);
      }
    );
  });

  app.put("/movies/:pk", function (req, res) {
    var movie = req.body;
    if (movie.genre_fks) movie.genre_fks = movie.genre_fks.join(",");
    db.run(
      "UPDATE movie SET name=$1, genre_fks=$2 WHERE pk=$3",
      [movie.name, movie.genre_fks, req.params.pk],
      function (err) {
        if (err) throw err;
        res.send(movie);
      }
    );
  });

  app.post("/movies", function (req, res) {
    var movie = req.body;
    if (movie.genre_fks) movie.genre_fks = movie.genre_fks.join(",");
    movie.pk = createUUID();
    db.run(
      "INSERT INTO movie (pk, name, genre_fks) VALUES ($1, $2, $3)",
      [movie.pk, movie.name, movie.genre_fks],
      function (err) {
        if (err) throw err;
        res.send(movie);
      }
    );
  });

  app.delete("/movies/:pk", function (req, res) {
    db.run("DELETE FROM movie WHERE pk=$1", [req.params.pk], function (err) {
      if (err) throw err;
      // jQuery interprets it as an error if we don't return JSON
      res.send({ deleted: true });
    });
  });

  app.delete("/movies", function (req, res) {
    db.run("DELETE FROM movie", function (err) {
      if (err) throw err;
      // jQuery interprets it as an error if we don't return JSON
      res.send({ deleted: true });
    });
  });

  app.use(express.static(__dirname + "/client"));
  app.use(express.static(__dirname + "client/build"));

  app.server = app.listen(5000, () => console.log("Server is running"));
}

function setupDatabase() {
  return Promise.resolve(
    (db = new sqlite3.Database("movies.sqlite", function (err) {
      if (err) throw err;

      db.all(
        "SELECT name FROM sqlite_master WHERE type='table'",
        function (err, rows) {
          if (err) throw err;
          var tablenames = _.pluck(rows, "name");

          // if the database schema is already setup; short-circuit
          if (
            _.contains(tablenames, "movie") &&
            _.contains(tablenames, "genre")
          )
            return;

          // else create the 2 tables we need
          var tables = [
            ["movie", "varchar(255)"],
            ["genre", "varchar(100)"],
          ];
          var createTableSql =
            "CREATE TABLE $1 (pk varchar(32) PRIMARY KEY, name $2, genre_fks varchar(255))";
          async.Each(tables, function (table) {
            runDB(table, createTableSql);
          });
          // & populate the genres table
          var genres = [
            "Action & Adventure",
            "Kids & Family",
            "Sci-Fi & Fantasy",
          ];
          var insertSql = "INSERT INTO genre (pk, name) VALUES ($1, $2)";
          async.Each(genres, function (genre) {
            var vals = [createUUID(), genre];
            runDB(vals, insertSql);
          });
          return;
        }
      );
    }))
  );
}

function runDB(data, sql) {
  db.run(sql, data, function (err) {
    if (err) reject();
  });
}

function createUUID() {
  return uuid.v4().replace(/-/g, "");
}

setupDatabase()
  .then(requestHandlers())
  .catch((err) => {
    throw err;
  });

module.exports = app;
