import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { auth, db } from "../utils/firebase"; // Firebase auth en db importeren
import { onAuthStateChanged, updateProfile } from "firebase/auth";
import Image from "next/image";
import Head from "next/head";
import Header from "../pages/components/header"; // Importeer je Header component
import Navbar from "../pages/components/navbar"; // Importeer je Navbar component
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";





// Gegevens per user
interface User {
  avatar: string;
  username?: string;
  points?: number;
  gamesPlayed?: number;
  league?: string;
  description?: string;
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
  const [descriptionMenuOpen, setDescriptionMenuOpen] = useState(false);
  const [newDescription, setNewDescription] = useState("");
  const [newUsername, setNewUsername] = useState("");

  // Functie om de gekozen avatar op te slaan
  const handleAvatarSelect = async (avatar: string) => {
    if (!auth.currentUser || !auth.currentUser.email) return;
  
    try {
      const userRef = doc(db, "users", auth.currentUser.email);
      await updateDoc(userRef, { avatar });
      setUser((prevUser) => (prevUser ? { ...prevUser, avatar } : null));
      setAvatarMenuOpen(false);
      setUsernameMenuOpen(false);  // Close others when this opens
      setDescriptionMenuOpen(false);
      console.log("Avatar updated successfully!");
    } catch (error) {
      console.error("Error updating avatar:", error);
    }
  };
  

  // Functie om de nieuwe gebruikersnaam op te slaan
  const handleUsernameSelect = async () => {
    if (!newUsername || !auth.currentUser || !auth.currentUser.email) return;

    try {
      const userRef = doc(db, "users", auth.currentUser.email);

      // Update Firebase Authentication profiel (let op: firebaseUser.displayName kan bij herlogin anders zijn)
      await updateProfile(auth.currentUser, { displayName: newUsername });

      // Update de Firestore met de nieuwe gebruikersnaam
      await updateDoc(userRef, { username: newUsername });

      setUser(prevUser => prevUser ? { ...prevUser, username: newUsername } : null);
      setUsernameMenuOpen(false);
      console.log("Username updated successfully!");
    } catch (error) {
      console.error("Error updating username:", error);
    }
  };

// Updated function to remove updateProfile for description
const handleDescriptionSelect = async () => {
  if (!newDescription || !auth.currentUser || !auth.currentUser.email) return;

  try {
    const userRef = doc(db, "users", auth.currentUser.email);

    // Update the Firestore with the new description
    await updateDoc(userRef, { description: newDescription });

    setUser((prevUser) => (prevUser ? { ...prevUser, description: newDescription } : null));
    setDescriptionMenuOpen(false);
    console.log("Description updated successfully!");
  } catch (error) {
    console.error("Error updating description:", error);
  }
};


    




  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        if (!firebaseUser.email) {
          console.error("User has no email address!");
          setLoading(false);
          return;
        }
        
        const userRef = doc(db, "users", firebaseUser.email);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          // Gebruik de opgeslagen gegevens uit Firestore
          const userData = userDoc.data() as User;
          // Indien de gebruikersnaam leeg is, update deze met firebaseUser.displayName of "User"
          if (!userData.username || userData.username.trim() === "") {
            const updatedUsername = firebaseUser.displayName || "User";
            await updateDoc(userRef, { username: updatedUsername });
            userData.username = updatedUsername;
          }
          setUser(userData);
          
        } else {
          // Document bestaat niet, dus maak er een aan met standaardwaarden
          const newUserData: User = {
            avatar: "/assets/avatars/31.png",
            username: firebaseUser.displayName || "User",
            points: 0,   // Initialize points to 0
            gamesPlayed: 0,    // Initialize games to 0
            league: "Bronze",  // Default league
          };
          await setDoc(userRef, newUserData);
          
          setUser(newUserData);
        }

      } else {
        setUser(null);
        router.push("/login");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Disney Magic Quest</title>
      </Head>
      <div>
        <Header />

        <div className="profile-section text-center">
          <div className="profile-image" onClick={() => setAvatarMenuOpen(true)}>
            <Image
              src={user?.avatar || "/assets/default-avatar.jpg"}
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




              <button className="btn" onClick={() => setAvatarMenuOpen(false)}>
                Sluiten
              </button>
            </div>
          )}



          {/* Gebruikersnaam tonen en bewerken */}
          <div className="username-section">
            <h2
              className="username"
              onClick={() => setUsernameMenuOpen(true)}
              style={{ cursor: "pointer" }}
            >
              {user?.username ? user.username : "N/A"}
            </h2>
            {usernameMenuOpen && (
              <div className="username-edit">
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="Nieuwe gebruikersnaam"
                />
                <button className="btn" onClick={handleUsernameSelect}>
                  Opslaan
                </button>
                <button className="btn" onClick={() => setUsernameMenuOpen(false)}>
                  Annuleren
                </button>
              </div>
            )}
          </div>
        </div>



          {/* Beschrijving toevoegen */}
            <p className="user-description" onClick={() => setDescriptionMenuOpen(true)} style={{ cursor: "pointer" }}>
              {user?.description ? user.description : "Geen beschrijving"}
            </p>
            {descriptionMenuOpen && (
              <div className="username-edit">
                <input
                  type="text"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Nieuwe beschrijving"
                />
                <button className="btn" onClick={handleDescriptionSelect}>
                  Opslaan
                </button>
                <button className="btn" onClick={() => setDescriptionMenuOpen(false)}>
                  Annuleren
                </button>
              </div>
            )}
          </div>

          {/* Instagram-achtige layout voor games, points, league */}
          <div className="stats-inline">
            <div className="stats">
              <p><span className="number">{user?.gamesPlayed ?? 0}</span><br />Games</p>
            </div>
            <div className="stats">
              <p><span className="number">{user?.points ?? 0}</span><br />Points</p>
            </div>
            <div className="stats">
              <p><span className="number">{user?.league ?? "N/A"}</span><br />League</p>
            </div>
          </div>


        <Navbar />
    </>
  );
};

export default HomePage;
