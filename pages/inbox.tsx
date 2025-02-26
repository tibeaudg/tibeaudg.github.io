import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { motion } from "framer-motion";

interface Message {
  id: number;
  sender: string;
  subject: string;
  date: string;
  read: boolean;
}

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
    username: "Loading...",
  });

  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    // Simulate API call to fetch user stats
    const fetchUserStats = async () => {
      // Replace with actual API call
      const mockData: UserStats = {
        gamesPlayed: 120,
        correctAnswers: 95,
        level: 5,
        username: "John Doe",
      };
      setUserStats(mockData);
    };

    const fetchMessages = async () => {
      // Replace with actual API call
      const mockMessages: Message[] = [
        {
          id: 1,
          sender: "Jane",
          subject: "Magic Quest Update",
          date: "2025-02-22",
          read: false,
        },
        {
          id: 2,
          sender: "Mike",
          subject: "New Event",
          date: "2025-02-21",
          read: true,
        },
      ];
      setMessages(mockMessages);
    };

    fetchUserStats();
    fetchMessages();
  }, []);

  const calculateAccuracy = (): string => {
    const accuracy = (userStats.correctAnswers / userStats.gamesPlayed) * 100;
    return accuracy.toFixed(1);
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



      <main className="container">
        <motion.ul
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="messages-list"
        >
          {messages.map((message) => (
            <motion.li
              key={message.id}
              className={`message-item ${message.read ? "read" : "unread"}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="message-info">
                <p className="message-sender">{message.sender}</p>
                <p className="message-subject">{message.subject}</p>
                <p className="message-date">{message.date}</p>
              </div>
              <div className="message-actions">
                <button className="view-message">View</button>
                <button className="delete-message">Delete</button>
              </div>
            </motion.li>
          ))}
        </motion.ul>
      </main>


      <nav className="navbar">
          <Link href="/" className="nav-link">
            <i className="bi bi-house-door"></i>
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

          <Link href="/inbox" className="nav-link active">
            <i className="bi bi-envelope-paper-fill"></i>
            <span className="d-block small">Inbox</span>
          </Link>
        </nav>

    </>
  );
};

export default HomePage;
