import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { motion } from "framer-motion";
import Header from "../pages/components/header"; // Importeer je Header component
import Navbar from "../pages/components/navbar"; // Importeer je Navbar component





interface PlayerRanking {
  username: string;
  totalPoints: number;
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
                <div className="total-points">{player.totalPoints}</div>
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
    );
  };

  return (
    <>
      <Head>
        {/* Meta and title */}
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Disney Magic Quest</title>
      </Head>

      <Header /> {/* Hergebruik Header component */}


      <div>
        <main>
          {renderRankingBoard()}
        </main>

        <Navbar /> {/* Hergebruik Navbar component */}

      </div>
    </>
  );
};

export default HomePage;