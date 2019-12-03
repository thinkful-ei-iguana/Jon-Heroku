require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const moviedex = require('./moviedex.json');

const app = express();

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
  const { genre , country , avg_vote} = req.query;
  if (genre) {
    sortByGenre(res, genre);
  }else if (country) {
    sortByCountry();
  } else if (avg_vote) {
    sortByAvgVote();
  }else {
    res.json(moviedex);
  }
}


function sortByGenre(res, genre){
  
  let filteredList = moviedex.filter(movie =>
  movie.genre.toLowerCase() === genre.toLowerCase());
  res.json(filteredList);
}
function sortByCountry(){
  console.log('sort by country')
}
function sortByAvgVote(){
  console.log('sort by avgvote')
}



const PORT = 8080;

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
