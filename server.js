var pg = require('pg.js')
var express = require('express');
var uuid = require('uuid');
var assert = require('assert');
var _ = require('underscore');

var app = express();
app.use(express.bodyParser());

assert(process.env.DATABASE_URL, "DATABASE_URL environment variable not set");

var client;
setupDatabase(function() {

  // A (more-or-less) RESTful JSON API for the client-side Javascript to talk to

  app.get('/genres', function(req, res) {
    client.query('SELECT * FROM genre', function(err, result) {
      if (err) throw err;
      res.send(result.rows);
    });
  });

  app.get('/movies', function(req, res) {
    client.query('SELECT * FROM movie', function(err, result) {
      if (err) throw err;
      var movies = result.rows;
      movies.forEach(function(movie) {
        if (movie.genre_fks)
          movie.genre_fks = movie.genre_fks.split(',');
      });
      res.send(movies);
    });
  });

  app.get('/movies/:pk', function(req, res) {
    client.query('SELECT * FROM movie WHERE pk=$1', [req.params.pk], function(err, result) {
      if (err) throw err;
      var movie = result.rows[0];
      if (movie.genre_fks)
        movie.genre_fks = movie.genre_fks.split(',');
      res.send(movie);
    });
  });

  app.put('/movies/:pk', function(req, res) {
    var movie = req.body;
    if (movie.genre_fks)
      movie.genre_fks = movie.genre_fks.join(',');
    client.query('UPDATE movie SET name=$1, genre_fks=$2 WHERE pk=$3', [movie.name, movie.genre_fks, req.params.pk], function(err) {
      if (err) throw err;
      res.send(movie);
    });
  });

  app.post('/movies', function(req, res) {
    var movie = req.body;
    if (movie.genre_fks)
      movie.genre_fks = movie.genre_fks.join(',');
    movie.pk = createUUID();
    client.query('INSERT INTO movie (pk, name, genre_fks) VALUES ($1, $2, $3)', [movie.pk, movie.name, movie.genre_fks], function(err) {
      if (err) throw err;
      res.send(movie);
    });
  });

  app.delete('/movies/:pk', function(req, res) {
    client.query('DELETE FROM movie WHERE pk=$1', [req.params.pk], function(err) {
      if (err) throw err;
      // jQuery interprets it as an error if we don't return JSON
      res.send({'deleted': true});
    });
  });

  app.delete('/movies', function(req, res) {
    client.query('DELETE FROM movie', function(err) {
      if (err) throw err;
      // jQuery interprets it as an error if we don't return JSON
      res.send({'deleted': true});
    });
  });

  app.use(express.static(__dirname + '/public'));

  app.listen(3000);
});


function setupDatabase(callback) {
  client = new pg.Client(process.env.DATABASE_URL);
  client.connect(function(err) {
    if (err) throw err;
    client.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public'", function(err, result) {
      if (err) throw err;
      var tablenames = _.pluck(result.rows, 'table_name');

      // if the database schema is already setup; short-circuit
      if (_.contains(tablenames, 'movie') && _.contains(tablenames, 'genre'))
        return callback();

      // Note: both the table creation & population below are DRY violations that a code review would catch
      //   Normally we would write these as a callback loop via async.forEach() or generators
      //   but for the sake of simplicity, I'm leaving them as nested callbacks

      // else create the 2 tables we need
      client.query('CREATE TABLE movie (pk varchar(32) PRIMARY KEY, name varchar(255), genre_fks varchar(255))', function(err) {
        if (err) throw err;
        client.query('CREATE TABLE genre (pk varchar(32) PRIMARY KEY, name varchar(100))', function(err) {
          if (err) throw err;

          // & populate the genres table
          client.query('INSERT INTO genre (pk, name) VALUES ($1, $2)', [createUUID(), 'Action & Adventure'], function(err) {
            if (err) throw err;
            client.query('INSERT INTO genre (pk, name) VALUES ($1, $2)', [createUUID(), 'Kids & Family'], function(err) {
              if (err) throw err;
              client.query('INSERT INTO genre (pk, name) VALUES ($1, $2)', [createUUID(), 'Sci-Fi & Fantasy'], function(err) {
                if (err) throw err;
                callback();
              });
            });
          });
        });
      });
    });
  });
}

function createUUID() {
  return uuid.v4().replace(/-/g, '');
}