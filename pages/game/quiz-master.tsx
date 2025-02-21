import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from 'next/router'; // Gebruik van useRouter
import "../../styles/index.css";
import "../../styles/play.css";
import "../../styles/quizmaster.css";

const GameMenu: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [usernameList, setUsernameList] = useState<string[]>([]); // Lijst om de gebruikersnamen op te slaan
  const router = useRouter(); // Hook om de router te gebruiken

  const handleJoinQueue = () => {
    if (username) {
      setUsernameList((prevList) => [...prevList, username]); // Voeg de gebruiker toe aan de lijst
      setUsername(""); // Leeg het invoerveld na toevoeging
    }
  };

  const handleStartGame = () => {
    // Zet de lijst met gebruikersnamen in de query string
    router.push({
      pathname: "/game/quiz-master-start", 
      query: { players: JSON.stringify(usernameList) }
    });
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
        <header className="headerqz">
          <Link href="/play" passHref>
            <div className="logout">
              <i className="bi bi-arrow-left-circle-fill"></i>
            </div>
          </Link>
          <div className="quiz-master-title-container">
            <h3 className="quiz-master-title">Quiz Master</h3>
          </div>
        </header>

        <div className="game-menu-container">
          <div className="game-menu-card">
            <input
              type="text"
              id="username"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
            />

            <button
              className="btn btn-primary"
              onClick={handleJoinQueue}
              disabled={!username} 
            >
              Add Player
            </button>

            <div className="mt-3">
              <ul>
                {usernameList.map((user, index) => (
                  <li key={index} className="user-item">{user}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {usernameList.length > 0 && (
          <button className="btn btn-success mt-3" onClick={handleStartGame}>
            Start Game
          </button>
        )}
      </div>
    </>
  );
};

export default GameMenu;
