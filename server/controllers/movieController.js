const { getIndianMovies } = require("../services/movieService");

const getMovies = async (req, res) => {
  try {
    const movies = getIndianMovies();

    res.status(200).json({
      count: movies.length,
      movies
    });
  } catch (error) {
    console.error("GET MOVIES ERROR:", error);

    res.status(500).json({
      message: "Failed to get movies"
    });
  }
};

module.exports = {
  getMovies
};
