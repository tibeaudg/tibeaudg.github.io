import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../utils/firebase";
import Header from "../pages/components/header"; // Importeer je Header component
import Navbar from "../pages/components/navbar"; // Importeer je Navbar component
import Head from 'next/head'; // Zorg ervoor dat je het 'Head' component van Next.js importeert

interface UserDoc {
  email: string;
  username: string;
  points: number;
  avatar?: string;
}

const Leaderboard: React.FC = () => {
  const [users, setUsers] = useState<UserDoc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        // Haal de gebruikers op, gesorteerd op 'points' aflopend
        const usersCollection = collection(db, "users");
        const q = query(usersCollection, orderBy("points", "desc"));
        const querySnapshot = await getDocs(q);
        const usersList: UserDoc[] = [];

        querySnapshot.forEach(docSnap => {
          usersList.push({
            email: docSnap.id, // Document-ID is de email
            ...docSnap.data()
          } as UserDoc);
        });

        setUsers(usersList);
      } catch (error) {
        console.error("Error fetching leaderboard: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) {
    return <div>Loading leaderboard...</div>;
  }

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Disney Magic Quest</title>
      </Head>

      <Header />

      <div>
        <h2>Leaderboard</h2>
        <ul>
          {users.map((user, index) => (
            <li key={user.email}>
              <span>{index + 1}. </span>
              <span>{user.username || user.email} - </span>
              <span>{user.points} points</span>
            </li>
          ))}
        </ul>
      </div>

      <Navbar />
    </>
  );
};

export default Leaderboard;
