import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { motion } from "framer-motion";


interface PlayerRanking {
  username: string;
  totalPoints: number;
  sessionsPlayed: number;
  lastPlayed: string;
}

const HomePage: React.FC = () => {


  const [playerRankings, setPlayerRankings] = useState<PlayerRanking[]>([]);

  useEffect(() => {


    // Load player rankings from localStorage
    const loadPlayerRankings = () => {
      try {
        const rankingsData = localStorage.getItem('playerRankings');
        if (rankingsData) {
          // Parse stored data
          const rankings: PlayerRanking[] = JSON.parse(rankingsData);
          
          // Sort by total points in descending order
          rankings.sort((a, b) => b.totalPoints - a.totalPoints);
          
          setPlayerRankings(rankings);
        }
      } catch (error) {
        console.error('Error loading player rankings:', error);
        // Set empty array if there's an error
        setPlayerRankings([]);
      }
    };

    loadPlayerRankings();
    
    // Add event listener to refresh rankings when returning to this page
    window.addEventListener('focus', loadPlayerRankings);
    
    // Clean up
    return () => {
      window.removeEventListener('focus', loadPlayerRankings);
    };
  }, []); 


  const renderRankingBoard = () => {
    return (
    <div className="card">
      <div className="scoreboard">
  
        {playerRankings.length > 0 ? (
          <div className="rankings-container">
            {playerRankings.map((player, index) => (
              <motion.div
                key={player.username}
                className={`player-ranking ${
                  index === 0 ? "first-place" : index === 1 ? "second-place" : index === 2 ? "third-place" : ""
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="rank-position">
                  {index === 0 && "🏆"}
                  {index === 1 && "🥈"}
                  {index === 2 && "🥉"}
                  {index > 2 && `#${index + 1}`}
                </div>
                <div className="player-info">
                  <span className="player-name">{player.username}</span>
                </div>
                <div className="total-points">{player.totalPoints} point(s)</div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="no-rankings">
            <p>No quiz sessions completed yet. Play a game to appear on the leaderboard!</p>
            <Link href="/play" className="start-game-button">
              <i className="bi bi-controller"></i> Start Playing
            </Link>
          </div>
        )}
      </div>
    </div>
    );
  };

  return (
    <>
      <Head>
        {/* Meta and title */}
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Disney Magic Quest</title>

        {/* External CSS files */}
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

      <div className="home-container">
        <main className="main-content">
          {renderRankingBoard()}
        </main>



        <div className="game-menu-container">
          <div className="how-to-play">
            <h4>Belangrijk!</h4>
            <p>
              Deze data wordt opgeslagen in de "Local Storage" van de browser<br />
              - Gelieve browsergegevens NIET te wissen<br />
            </p>
          </div>
        </div>



        <nav className="navbar">
          <Link href="/" className="nav-link active">
            <i className="bi bi-house-door-fill"></i>
            <span className="d-block small">Home</span>
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