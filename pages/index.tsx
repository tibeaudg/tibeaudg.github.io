import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { motion } from "framer-motion";

interface UserStats {
  gamesPlayed: number;
  correctAnswers: number;
  level: number;
  username: string;
}

const HomePage: React.FC = () => {
  const [userStats, setUserStats] = useState<UserStats>({
    gamesPlayed: 0,
    correctAnswers: 0,
    level: 0,
    username: "Loading..."
  });

  useEffect(() => {
    // Simulate API call to fetch user stats
    const fetchUserStats = async () => {
      // Replace with actual API call
      const mockData: UserStats = {
        gamesPlayed: 120,
        correctAnswers: 95,
        level: 5,
        username: "John Doe"
      };
      setUserStats(mockData);
    };

    fetchUserStats();
  }, []);

  const calculateAccuracy = (): string => {
    const accuracy = (userStats.correctAnswers / userStats.gamesPlayed) * 100;
    return accuracy.toFixed(1);
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

      <header className="header">
        <h1 className="text-xl font-bold">Magic Quest</h1>

      </header>

      <main className="container mx-auto px-4 pb-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="profile-section"
        >
          <div className="profile-image">
            <span role="img" aria-label="crown">👑</span>
          </div>
          
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">{userStats.username}</h2>
            <p className="text-gray-600">
              Level {userStats.level} Adventurer
            </p>
          </div>

          <div className="stats-grid">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="stat-card"
            >
              <h4>Quests Completed</h4>
              <p>{userStats.gamesPlayed}</p>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="stat-card"
            >
              <h4>Magic Accuracy</h4>
              <p>{calculateAccuracy()}%</p>
            </motion.div>
          </div>

          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-8"
          >
          </motion.div>
        </motion.div>
      </main>



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


    </>
  );
};

export default HomePage;