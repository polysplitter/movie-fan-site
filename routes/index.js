const express = require('express');
let router = express.Router();
const request = require('request')

// https://www.themoviedb.org/documentation/api?language=en-US
const apiKey = ''

const apiBaseUrl = 'http://api.themoviedb.org/3';
const nowPlayingUrl = `${apiBaseUrl}/movie/now_playing?api_key=${apiKey}`;
const imageBaseUrl = 'http://image.tmdb.org/t/p/w300';

// middleware to include the image url so ejs can see it.
router.use((req, res, next) => {
  res.locals.imageBaseUrl = imageBaseUrl
  next()
})

/* GET home page. */
router.get('/', function(req, res, next) {

  // args: error, response, json/data
  request.get(nowPlayingUrl, (error, response, movieData) => {
    const parsedData = JSON.parse(movieData)
    res.render('index', {
      parsedData: parsedData.results
    })
  })
})

router.get('/movie/:id', (req, res, next) => {
  // res.json(req.params.id);
  const movieId = req.params.id
  const thisMovieUrl = `${apiBaseUrl}/movie/${movieId}?api_key=${apiKey}`

  request.get(thisMovieUrl, (error, response, movieData) => {
    const parsedData = JSON.parse(movieData)
    res.render('single-movie', {
      movie: parsedData
    })
  })
})

router.post('/search', (req, res, next) => {
  const userSearchTerm = encodeURI(req.body.movieSearch)
  const cat = req.body.cat
  const movieUrl = `${apiBaseUrl}/search/${cat}?query=${userSearchTerm}&api_key=${apiKey}`
  request.get(movieUrl, (error, response, movieData) => {
    let parsedData = JSON.parse(movieData)

    // lots of bugs around search.
    if(cat == "person") {
      parsedData.results = parsedData.results[0].known_for
    }

    res.render('index', {
      parsedData: parsedData.results
    })
  })
})

module.exports = router;
