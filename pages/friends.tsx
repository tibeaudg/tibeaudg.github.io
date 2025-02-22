import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { motion } from "framer-motion";

interface Friend {
  id: number;
  name: string;
  profileImage: string;
}

const HomePage: React.FC = () => {
  const [friends, setFriends] = useState<Friend[]>([]);

  useEffect(() => {
    // Simuleer een API-aanroep om vrienden op te halen
    const fetchFriends = async () => {
      // Vervang dit door je eigen API-aanroep
      const mockFriends: Friend[] = [
        { id: 1, name: "Vriend 1", profileImage: "https://via.placeholder.com/50" },
        { id: 2, name: "Vriend 2", profileImage: "https://via.placeholder.com/50" }
      ];
      setFriends(mockFriends);
    };

    fetchFriends();
  }, []);

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
        <h1 className="text-xl font-bold">Friends</h1>
      </header>

      <div className="friends-list-container">
        <ul className="friends-list">
          {friends.map((friend) => (
            <motion.li
              key={friend.id}
              className="friend-item"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <img
                src={friend.profileImage}
                alt={friend.name}
                className="friend-img"
              />
              <div className="friend-info">
                <p className="friend-name">{friend.name}</p>
                <div className="friend-actions">
                  <button className="view-profile">Bekijk profiel</button>
                  <button className="remove-friend">Verwijder</button>
                </div>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>

      <nav className="navbar">
        <Link href="/" className="nav-link">
          <i className="bi bi-house-door"></i>
          <span className="d-block small">Home</span>
        </Link>

        <Link href="/play" className="nav-link">
          <i className="bi bi-rocket"></i>
          <span className="d-block small">Play</span>
        </Link>

        <Link href="/friends" className="nav-link active">
          <i className="bi bi-people-fill"></i>
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
