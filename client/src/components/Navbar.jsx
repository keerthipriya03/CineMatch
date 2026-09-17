import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="logo">
        Cine<span>Match</span> 🍿
      </div>

      <div className="nav-right">
        <button className="btn btn-secondary" onClick={logout}>
          Logout
        </button>
      </div>
    </nav>
  );
}