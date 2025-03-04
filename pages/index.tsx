import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { auth, db } from "../utils/firebase"; // Firebase auth en db importeren
import { onAuthStateChanged, updateProfile } from "firebase/auth";
import Image from "next/image";
import Head from "next/head";
import Header from "../pages/components/header"; // Importeer je Header component
import Navbar from "../pages/components/navbar"; // Importeer je Navbar component
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";

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
  const [menuOpen, setMenuOpen] = useState(false);
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
  const [usernameMenuOpen, setUsernameMenuOpen] = useState(false);
  const [descriptionMenuOpen, setDescriptionMenuOpen] = useState(false);
  const [newDescription, setNewDescription] = useState("");
  const [newUsername, setNewUsername] = useState("");
  
  const menuRef = useRef<HTMLDivElement>(null);
  const hamburgerIconRef = useRef<HTMLDivElement>(null);

  // Functie om de gekozen avatar op te slaan
  const handleAvatarSelect = async (avatar: string) => {
    if (!auth.currentUser || !auth.currentUser.email) return;

    try {
      const userRef = doc(db, "users", auth.currentUser.email);
      await updateDoc(userRef, { avatar });
      setUser((prevUser) => (prevUser ? { ...prevUser, avatar } : null));
      setAvatarMenuOpen(false);
      setUsernameMenuOpen(false); // Close others when this opens
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

  // Functie om de nieuwe beschrijving op te slaan
  const handleDescriptionSelect = async () => {
    if (!newDescription || !auth.currentUser || !auth.currentUser.email) return;

    try {
      const userRef = doc(db, "users", auth.currentUser.email);

      // Update de Firestore met de nieuwe beschrijving
      await updateDoc(userRef, { description: newDescription });

      setUser((prevUser) => (prevUser ? { ...prevUser, description: newDescription } : null));
      setDescriptionMenuOpen(false);
      console.log("Description updated successfully!");
    } catch (error) {
      console.error("Error updating description:", error);
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  // Detecteer klik buiten het hamburger menu en sluit het menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node) &&
          hamburgerIconRef.current && !hamburgerIconRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
          const userData = userDoc.data() as User;
          if (!userData.username || userData.username.trim() === "") {
            const updatedUsername = firebaseUser.displayName || "User";
            await updateDoc(userRef, { username: updatedUsername });
            userData.username = updatedUsername;
          }
          setUser(userData);
        } else {
          const newUserData: User = {
            avatar: "/assets/avatars/31.png",
            username: firebaseUser.displayName || "User",
            points: 0,
            gamesPlayed: 0,
            league: "Bronze",
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
          <div ref={hamburgerIconRef} onClick={toggleMenu}>
            <i className="fa fa-bars hamburger-menu" style={{ fontSize: "30px" }}></i>
          </div>

          {menuOpen && (
            <div className="menu" ref={menuRef}>
              <div className="menu-item" onClick={() => setUsernameMenuOpen(true)}>Change Username</div>
              <div className="menu-item" onClick={() => setDescriptionMenuOpen(true)}>Change Description</div>
              <div className="menu-item" onClick={handleLogout} style={{ color: 'red', fontWeight: 'bold' }}>
              Logout</div>

            </div>
          )}

          <div className="profile-image" onClick={() => setAvatarMenuOpen(true)}>
            <Image
              src={user?.avatar || "/assets/default-avatar.jpg"}
              alt="Profile Avatar"
              width={150}
              height={150}
            />
          </div>

          {/* Gebruikersnaam en beschrijving altijd zichtbaar */}
          <div className="username-section">
            <h2>{user?.username ? user.username : "N/A"}</h2>
          </div>
          <p>{user?.description ? user.description : "Geen beschrijving"}</p>

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

          {/* Popup voor gebruikersnaam */}
          {usernameMenuOpen && (
            <div className="popup">
              <div className="popup-content">
                <h2>Change Username</h2>
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="Nieuwe gebruikersnaam"
                />
                <button className="btn" onClick={handleUsernameSelect}>Opslaan</button>
                <button className="btn" onClick={() => setUsernameMenuOpen(false)}>Annuleren</button>
              </div>
            </div>
          )}

          {/* Popup voor beschrijving */}
          {descriptionMenuOpen && (
            <div className="popup">
              <div className="popup-content">
                <h2>Change Description</h2>
                <input
                  type="text"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Nieuwe beschrijving"
                />
                <button className="btn" onClick={handleDescriptionSelect}>Opslaan</button>
                <button className="btn" onClick={() => setDescriptionMenuOpen(false)}>Annuleren</button>
              </div>
            </div>
          )}
        </div>
        <Navbar />
      </div>
    </>
  );
};

export default HomePage;
