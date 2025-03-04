import { useState, useEffect } from "react";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { db } from "../../utils/firebase";
import Header from "../components/header";
import Head from "next/head";
import { GetServerSideProps } from "next";
import { getAuth } from "firebase/auth";

interface User {
  email: string;
}

// getServerSideProps is defined outside the component as required by Next.js
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getServerSideProps: GetServerSideProps = async (_context) => {
  const auth = getAuth();
  // Note: Using Firebase Auth on the server side may require additional handling.
  let currentUser: User | null = null;

  if (auth.currentUser) {
    currentUser = { email: auth.currentUser.email || "" };
  }

  return {
    props: {
      currentUser,
    },
  };
};

const SoloProgressPage = ({ currentUser }: { currentUser: User | null }) => {
  // Default to 5 levels; all initially incomplete
  const [levels, setLevels] = useState<boolean[]>([false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch user progress from Firebase when the component mounts
  useEffect(() => {
    if (currentUser && currentUser.email) {
      const fetchUserProgress = async () => {
        try {
          const userRef = doc(db, "users", currentUser.email);
          const userDoc = await getDoc(userRef);

          if (userDoc.exists()) {
            const data = userDoc.data();
            const userProgress = data.levels ?? [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false];
            setLevels(userProgress);
          } else {
            // If the user document doesn't exist, create it with default levels
            const defaultLevels = [false, false, false, false, false ];
            await setDoc(userRef, { levels: defaultLevels });
            setLevels(defaultLevels);
          }
        } catch (error) {
          console.error("Error fetching user progress:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchUserProgress();
    } else {
      // If no current user is found, stop loading
      setLoading(false);
    }
  }, [currentUser]);

  // Update user progress for a specific level in Firebase
  const updateUserProgress = async (levelIndex: number) => {
    if (!currentUser || !currentUser.email) return;
    const updatedLevels = [...levels];
    updatedLevels[levelIndex] = true; // Mark this level as completed

    try {
      const userRef = doc(db, "users", currentUser.email);
      await updateDoc(userRef, { levels: updatedLevels });
      setLevels(updatedLevels);
    } catch (error) {
      console.error("Error updating user progress:", error);
    }
  };

  // Handle level click: check if previous level is completed, update progress if needed, then navigate
  const handleLevelClick = async (levelIndex: number) => {
    // Allow level click if it's the first level or if the previous level is complete
    if (levelIndex === 0 || levels[levelIndex - 1]) {
      if (!levels[levelIndex]) {
        await updateUserProgress(levelIndex);
      }
      router.push({
        pathname: "/game/soloGameplay",
      });
    }
  };

  // Navigate back to the play page
  const handleEndSession = () => {
    router.push("/play");
  };

  // Show a loading state until the progress data is fetched
  if (loading) {
    return <div>Loading...</div>;
  }

  // Determine the current level: the first level that has not been completed
  const currentLevelIndex = levels.findIndex((level) => !level);
  const levelStatuses = levels.map((isCompleted, index) => {
    let status: "completed" | "current" | "incomplete" = "incomplete";
    if (isCompleted) {
      status = "completed";
    } else if (index === currentLevelIndex) {
      status = "current";
    }
    return {
      id: index + 1,
      status,
    };
  });

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Disney Magic Quest</title>
      </Head>

      <Header />



      <div className="progress-page">

        <button className="goback-button" onClick={handleEndSession}>
            <i className="bi bi-arrow-left"></i> Return
        </button>

        <div className="levels">
          {levelStatuses.map((level) => (
            <div
              key={level.id}
              className={`level ${level.status}`}
              onClick={() => handleLevelClick(level.id - 1)} // Adjust for zero-based index
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
