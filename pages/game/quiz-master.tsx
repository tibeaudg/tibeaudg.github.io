import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";

import { useRouter } from 'next/router'; // Gebruik van useRouter
import { signOut } from "@firebase/auth";
import { auth } from "@/utils/firebase";

const GameMenu: React.FC = () => {
  const [, setUsernameList] = useState<string[]>([]); // Lijst om de gebruikersnamen op te slaan
  const router = useRouter(); // Hook om de router te gebruiken

  // Hardcoded lijst van gebruikersnamen
  const hardcodedUsernames = ["Lotte", "Megan", "Florian", "Tibeau"];

  // Voeg hardcoded gebruikersnamen toe aan de lijst
  const handleStartGame = () => {
    setUsernameList(hardcodedUsernames); // Voeg de hardcoded gebruikers toe
    // Zet de lijst met gebruikersnamen in de query string en navigeer naar de game pagina
    router.push({
      pathname: "/game/quiz-master-start",
      query: { players: JSON.stringify(hardcodedUsernames) }
    });
  };

    const [menuOpen, setMenuOpen] = useState(false);
    const toggleMenu = () => {
      setMenuOpen(!menuOpen);
    };

    const handleLogout = async () => {
      await signOut(auth);
      router.push("/login");
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

      <div>
        <h3 className="title">Quiz Master</h3>

        <div className="game-menu-container">
          <div className="game-menu-card">
            <div className="mt-3">
              <ul>
                {hardcodedUsernames.map((user, index) => (
                  <li key={index} className="user-item">{user}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <button className="btn" onClick={handleStartGame}>
          Start Game
        </button>

        <div className="game-menu-container">
          <div className="how-to-play">
            <h4>How to Play</h4>
            <p>
              1. Eén speler leest de vragen voor<br />
              2. Iedere speler antwoord om de beurt<br />
              3. De voorlezer beantwoordt de vragen in naam van de spelers<br />
            </p>
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

export default GameMenu;
