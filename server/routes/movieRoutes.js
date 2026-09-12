const express = require("express");

const {
  getMovies
} = require("../controllers/movieController");

const router = express.Router();

router.get("/indian", getMovies);

module.exports = router;
