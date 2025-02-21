import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import "../../styles/index.css"; // Eigen styles importeren
import "../../styles/play.css"; // Eigen styles importeren
import "../../styles/quizmaster.css"; // Eigen styles importeren

const GameMenu: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [usernameList, setUsernameList] = useState<string[]>([]); // Lijst om de gebruikersnamen op te slaan

  const handleJoinQueue = () => {
    if (username) {
      setUsernameList((prevList) => [...prevList, username]); // Voeg de gebruiker toe aan de lijst
      setUsername(""); // Leeg het invoerveld na toevoeging
    }
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
        {/* Header */}
        <header className="headerqz">
          {/* Go Back Button */}
          <Link href="/play" passHref>
            <div className="logout">
              <i className="bi bi-arrow-left-circle-fill"></i>
            </div>
          </Link>
          <div className="quiz-master-title-container">
            <h3 className="quiz-master-title">Quiz Master</h3>
            </div>

          <div
            dir="auto"
            className="css-text-146c3p1 r-color-kkedbh r-fontSize-1x35g6 r-fontWeight-vw2c0b r-marginBottom-1yflyrw r-textAlign-q4m81j">
          </div>
        </header>

        {/* Game Menu Content */}
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
              disabled={!username} // Zorg ervoor dat de knop uitgeschakeld is als er geen naam is
            >
              Add Player
            </button>



            {/* Lijst van gebruikersnamen */}
            <div className="mt-3">
              <ul>
                {usernameList.map((user, index) => (
                  <li key={index} className="user-item">{user}</li>
                ))}
              </ul>
            </div>






          </div>
        </div>

            {/* Start Game Button */}
            {usernameList.length > 0 && (
              <Link href="/game/start" passHref>
                <button className="btn btn-success mt-3">Start Game</button>
              </Link>
            )}


        
        <div className="how-to-play-container">
        <div className="how-to-play-card">
            <div className="how-to-play-title">How to Play:</div>
            <div className="how-to-play-step">• All players get the same questions</div>
            <div className="how-to-play-step">• Answer as quickly as possible</div>
            <div className="how-to-play-step">• Faster correct answers = More points</div>
            <div className="how-to-play-step">• First to reach 1000 points wins!</div>
        </div>
        </div>
      </div>
    </>
  );
};

export default GameMenu;
