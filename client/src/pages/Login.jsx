import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await api.post("/auth/login", form);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="form-container card">
        <div className="logo">
          Cine<span>Match</span> 🍿
        </div>

        <h1 style={{ marginTop: 25 }}>
          Welcome back
        </h1>

        <p className="subtitle">
          Find a movie everyone will love.
        </p>

        {error && <p className="error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              className="input"
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value,
                })
              }
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              className="input"
              type="password"
              value={form.password}
              onChange={(e) =>
                setForm({
                  ...form,
                  password: e.target.value,
                })
              }
              required
            />
          </div>

          <button className="btn btn-primary full">
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <p
          className="text-muted"
          style={{ marginTop: 20, textAlign: "center" }}
        >
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "#ef4444" }}>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}