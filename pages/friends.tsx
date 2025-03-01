import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { auth, db } from "../utils/firebase"; // Firebase auth en db importeren
import { onAuthStateChanged, signOut, updateProfile } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import Image from "next/image";
import Head from "next/head";
import Link from "next/link";

// Gegevens per user
interface User {
  username?: string;
  level?: string;
  accuracy?: string;
  correctanswers?: string;
  gamesplayed?: string;
  avatar?: string;
}




const availableAvatars: any[] = [
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
  const toggleMenu = () => setMenuOpen(!menuOpen);

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

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

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
        <link
          rel="stylesheet"
          href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
        />
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css"
        />
      </Head>

              <header className="header">
                <div className="logo">
                  <Image src="/assets/Magic Quest.png" alt="Logo" width={100} height={100} />
                </div>
                <div className="hamburger-menu" onClick={toggleMenu}>
                  <div className="hamburger-icon"></div>
                  <div className="hamburger-icon"></div>
                  <div className="hamburger-icon"></div>
                </div>
      
                {menuOpen && (
                  <div className="menu">
                    <div className="menu-item" onClick={handleLogout}>Logout</div>
                  </div>
                )}
              </header>

        <nav className="navbar">
          <Link href="/" className="nav-link">
            <i className="bi bi-house-door"></i>
            <span className="d-block small">Home</span>
          </Link>
          <Link href="/leaderboard" className="nav-link">
            <i className="bi bi-bar-chart-line"></i>
            <span className="d-block small">Ranking</span>
          </Link>
          <Link href="/play" className="nav-link">
            <i className="bi bi-rocket"></i>
            <span className="d-block small">Play</span>
          </Link>
          <Link href="/friends" className="nav-link active">
            <i className="bi bi-people-fill"></i>
            <span className="d-block small">Friends</span>
          </Link>
        </nav>
    </>
  );
};

export default HomePage;