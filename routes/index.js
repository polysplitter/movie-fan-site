var express = require('express');
var router = express.Router();
const request = require('request')

const apiKey = '1fb720b97cc13e580c2c35e1138f90f8'

const apiBaseUrl = 'http://api.themoviedb.org/3';
const nowPlayingUrl = `${apiBaseUrl}/movie/now_playing?api_key=${apiKey}`;
const imageBaseUrl = 'http://image.tmdb.org/t/p/w300';

/* GET home page. */
router.get('/', function(req, res, next) {

  // args: error, response, json/data
  request.get(nowPlayingUrl, (error, response, movieData) => {
    console.log("====================The error====================")
    console.log(error)
    console.log("===================The Response===================")
    console.log(response)
  })

  res.render('index');
});

module.exports = router;
