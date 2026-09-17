import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";

export default function Dashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const [groups, setGroups] = useState([]);

  useEffect(() => {
    // If your backend has a "my groups" endpoint,
    // call it here.
    //
    // Example:
    // api.get("/groups/my").then(res => setGroups(res.data));
  }, []);

  return (
    <div className="page">
      <Navbar />

      <main className="container">
        <section className="hero">
          <h1>
            What are we <span>watching?</span>
          </h1>

          <p>
            Stop spending 30 minutes deciding what to watch.
            Create a movie night, collect everyone's preferences,
            and let CineMatch find the best Indian movies for your group.
          </p>
        </section>

        <div className="grid grid-2">
          <div
            className="card action-card"
            onClick={() =>
              navigate("/create-group")
            }
          >
            <div className="action-icon">🎬</div>
            <h3>Create Movie Night</h3>
            <p>
              Start a new movie night and invite your friends
              with a simple group code.
            </p>
          </div>

          <div
            className="card action-card"
            onClick={() =>
              navigate("/join-group")
            }
          >
            <div className="action-icon">🍿</div>
            <h3>Join Movie Night</h3>
            <p>
              Enter your friend's group code and join their
              movie selection.
            </p>
          </div>
        </div>

        <section style={{ marginTop: 60 }}>
          <h2 className="section-title">
            Welcome, {user.name || "Movie Lover"} 👋
          </h2>

          {groups.length === 0 ? (
            <div className="card">
              <p className="text-muted">
                Your movie nights will appear here.
              </p>
            </div>
          ) : (
            <div className="grid grid-2">
              {groups.map((group) => (
                <div
                  className="card group-card"
                  key={group._id}
                >
                  <h3>{group.name}</h3>

                  <p
                    className="text-muted"
                    style={{ margin: "10px 0" }}
                  >
                    {group.members?.length || 0} members
                  </p>

                  <button
                    className="btn btn-secondary"
                    onClick={() =>
                      navigate(`/group/${group._id}`)
                    }
                  >
                    Open Group
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}