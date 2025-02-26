import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router"; // Import useRouter from Next.js
import { supabase } from "../utils/supabaseClient"; // Zorg ervoor dat de Supabase-client wordt geïmporteerd

const HomePage: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter(); // Initialize the router

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error fetching user session:", error);
        router.push("/login"); // Redirect to login if there's an error fetching the session
      } else {
        if (!data.session) {
          router.push("/login"); // Redirect to login if there's no active session
        } else {
          setUser(data.session.user);
        }
      }
      setLoading(false); // Set loading to false after fetching the user
    };

    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          setUser(session.user);
        } else {
          router.push("/login"); // Redirect to login if the session is null
        }
      }
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login"); // Redirect to login after logging out
  };

  if (loading) {
    return <div>Loading...</div>; // Show a loading spinner while checking the session
  }

  if (!user) {
    return null; // Return null or a loading spinner while checking the session
  }

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
          {user && (
            <div className="logout" onClick={handleLogout}>
              Logout
            </div>
          )}
        </header>

        {/* Profile Section */}
        {user ? (
          <div className="profile-section text-center">
            <div className="profile-image">👑</div>
            <div className="profile-info">
              <h2 className="username">{user.user_metadata.username ?? "N/A"}</h2> {/* Gebruik username of placeholder */}
              <p className="text-muted">Level: {user.user_metadata?.level ?? "N/A"}</p>
            </div>
          </div>
        ) : (
          <p>Gelieve in te loggen om je profiel te bekijken.</p>
        )}

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
