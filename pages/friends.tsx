import React, { useEffect, useState, useRef } from 'react';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../utils/firebase";
import Head from 'next/head';
import Header from "../pages/components/header";
import Navbar from "../pages/components/navbar";

interface Player {
  email: string;
  username: string;
  points: number;
  avatar?: string;
}

const PlayerItem: React.FC<{ player: Player }> = ({ player }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);  // Added menuRef

  const toggleMenu = () => {
    setMenuOpen(prev => !prev);
  };

  const handleViewProfile = () => {
    console.log('Bekijk profiel van', player.email);
  };

  const handleRemoveFriend = () => {
    console.log('Verwijder vriend:', player.email);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <li className="player-item">
      <img
        src={player.avatar || '/default-avatar.png'}
        alt={`${player.username} avatar`}
        className="player-avatar"
      />
      <div className="player-info">
        <span className="player-name">{player.username || player.email}</span>
        <span className="player-points">{player.points} points</span>
      </div>
      <div className="hamburger-menu" ref={menuRef}> {/* Added menuRef */}
        <button className="hamburger-button" onClick={toggleMenu}>
          ☰
        </button>
        {menuOpen && (
          <div className="dropdown-content">
            <button onClick={handleViewProfile}>Bekijk profiel</button>
            <button className="remove" onClick={handleRemoveFriend}>Verwijder vriend</button>
          </div>
        )}
      </div>
    </li>
  );
};

const AllPlayers: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const playersCollection = collection(db, "users");
        const querySnapshot = await getDocs(playersCollection);
        const playersList: Player[] = [];
        querySnapshot.forEach(doc => {
          playersList.push({
            email: doc.id,
            ...doc.data()
          } as Player);
        });
        setPlayers(playersList);
      } catch (error) {
        console.error("Error fetching players: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  if (loading) {
    return <div>Loading players...</div>;
  }

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Disney Magic Quest - Spelers</title>
      </Head>

      <Header />

      <div className="players-container">
        <ul className="player-list">
          {players.map(player => (
            <PlayerItem key={player.email} player={player} />
          ))}
        </ul>
      </div>

      <Navbar />
    </>
  );
};

export default AllPlayers;
