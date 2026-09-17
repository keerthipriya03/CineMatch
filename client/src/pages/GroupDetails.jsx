import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";

export default function GroupDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [group, setGroup] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadGroup = async () => {
      try {
        const response = await api.get( `/groups/${id}` );
        setGroup(response.data.group);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Unable to load group"
        );
      }
    };

    loadGroup();
  }, [id]);

  if (error) {
    return (
      <div className="page">
        <p className="error">{error}</p>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="page">
        <p className="text-muted">
          Loading group...
        </p>
      </div>
    );
  }

  // const completed =
  //   group.members?.filter(
  //     (member) => member.submitted
  //   ).length || 0;

  const completed =
    group.members?.filter(
      (member) => member.submitted
    ).length || 0;

  const totalMembers = group.members?.length || 0;

  const allSubmitted =
    totalMembers > 0 &&
    completed === totalMembers;

  return (
    <div className="page">
      <Navbar />

      <main className="container">
        <div
          className="hero"
          style={{ paddingBottom: 30 }}
        >
          <p className="text-muted">
            MOVIE NIGHT
          </p>

          <h1 style={{ fontSize: 50 }}>
            {group.name} 🍿
          </h1>
        </div>

        <div className="grid grid-2">
          <div className="card">
            <p className="text-muted">
              Share this code with your friends
            </p>

            <div className="code">
              {group.code}
            </div>

            <button
              className="btn btn-secondary"
              style={{ marginTop: 20 }}
              onClick={() =>
                navigator.clipboard.writeText(
                  group.code
                )
              }
            >
              Copy Code
            </button>
          </div>

          <div className="card">
            <h3>Preferences</h3>

            <p
              className="text-muted"
              style={{ marginTop: 10 }}
            >
              {completed} /{" "}
              {group.members?.length || 0} members
              completed
            </p>

            <div style={{ marginTop: 20 }}>
              {group.members?.map((member) => (
                <div
                  className="member"
                  key={member.user?._id || member.user}
                >
                  <span>
                    {member.user?.name ||
                      "Member"}
                  </span>

                  <span
                    className={`badge ${
                      member.submitted
                        ? "badge-success"
                        : "badge-warning"
                    }`}
                  >
                    {member.submitted
                      ? "Ready"
                      : "Waiting"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* <div
          className="card"
          style={{ marginTop: 20 }}
        >
          <h3>Ready for the movie?</h3>
          <p
            className="text-muted"
            style={{
              margin: "10px 0 20px",
            }}
          >
            Tell us what kind of movie you're in
            the mood for.
          </p>
          <button
            className="btn btn-primary"
            onClick={() => navigate(`/preferences/${id}`)}
          >
            Set My Preferences
          </button>

          {allSubmitted && (
            <button
              className="btn btn-secondary"
              style={{ marginLeft: 10 }}
              onClick={() => navigate(`/results/${id}`)}
            >
              Find Our Movies 🎬
            </button>
          )}
        </div> */}

        <div
          className="card"
          style={{ marginTop: 20 }}
        >
          <h3>
            {allSubmitted
              ? "Everyone is ready! 🎬"
              : "Waiting for everyone... 🍿"}
          </h3>

          <p
            className="text-muted"
            style={{
              margin: "10px 0 20px",
            }}
          >
            {allSubmitted
              ? "All members have submitted their preferences. Let's find your movie!"
              : `${completed} of ${totalMembers} members have submitted their preferences.`}
          </p>

          <button
            className="btn btn-primary"
            onClick={() =>
              navigate(`/preferences/${id}`)
            }
          >
            Set My Preferences
          </button>

          {allSubmitted && (
            <button
              className="btn btn-secondary"
              style={{ marginLeft: 10 }}
              onClick={() =>
                navigate(`/results/${id}`)
              }
            >
              Find Our Movies 🎬
            </button>
          )}
        </div>
      </main>
    </div>
  );
}