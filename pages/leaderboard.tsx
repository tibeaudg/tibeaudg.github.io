import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../utils/firebase';
import Header from '../pages/components/header';
import Navbar from '../pages/components/navbar';

interface UserDoc {
  email: string;
  username: string;
  points: number;
  avatar?: string;
}

const Leaderboard: React.FC = () => {
  const [users, setUsers] = useState<UserDoc[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const usersCollection = collection(db, 'users');
        const leaderboardQuery = query(usersCollection, orderBy('points', 'desc'));
        const querySnapshot = await getDocs(leaderboardQuery);
        const usersList: UserDoc[] = [];

        querySnapshot.forEach(docSnap => {
          usersList.push({
            email: docSnap.id, // Document-ID wordt hier als email gebruikt
            ...docSnap.data()
          } as UserDoc);
        });

        setUsers(usersList);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="loading">
        <p>Loading leaderboard...</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Disney Magic Quest - Leaderboard</title>
      </Head>

      <Header />

      <main className="disney-leaderboard container">
        <ul className="user-list">
          {users.map((user, index) => (
            <li key={user.email} className="user-item">
              <span className="user-rank">{index + 1}.</span>
              <div className="user-info">
                <div className="avatar-container">
                  <img
                    src={user.avatar || '/default-avatar.png'}
                    alt={user.username || user.email}
                    className="avatar"
                  />
                </div>
                <div className="user-details">
                  <span className="username">{user.username || user.email}</span>
                  <span className="points-here">{user.points} points</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </main>

      <Navbar />
    </>
  );
};

export default Leaderboard;
