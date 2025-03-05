import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../utils/firebase';
import Image from 'next/image';
import Head from 'next/head';
import Header from '../components/header';
import Navbar from '../components/navbar';

// Gegevens per user
interface Player {
  avatar: string;
  username?: string;
  points?: number;
  gamesPlayed?: number;
  level?: number;
  description?: string;
  streak?: number;
}

const ProfilePage: React.FC = () => {
  const [playerData, setPlayerData] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { email } = router.query; // Haal de email uit de URL query parameters

  const handleGoHome = () => {
    router.push("/friends");
  };


  useEffect(() => {
    if (email) {
      const fetchPlayerData = async () => {
        try {
          const playerRef = doc(db, 'users', email as string);
          const playerDoc = await getDoc(playerRef);

          if (playerDoc.exists()) {
            setPlayerData(playerDoc.data() as Player);
          } else {
            console.error("Player not found");
          }
        } catch (error) {
          console.error("Error fetching player data:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchPlayerData();
    }
  }, [email]);

  if (loading) {
    return <div>Loading player data...</div>;
  }

  if (!playerData) {
    return <div>Player not found.</div>;
  }

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{playerData.username}&#39;s Profile</title>
        </Head>

      <Header />
      <button className="goback-button" onClick={handleGoHome}>
          <i className="bi bi-arrow-left-circle"></i> Back
        </button>
      <div className="profile-section text-center">
        <div className="profile-image">
          <Image
            src={playerData.avatar || '/assets/default-avatar.jpg'}
            alt="Profile Avatar"
            width={150}
            height={150}
          />
        </div>

        <div className="username-section">
          <h2>{playerData.username ? playerData.username : 'N/A'}</h2>
        </div>
        <p>{playerData.description ? playerData.description : 'No description available'}</p>

        {/* Voeg hier andere gegevens toe die je wilt weergeven */}
        <div className="player-stats">
          <p>Streak: {playerData.streak || 0}</p>
          <p>Points: {playerData.points || 0}</p>
          <p>Games Played: {playerData.gamesPlayed || 0}</p>
          <p>Level: {playerData.level || '0'}</p>
        </div>
      </div>

      <Navbar />
    </>
  );
};

export default ProfilePage;
