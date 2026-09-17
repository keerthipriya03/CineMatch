import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import MovieCard from "../components/MovieCard";
import api from "../services/api";

export default function Results() {
  const { id } = useParams();

  console.log("RESULTS GROUP ID:", id);

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getRecommendations = async () => {
      try {
        const response = await api.get(
          `/groups/${id}/recommendations`
        );

        console.log("RECOMMENDATION RESPONSE:", response.data);
        setMovies(
          // Array.isArray(response.data.recommendations)
          // ? response.data.recommendations
          // : []
          Array.isArray(response.data.movies)
          ? response.data.movies
          : []
        );

      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Unable to get recommendations"
        );
      } finally {
        setLoading(false);
      }
    };

    getRecommendations();
  }, [id]);

  if (loading) {
    return (
      <div className="page">
        <Navbar />

        <div
          className="container"
          style={{
            textAlign: "center",
            paddingTop: 100,
          }}
        >
          <h1>Finding your movie... 🍿</h1>

          <p
            className="text-muted"
            style={{ marginTop: 15 }}
          >
            Comparing everyone's preferences.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <Navbar />

        <div className="container">
          <p className="error">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <Navbar />

      <main className="container">
        <div className="hero">
          <p className="text-muted">
            YOUR CINEMATCH RESULTS
          </p>

          <h1 style={{ fontSize: 55 }}>
            Tonight's <span>Top Picks</span> 🍿
          </h1>

          <p>
            Based on the combined preferences of
            everyone in your movie night.
          </p>
        </div>

        {movies.length === 0 ? (
          <div className="card">
            <h3>No movies found.</h3>

            <p
              className="text-muted"
              style={{ marginTop: 10 }}
            >
              Try relaxing your language, genre,
              rating, or duration preferences.
            </p>
          </div>
        ) : (
          <>
            <div className="movie-grid">
              {movies
                .slice(0, 3)
                .map((movie, index) => (
                  <MovieCard
                    key={
                      movie.id ||
                      movie._id ||
                      index
                    }
                    movie={movie}
                    top={index === 0}
                  />
                ))}
            </div>

            {movies.length > 3 && (
              <section style={{ marginTop: 60 }}>
                <h2 className="section-title">
                  More Matches
                </h2>

                <div className="movie-grid">
                  {movies
                    .slice(3)
                    .map((movie, index) => (
                      <MovieCard
                        key={
                          movie.id ||
                          movie._id ||
                          index
                        }
                        movie={movie}
                      />
                    ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}