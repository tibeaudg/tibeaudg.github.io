import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { supabase } from "../utils/supabaseClient"; // Zorg ervoor dat de Supabase-client wordt geïmporteerd

const HomePage: React.FC = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const session = supabase.auth.getSession();
    setUser(session?.user ?? null);

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login"; // Redirect naar login na het uitloggen
  };

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Disney Magic Quest</title>
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
          <div className="logout" onClick={handleLogout}>
            Logout
          </div>
        </header>

        {/* Profile Section */}
        <div className="profile-section text-center">
          <div className="profile-image">👑</div>
          <div className="profile-info">
            <h2 className="username">{user?.email ?? "Gast"}</h2> {/* Gebruik email of placeholder */}
            <p className="text-muted">Level: {user?.user_metadata?.level ?? "N/A"}</p>
          </div>
        </div>

        {/* Stats */}
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
