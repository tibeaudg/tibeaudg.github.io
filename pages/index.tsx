import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";

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
        <div>

          <div className="stats-inline">
            <h4>Games Played</h4>
            <p>120</p>
          </div>

          <div className="stats-inline">
            <h4>Correct Answers</h4>
            <p>95</p>
          </div>

          <div className="stats-inline">
            <h4>Accuracy Percentage</h4>
            <p>95%</p>
          </div>

        </div>

        <nav className="navbar">
          <Link href="/" className="nav-link active">
            <i className="bi bi-house-door-fill"></i>
            <span className="d-block small">Home</span>
          </Link>

          <Link href="/leaderboard" className="nav-link">
            <i className="bi bi-bar-chart-line"></i>
            <span className="d-block small">Ranking</span>
          </Link>

          <Link href="/play" className="nav-link">
            <i className="bi bi-rocket"></i>
            <span className="d-block small">Play</span>
          </Link>

          <Link href="/friends" className="nav-link">
            <i className="bi bi-people"></i>
            <span className="d-block small">Friends</span>
          </Link>

          <Link href="/inbox" className="nav-link">
            <i className="bi bi-envelope-paper"></i>
            <span className="d-block small">Inbox</span>
          </Link>
        </nav>

      </div>
    </>
  );
};

export default HomePage;