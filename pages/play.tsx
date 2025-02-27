import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "../utils/supabaseClient";
import { useState } from "react";
import router from "next/router";



const HomePage: React.FC = () => {

  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };


  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };


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


      <header className="header">
        <div className="logo">
          <Image src="/assets/Magic Quest.png" alt="Logo" width={100} height={100} />
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
          
        <div className="game-mode-container">
          <div className="game-mode-card">
            <Link href="/game/quiz-master" passHref>
              <div className="game-mode-card-content quiz-master">
                <div className="icon">
                  <i className="bi bi-people-fill"></i>
                </div>
                <div className="mode-title">Quiz Master Mode</div>
                <div className="mode-description">
                  One player reads questions while others answer
                </div>
              </div>
            </Link>
          </div>

          <div className="game-mode-card coming-soon">
            <Link href="/game/live" passHref>
              <div className="game-mode-card-content live-mode">
                <div className="icon">
                  <i className="bi bi-lightning-charge-fill"></i>
                </div>
                <div className="mode-title">Live Mode</div>
                <div className="mode-description">
                  Compete in real-time with other players
                </div>
              </div>
            </Link>
          </div>
        </div>
        
      </div>

      <nav className="navbar">
          <Link href="/" className="nav-link">
            <i className="bi bi-house-door"></i>
            <span className="d-block small">Home</span>
          </Link>

          <Link href="/leaderboard" className="nav-link">
            <i className="bi bi-bar-chart-line"></i>
            <span className="d-block small">Ranking</span>
          </Link>

          <Link href="/play" className="nav-link active">
            <i className="bi bi-rocket-fill"></i>
            <span className="d-block small">Play</span>
          </Link>

          <Link href="/friends" className="nav-link">
            <i className="bi bi-people"></i>
            <span className="d-block small">Friends</span>
          </Link>

        </nav>


    </>
  );
};

export default HomePage;
