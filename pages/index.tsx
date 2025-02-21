import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import "../styles/index.css"; // Eigen styles importeren

const HomePage: React.FC = () => {
  // Simuleer het ophalen van sessiegegevens voor de gebruiker
  const [username, setUsername] = useState<string>("Loading...");
  const [level, setLevel] = useState<number>(0);

  useEffect(() => {
    // Deze code simuleert het ophalen van gebruikersinformatie (gebruik een echte API als nodig)
    setUsername("John Doe"); // Dit zou uit je backend moeten komen
    setLevel(5); // Dit zou ook dynamisch moeten zijn
  }, []);

  return (
    <>
      <Head>
        {/* Meta en titel */}
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Disney Magic Quest</title>

        {/* External CSS bestanden */}
        <link
          rel="stylesheet"
          href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
        />
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css"
        />
      </Head>

      <div>
        {/* Header */}
        <header className="header">
          <div
            className="logout"
            onClick={() => (window.location.href = "/logout")}
          >
            Logout
          </div>
        </header>

        {/* Profile Section */}
        <div className="profile-section text-center">
          <div className="profile-image">👑</div>
          <div className="profile-info">
            <h2 className="username">{username}</h2>
            <p className="text-muted">Level: {level}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-inline">
          <div>
            <h4>Games Played</h4>
            <p>120</p>
          </div>
          <div>
            <h4>Correct Answers</h4>
            <p>95</p>
          </div>
        </div>

        {/* Button to start playing */}
        <div className="text-center mt-4">
          <Link legacyBehavior href="/play">
            <a className="button">Start Playing</a>
          </Link>
        </div>

        {/* Bottom Navigation Bar */}
        <nav className="navbar fixed-bottom bg-body-tertiary border-top">
          <div className="container-fluid d-flex justify-content-around align-items-center py-2">
            <Link legacyBehavior href="/">
              <a className="nav-link active text-center text-dark">
                <i className="bi bi-house-door-fill fs-4"></i>
                <span className="d-block small">Home</span>
              </a>
            </Link>
            <Link legacyBehavior href="/play">
              <a className="nav-link text-center text-dark">
                <i className="bi bi-controller fs-4"></i>
                <span className="d-block small">Play</span>
              </a>
            </Link>
            <Link legacyBehavior href="/friends">
              <a className="nav-link text-center text-dark">
                <i className="bi bi-people fs-4"></i>
                <span className="d-block small">Friends</span>
              </a>
            </Link>
            <Link legacyBehavior href="/inbox">
              <a className="nav-link text-center text-dark">
                <i className="bi bi-chat fs-4"></i>
                <span className="d-block small">Inbox</span>
              </a>
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
};

export default HomePage;
