import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { auth, db } from "../utils/firebase"; // Firebase auth en db importeren
import { onAuthStateChanged, updateProfile } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import Image from "next/image";
import Head from "next/head";
import Header from "../pages/components/header"; // Importeer je Header component
import Navbar from "../pages/components/navbar"; // Importeer je Navbar component

// Gegevens per user
interface User {
  username?: string;
  level?: string;
  accuracy?: string;
  correctanswers?: string;
  gamesplayed?: string;
  avatar?: string;
}




const availableAvatars: string[] = [
  "/assets/avatars/31.png",
  "/assets/avatars/38.png",
  "/assets/avatars/39.png",
  "/assets/avatars/40.png",
  "/assets/avatars/75.png",
  "/assets/avatars/100.png",
  "/assets/avatars/101.png",
  "/assets/avatars/102.png",
  "/assets/avatars/105.png",
  "/assets/avatars/109.png",
  "/assets/avatars/111.png",
  "/assets/avatars/112.png",
  "/assets/avatars/113.png",
  "/assets/avatars/119.png",
  "/assets/avatars/122.png",
  "/assets/avatars/126.png",
  "/assets/avatars/131.png",
  "/assets/avatars/132.png",
  "/assets/avatars/133.png",
  "/assets/avatars/foTPoaY.png",
  "/assets/avatars/SRrVn2v.png",
];

const HomePage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();


  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
  const [usernameMenuOpen, setUsernameMenuOpen] = useState(false);
  const [newUsername, setNewUsername] = useState("");

  // Functie om de gekozen avatar op te slaan
  const handleAvatarSelect = async (avatar: string) => {
    if (!user) return;

    try {
      // Update de Firestore gebruiker met het nieuwe avatar
      const userRef = doc(db, "users", auth.currentUser?.uid || "");
      await updateDoc(userRef, { avatar });

      // Update ook de lokale state
      setUser((prevUser) => prevUser && { ...prevUser, avatar });
      setAvatarMenuOpen(false);
    } catch (error) {
      console.error("Error updating avatar:", error);
    }
  };

  // Functie om de nieuwe gebruikersnaam op te slaan
  const handleUsernameSelect = async () => {
    if (!newUsername || !auth.currentUser) return;

    try {
      // Update Firebase authentication profile
      await updateProfile(auth.currentUser, {
        displayName: newUsername,
      });

      // Update Firestore met de nieuwe gebruikersnaam
      const userRef = doc(db, "users", auth.currentUser?.uid || "");
      await updateDoc(userRef, { username: newUsername });

      // Update de lokale state
      setUser((prevUser) => prevUser && { ...prevUser, username: newUsername });
      setUsernameMenuOpen(false);
    } catch (error) {
      console.error("Error updating username:", error);
    }
  };

  // Gebruik de Firestore gegevens om de user informatie te krijgen
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Haal aanvullende gebruikersgegevens uit Firestore
        const userRef = doc(db, "users", firebaseUser.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          setUser(userDoc.data() as User);
        }
      } else {
        router.push("/login");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);



  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Disney Magic Quest</title>
      </Head>

      <div>
      <Header /> {/* Hergebruik Header component */}


        <div className="profile-section text-center">
          <div className="profile-image" onClick={() => setAvatarMenuOpen(true)}>
            <Image
              src={user?.avatar || "/assets/default-avatar.png"}
              alt="Profile Avatar"
              width={150}
              height={150}
            />
          </div>
          {avatarMenuOpen && (
            <div className="avatar-menu">
              <h3>Kies een profielfoto</h3>
              <div className="avatar-options">
                {availableAvatars.map((avatar) => (
                  <div
                    key={avatar}
                    className="avatar-option"
                    onClick={() => handleAvatarSelect(avatar)}
                    style={{ display: "inline-block", margin: "5px", cursor: "pointer" }}
                  >
                    <Image src={avatar} alt="Avatar option" width={100} height={100} />
                  </div>
                ))}
              </div>
              <button className="btn" onClick={() => setAvatarMenuOpen(false)}>Sluiten</button>
            </div>
          )}

          {/* Username Editing */}
          <div className="username-section">
            <h2
              className="username"
              onClick={() => setUsernameMenuOpen(true)}
              style={{ cursor: "pointer" }}
            >
              {user?.username ?? "N/A"}
            </h2>

            {usernameMenuOpen && (
              <div className="username">
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="Nieuwe gebruikersnaam"
                />
                <button className="btn" onClick={handleUsernameSelect}>Opslaan</button>
                <button className="btn" onClick={() => setUsernameMenuOpen(false)}>Annuleren</button>
              </div>
            )}
          </div>

          <p className="text-muted">Level: {user?.level ?? "N/A"}</p>
        </div>

        <div className="stats-inline">
          <h4>Games Played</h4>
          <p>{user?.gamesplayed ?? "N/A"}</p>
        </div>


        <Navbar /> {/* Hergebruik Navbar component */}

      </div>
    </>
  );
};

export default HomePage;