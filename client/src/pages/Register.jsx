import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");

      await api.post("/auth/register", form);

      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Registration failed"
      );
    }
  };

  return (
    <div className="page">
      <div className="form-container card">
        <div className="logo">
          Cine<span>Match</span> 🍿
        </div>

        <h1 style={{ marginTop: 25 }}>
          Create account
        </h1>

        <p className="subtitle">
          Start your next movie night.
        </p>

        {error && <p className="error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input
              className="input"
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
              required
            />
          </div>

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
            Create Account
          </button>
        </form>

        <p
          className="text-muted"
          style={{ marginTop: 20, textAlign: "center" }}
        >
          Already have an account?{" "}
          <Link to="/" style={{ color: "#ef4444" }}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}