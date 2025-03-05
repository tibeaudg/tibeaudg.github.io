import { useState, useEffect } from "react";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { db } from "../../utils/firebase";
import Header from "../components/header";
import Head from "next/head";
import { getAuth, onAuthStateChanged } from "firebase/auth";

// Maak een constante voor de standaard levels
const defaultLevels = Array(20).fill(false);

interface User {
  email: string;
}

const SoloProgressPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [levels, setLevels] = useState<boolean[]>(defaultLevels);
  const [loading, setLoading] = useState(true);
  const [activeLevel, setActiveLevel] = useState<number>(1);
  const router = useRouter();

  // Luister naar veranderingen in de authenticatiestatus op de client
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser && currentUser.email) {
        setUser({ email: currentUser.email });
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // Zodra we de gebruiker hebben, haal de progress uit Firebase op
  useEffect(() => {
    if (user && user.email) {
      const fetchUserProgress = async () => {
        try {
          const userRef = doc(db, "users", user.email);
          const userDoc = await getDoc(userRef);

          if (userDoc.exists()) {
            const data = userDoc.data();
            const userProgress = data.levels ?? defaultLevels;
            const userLevel = data.level ?? 1;
            setLevels(userProgress);
            setActiveLevel(userLevel);
          } else {
            // Als er nog geen document bestaat, initialiseer het dan met de default waardes
            await setDoc(userRef, { levels: defaultLevels, level: 1 });
            setLevels(defaultLevels);
            setActiveLevel(1);
          }
        } catch (error) {
          console.error("Error fetching user progress:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchUserProgress();
    } else {
      setLoading(false);
    }
  }, [user]);

  // Update de progress van de gebruiker in Firebase
  const updateUserProgress = async (levelIndex: number) => {
    if (!user || !user.email) return;

    const updatedLevels = [...levels];
    updatedLevels[levelIndex] = true; // Markeer dit level als voltooid

    try {
      const userRef = doc(db, "users", user.email);
      await updateDoc(userRef, {
        levels: updatedLevels,
        level: levelIndex + 1, // Zet het actieve level op het volgende level
      });
      setLevels(updatedLevels);
      setActiveLevel(levelIndex + 1);
    } catch (error) {
      console.error("Error updating user progress:", error);
    }
  };

  const handleLevelClick = async (levelIndex: number) => {
    // Sta klikken toe voor alle levels die <= currentLevelIndex zijn
    if (levelIndex <= currentLevelIndex) {
      // Als het level nog niet als voltooid staat in de levels-array, update progress.
      if (!levels[levelIndex]) {
        await updateUserProgress(levelIndex);
      }
      router.push("/game/soloGameplay");
    }
  };
  

  // Navigeren terug naar de play-pagina
  const handleEndSession = () => {
    router.push("/play");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  // Bepaal het huidige level: als activeLevel bestaat, gebruik dit (minus 1 voor zero-based index)
  const currentLevelIndex = activeLevel - 1;
  const levelStatuses = levels.map((isCompleted, index) => {
    // Als het level vóór het huidige level ligt, markeer het automatisch als "completed"
    if (index < currentLevelIndex) {
      return { id: index + 1, status: "completed" };
    }
    // Het huidige level markeren als "current"
    if (index === currentLevelIndex) {
      return { id: index + 1, status: "current" };
    }
    // Voor de overige levels, gebruik de originele status
    return { id: index + 1, status: isCompleted ? "completed" : "incomplete" };
  });

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Disney Magic Quest</title>
      </Head>

      <Header />

      <button className="goback-button" onClick={handleEndSession}>
        <i className="bi bi-arrow-left-circle"></i> Back
      </button>

      <div className="progress-page">
        <div className="levels">
          {levelStatuses.map((level) => (
            <div
              key={level.id}
              className={`level ${level.status}`}
              onClick={() => handleLevelClick(level.id - 1)}
            >
              Level {level.id}
              {level.status === "completed" && <span className="check">✔</span>}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default SoloProgressPage;
