import React, { useEffect, useState } from 'react';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../utils/firebase";
import Head from 'next/head';
import Header from "../pages/components/header";
import Image from "next/image";
import Navbar from "../pages/components/navbar";

interface Player {
  email: string;
  username: string;
  points: number;
  avatar?: string;
}

const PlayerItem: React.FC<{ player: Player }> = ({ player }) => {



  return (
    <li className="player-item">
      <Image
        src={player.avatar || '/default-avatar.png'}
        alt={`${player.username} avatar`}
        className="player-avatar"
        width={100}  // Adjust this width according to your design
        height={100} // Adjust this height according to your design
      />



      <div className="player-info">
        <span className="player-name">{player.username || player.email}</span>
        <span className="player-points">{player.points} points</span>
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
