export default function MovieCard({
  movie,
  top = false,
}) {
  const poster = movie.poster
    ? movie.poster.startsWith("http")
      ? movie.poster
      : `https://image.tmdb.org/t/p/w500${movie.poster}`
    : "https://via.placeholder.com/500x750?text=No+Poster";

  return (
    <div
      className={`movie-card ${
        top ? "top-match" : ""
      }`}
    >
      <img
        className="movie-poster"
        src={poster}
        alt={movie.title}
      />

      <div className="movie-content">
        {top && (
          <p
            style={{
              color: "#ef4444",
              fontWeight: 700,
              marginBottom: 8,
            }}
          >
            🏆 TOP MATCH
          </p>
        )}

        <h3>{movie.title}</h3>

        <div className="movie-meta">
          <span>⭐ {movie.rating}</span>
          <span>
            {movie.duration
              ? `${movie.duration} min`
              : "N/A"}
          </span>
        </div>

        <span className="match">
          {Math.round(movie.matchScore)}% Match
        </span>
      </div>
    </div>
  );
}