const indianMovies = [
  {
    id: 1,
    title: "RRR",
    language: "te",
    rating: 8.0,
    duration: 187,
    genres: ["Action", "Drama"],
    overview:
      "A fictional story about two revolutionaries who form an unexpected friendship."
  },
  {
    id: 2,
    title: "Jai Bhim",
    language: "ta",
    rating: 8.7,
    duration: 164,
    genres: ["Drama", "Crime"],
    overview:
      "A lawyer fights for justice for an oppressed tribal community."
  },
  {
    id: 3,
    title: "Drishyam 2",
    language: "hi",
    rating: 8.2,
    duration: 140,
    genres: ["Crime", "Thriller", "Drama"],
    overview:
      "A family tries to protect itself when an old case threatens to return."
  },
  {
    id: 4,
    title: "Kantara",
    language: "kn",
    rating: 8.2,
    duration: 148,
    genres: ["Action", "Drama", "Thriller"],
    overview:
      "A conflict between tradition, land and power unfolds in a rural community."
  },
  {
    id: 5,
    title: "Premalu",
    language: "ml",
    rating: 7.8,
    duration: 156,
    genres: ["Romance", "Comedy", "Drama"],
    overview:
      "A young man's life changes after he develops feelings for someone he meets unexpectedly."
  },
  {
    id: 6,
    title: "12th Fail",
    language: "hi",
    rating: 8.8,
    duration: 147,
    genres: ["Drama"],
    overview:
      "A determined young man struggles against difficult circumstances while pursuing his dream."
  },
  {
    id: 7,
    title: "Sita Ramam",
    language: "te",
    rating: 8.5,
    duration: 163,
    genres: ["Romance", "Drama"],
    overview:
      "A mysterious letter connects two people across time and distance."
  },
  {
    id: 8,
    title: "Vikram",
    language: "ta",
    rating: 8.3,
    duration: 174,
    genres: ["Action", "Thriller", "Crime"],
    overview:
      "A special agent investigates a dangerous criminal network."
  },
  {
    id: 9,
    title: "Kumbalangi Nights",
    language: "ml",
    rating: 8.5,
    duration: 135,
    genres: ["Drama", "Romance"],
    overview:
      "Four brothers living together navigate family relationships and change."
  },
  {
    id: 10,
    title: "Andhadhun",
    language: "hi",
    rating: 8.2,
    duration: 139,
    genres: ["Thriller", "Crime", "Comedy"],
    overview:
      "A pianist becomes involved in a mysterious crime after witnessing something unexpected."
  }
];

const getIndianMovies = () => {
  return indianMovies;
};

module.exports = {
  getIndianMovies
};
