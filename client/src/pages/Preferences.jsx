import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";

const genres = [
  "Action",
  "Comedy",
  "Drama",
  "Thriller",
  "Romance",
  "Horror",
  "Crime",
  "Sci-Fi",
];

const languages = [
  "Hindi",
  "Telugu",
  "Tamil",
  "Malayalam",
  "Kannada",
  "Bengali",
  "Marathi",
  "Punjabi",
];

export default function Preferences() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [selectedGenres, setSelectedGenres] =
    useState([]);

  const [selectedLanguages, setSelectedLanguages] =
    useState([]);

  const [minRating, setMinRating] = useState(7);
  const [maxDuration, setMaxDuration] =
    useState(180);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleValue = (
    value,
    list,
    setList
  ) => {
    if (list.includes(value)) {
      setList(
        list.filter((item) => item !== value)
      );
    } else {
      setList([...list, value]);
    }
  };

  const submitPreferences = async (e) => {
    e.preventDefault();

    if (selectedGenres.length === 0) {
      setError("Select at least one genre.");
      return;
    }

    if (selectedLanguages.length === 0) {
      setError("Select at least one language.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await api.put(
        `/groups/${id}/preferences`,
        {
          genres: selectedGenres,
          languages: selectedLanguages,
          minRating: Number(minRating),
          maxDuration: Number(maxDuration),
        }
      );

      navigate(`/group/${id}`);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to save preferences"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <Navbar />

      <main
        className="container"
        style={{ maxWidth: 850 }}
      >
        <div className="hero">
          <p className="text-muted">
            YOUR MOVIE TASTE
          </p>

          <h1 style={{ fontSize: 55 }}>
            What do you want to watch?
          </h1>

          <p>
            Tell CineMatch what you're looking for.
            We'll find the best Indian movies for
            your group.
          </p>
        </div>

        <form onSubmit={submitPreferences}>
          {error && (
            <p className="error">{error}</p>
          )}

          <div className="card">
            <h3>Preferred Languages</h3>

            <div
              className="preference-option"
              style={{ marginTop: 20 }}
            >
              {languages.map((language) => (
                <button
                  type="button"
                  key={language}
                  className={`option ${
                    selectedLanguages.includes(
                      language
                    )
                      ? "selected"
                      : ""
                  }`}
                  onClick={() =>
                    toggleValue(
                      language,
                      selectedLanguages,
                      setSelectedLanguages
                    )
                  }
                >
                  {selectedLanguages.includes(
                    language
                  )
                    ? "✓ "
                    : ""}
                  {language}
                </button>
              ))}
            </div>
          </div>

          <div
            className="card"
            style={{ marginTop: 20 }}
          >
            <h3>Preferred Genres</h3>

            <div
              className="preference-option"
              style={{ marginTop: 20 }}
            >
              {genres.map((genre) => (
                <button
                  type="button"
                  key={genre}
                  className={`option ${
                    selectedGenres.includes(genre)
                      ? "selected"
                      : ""
                  }`}
                  onClick={() =>
                    toggleValue(
                      genre,
                      selectedGenres,
                      setSelectedGenres
                    )
                  }
                >
                  {selectedGenres.includes(genre)
                    ? "✓ "
                    : ""}
                  {genre}
                </button>
              ))}
            </div>
          </div>

          <div
            className="grid grid-2"
            style={{ marginTop: 20 }}
          >
            <div className="card">
              <h3>Minimum Rating</h3>

              <p
                style={{
                  fontSize: 35,
                  fontWeight: 800,
                  margin: "15px 0",
                }}
              >
                {minRating}
              </p>

              <input
                type="range"
                min="5"
                max="9"
                step="0.1"
                value={minRating}
                onChange={(e) =>
                  setMinRating(e.target.value)
                }
                style={{ width: "100%" }}
              />
            </div>

            <div className="card">
              <h3>Maximum Duration</h3>

              <p
                style={{
                  fontSize: 35,
                  fontWeight: 800,
                  margin: "15px 0",
                }}
              >
                {maxDuration} min
              </p>

              <input
                type="range"
                min="90"
                max="240"
                step="10"
                value={maxDuration}
                onChange={(e) =>
                  setMaxDuration(e.target.value)
                }
                style={{ width: "100%" }}
              />
            </div>
          </div>

          <button
            className="btn btn-primary"
            style={{
              marginTop: 25,
              width: "100%",
              padding: 16,
            }}
          >
            {loading
              ? "Saving..."
              : "Save My Preferences 🎬"}
          </button>
        </form>
      </main>
    </div>
  );
}