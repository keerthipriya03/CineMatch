const LANGUAGE_CODES = {
  Hindi: "hi",
  Telugu: "te",
  Tamil: "ta",
  Malayalam: "ml",
  Kannada: "kn",
  Bengali: "bn",
  Marathi: "mr",
  Punjabi: "pa"
};



const calculateMovieScore = (movie, preference) => {
  let score = 0;
  const reasons = [];

  // GENRE - 35 points

  const preferredGenres = preference.genres || [];

  const genreMatches = movie.genres.filter((genre) =>
    preferredGenres.includes(genre)
  );

  if (preferredGenres.length > 0) {
    if (genreMatches.length > 0) {
      score += 35;

      reasons.push(
        `Matches preferred genre: ${genreMatches.join(", ")}`
      );
    }
  } 
//   else {
    // score += 35;
    // reasons.push("No genre preference specified");
//   }

  // LANGUAGE - 25 points
  

  const preferredLanguages = preference.languages || [];

//   if (preferredLanguages.length > 0) {
//     if (preferredLanguages.includes(movie.language)) {
//       score += 25;

//       reasons.push("Matches preferred language");
//     }
//   } else {
//     score += 25;
//     reasons.push("No language preference specified");
//   }
const preferredLanguageCodes = preferredLanguages.map(
  (language) => LANGUAGE_CODES[language]
);

if (preferredLanguageCodes.includes(movie.language)) {
  score += 25;

  reasons.push("Matches preferred language");
}

  // RATING - 20 points

  const minRating = preference.minRating || 0;

  if (movie.rating >= minRating) {
    score += 20;

    reasons.push(
      `Rating ${movie.rating} meets minimum ${minRating}`
    );
  }

  // DURATION - 20 points

  const maxDuration = preference.maxDuration || 180;

  if (movie.duration <= maxDuration) {
    score += 20;

    reasons.push(
      `Duration ${movie.duration} min is within limit`
    );
  }

  return {
    score,
    reasons
  };
};


const calculateGroupRecommendations = (movies, members) => {
  const recommendations = movies.map((movie) => {
    let totalScore = 0;

    const memberScores = [];
    const allReasons = [];

    members.forEach((member) => {
      const result = calculateMovieScore(
        movie,
        member.preferences
      );

      totalScore += result.score;

      memberScores.push({
        user: member.user,
        score: result.score
      });

      allReasons.push(...result.reasons);
    });

    const groupScore =
      members.length > 0
        ? Math.round(totalScore / members.length)
        : 0;

    return {
      ...movie,
      matchScore: groupScore,
      memberScores,
      reasons: [...new Set(allReasons)]
    };
  });

  return recommendations.sort(
    (a, b) => b.matchScore - a.matchScore
  );
};


module.exports = {
  calculateMovieScore,
  calculateGroupRecommendations
};
