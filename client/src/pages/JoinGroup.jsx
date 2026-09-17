import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";

export default function JoinGroup() {
  const navigate = useNavigate();

  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post( "/groups/join",
        {
          code: code.toUpperCase(),
        }
      );
      navigate(`/group/${response.data.group._id}`);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to join group"
      );
    }
  };

  return (
    <div className="page">
      <Navbar />

      <div className="form-container card">
        <h1>Join Movie Night 🍿</h1>

        <p className="subtitle">
          Enter the group code shared by your friend.
        </p>

        {error && <p className="error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Group Code</label>

            <input
              className="input"
              placeholder="CM8F42"
              value={code}
              onChange={(e) =>
                setCode(e.target.value)
              }
              required
            />
          </div>

          <button className="btn btn-primary full">
            Join Movie Night
          </button>
        </form>
      </div>
    </div>
  );
}