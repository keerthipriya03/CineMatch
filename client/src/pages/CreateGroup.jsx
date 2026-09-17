import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";

export default function CreateGroup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await api.post("/groups", {
        name,
      });

      navigate(`/group/${response.data.group._id}`);
    } 
    // catch (err) {
    //   setError(
    //     err.response?.data?.message ||
    //       "Unable to create group"
    //   );
    // } 
    catch (error) {
        console.error("Create group error:", error);
        console.error("Server response:", error.response?.data);
        console.error("Status:", error.response?.status);

        // alert(
        //     error.response?.data?.message ||
        //     "Failed to create movie night"
        // );
        setError(
          error.response?.data?.message ||
          "Failed to create movie night"
        );
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <Navbar />

      <div className="form-container card">
        <h1>Create Movie Night 🎬</h1>

        <p className="subtitle">
          Give your movie night a name.
        </p>

        {error && <p className="error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Movie Night Name</label>

            <input
              className="input"
              placeholder="Saturday Movie Night"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              required
            />
          </div>

          <button className="btn btn-primary full">
            {loading
              ? "Creating..."
              : "Create Movie Night"}
          </button>
        </form>
      </div>
    </div>
  );
}