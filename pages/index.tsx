import React, { useState, useEffect } from "react";
import Image from "next/image";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { supabase } from "../utils/supabaseClient";

const HomePage: React.FC = () => {
  const [user, setUser] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };








  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error fetching user session:", error.message);
        router.push("/login");
      } else {
        if (!data.session) {
          router.push("/login");
        } else {
          setUser(data.session.user);
        }
      }
      setLoading(false);
    };

    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          setUser(session.user);
        } else {
          router.push("/login");
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);






  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };







  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
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


        
      <header className="header">
        <div className="logo">
          <Image src="/assets/logo.png" alt="Logo" width={100} height={100} />
        </div>
          <div className="hamburger-menu" onClick={toggleMenu}>
          <div className="hamburger-icon"></div>
          <div className="hamburger-icon"></div>
          <div className="hamburger-icon"></div>
        </div>

        {menuOpen && (
        <div className="menu">
          <div className="menu-item" onClick={handleLogout}>Logout</div>
          {/* Voeg hier meer menu-items toe */}
        </div>
      )}
      </header>



        <div className="profile-section text-center">
          <div className="profile-image">👑</div>
          <div className="profile-info">
            <h2 className="username">
              {user.user_metadata?.username ?? "N/A"}
            </h2>
            <p className="text-muted">Level: {user.user_metadata?.level ?? "N/A"}</p>
          </div>
        </div>

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

        </nav>
      </div>
    </>
  );
};

export default HomePage;
