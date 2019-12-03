require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const moviedex = require('./moviedex.json');

const app = express();

app.use(cors());
app.use(helmet());

app.use(morgan('dev'));

app.use(function validateBearerToken(req, res, next) {
  const apiToken = process.env.API_TOKEN;
  const authToken = req.get('Authorization');

  console.log('validate bearer token middleware');
  // move to the next middleware
  if (!authToken || authToken.split(' ')[1] !== apiToken) {
    return res.status(401).json({ error: 'Unauthorized request' });
  }
  next();
});


const validTypes = [
  'genre',
  'country',
  'avg_vote',
];

app.get('/movies', sortBy);

function sortBy(req, res) {
  const { genre, country, avg_vote } = req.query;
  if (genre) {
    sortByGenre(res, genre);
  } else if (country) {
    sortByCountry(res, country);
  } else if (avg_vote) {
    sortByAvgVote(res, avg_vote);
  } else {
    res.json(moviedex);
  }
}


function sortByGenre(res, genre) {
  let filteredList = moviedex.filter(movie =>
    movie.genre.toLowerCase().includes(genre.toLowerCase()));
  res.json(filteredList);
}
function sortByCountry(res, country) {
  let filteredList = moviedex.filter(movie =>
    movie.country.toLowerCase().includes(country.toLowerCase()));
  res.json(filteredList);
}
function sortByAvgVote(res, avg_vote) {
  let filteredList = moviedex.filter(movie =>
    Number(movie.avg_vote) >= Number(avg_vote));
  res.json(filteredList);
}



const PORT = 8080;

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
