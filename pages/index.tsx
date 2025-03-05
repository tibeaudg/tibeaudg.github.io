import React, { useState, useEffect, useRef } from "react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import Header from "../pages/components/header";
import Navbar from "../pages/components/navbar";
import { auth, db } from "../utils/firebase";
import { onAuthStateChanged, updateProfile, signOut } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";



const activities = [
  { id: 1, title: "Valley of the Kings", desc: "Killing the mountain" },
  { id: 2, title: "Beaches of Caribbean", desc: "Sun and fun" },
  { id: 3, title: "Climbing Everest", desc: "The top of the world" },
];

// Gegevens per user
interface User {
  avatar: string;
  username?: string;
  points?: number;
  gamesPlayed?: number;
  level?: number;
  description?: string;
  streak?: number;
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

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
  const [usernameMenuOpen, setUsernameMenuOpen] = useState(false);
  const [descriptionMenuOpen, setDescriptionMenuOpen] = useState(false);
  const [newDescription, setNewDescription] = useState("");
  const [newUsername, setNewUsername] = useState("");

  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);
  const hamburgerIconRef = useRef<HTMLDivElement>(null);

  // Detecteer klik buiten het hamburger menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        hamburgerIconRef.current &&
        !hamburgerIconRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Firebase auth state en user data ophalen
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
            level: 0,
            streak: 0,
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

  // Handlers voor update functies
  const handleAvatarSelect = async (avatar: string) => {
    if (!auth.currentUser || !auth.currentUser.email) return;
    try {
      const userRef = doc(db, "users", auth.currentUser.email);
      await updateDoc(userRef, { avatar });
      setUser((prevUser) => (prevUser ? { ...prevUser, avatar } : null));
      setAvatarMenuOpen(false);
      console.log("Avatar updated successfully!");
    } catch (error) {
      console.error("Error updating avatar:", error);
    }
  };

  const handleUsernameSelect = async () => {
    if (!newUsername || !auth.currentUser || !auth.currentUser.email) return;
    try {
      const userRef = doc(db, "users", auth.currentUser.email);
      await updateProfile(auth.currentUser, { displayName: newUsername });
      await updateDoc(userRef, { username: newUsername });
      setUser((prevUser) => (prevUser ? { ...prevUser, username: newUsername } : null));
      setUsernameMenuOpen(false);
      console.log("Username updated successfully!");
    } catch (error) {
      console.error("Error updating username:", error);
    }
  };

  const handleDescriptionSelect = async () => {
    if (!newDescription || !auth.currentUser || !auth.currentUser.email) return;
    try {
      const userRef = doc(db, "users", auth.currentUser.email);
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

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Disney Magic Quest</title>
      </Head>
      <div>
        <Header />
        {/* Hoofd layout met twee kaarten */}
        <div className="profileContainer">
          {/* Linker kaart met achtergrond, profielinfo en activiteiten */}
          <div className="leftCard">
            <div className="bgImageWrapper">
              <Image
                src="/assets/background.jpg"
                alt="Background"
                fill
                style={{ objectFit: "cover" }}
              />
              <div className="bgOverlay"></div>
            </div>
            <div className="profileInfo">
              {/* Hamburger menu rechtsboven */}
              <div className="hamburgerWrapper" ref={hamburgerIconRef} onClick={toggleMenu}>
                <i className="fa fa-bars hamburger-menu" style={{ fontSize: "20px" }}></i>
              </div>
              {menuOpen && (
                <div className="menu" ref={menuRef}>
                  <div className="menu-item" onClick={() => setUsernameMenuOpen(true)}>
                    Change Username
                  </div>
                  <div className="menu-item" onClick={() => setDescriptionMenuOpen(true)}>
                    Change Description
                  </div>
                  <div
                    className="menu-item"
                    onClick={handleLogout}
                    style={{ color: "red", fontWeight: "bold" }}
                  >
                    Logout
                  </div>
                </div>
              )}

              {/* Avatar, gebruikersnaam en extra info */}
              <div
                className="avatarWrapper"
                onClick={() => setAvatarMenuOpen(true)}
                style={{ cursor: "pointer" }}
              >
                <Image
                  src={user?.avatar || "/assets/default-avatar.jpg"}
                  alt="User Avatar"
                  width={80}
                  height={80}
                  className="avatar"
                />
              </div>
              <h2 className="userName">{user?.username || "N/A"}</h2>
              <p className="description">{user?.description || "Geen beschrijving"}</p>
              {/* Statistieken (gebruik Firebase-data) */}
              <div className="statsRow">
                <div className="statBox1">
                  <h3>{user?.streak || 0}</h3>
                  <p>Streak</p>
                </div>

                <div className="statBox2">
                  <h3>{user?.points || 0}</h3>
                  <p>Points</p>
                </div>

                <div className="statBox3">
                  <h3>{user?.level || 0}</h3>
                  <p>Level</p>
                </div>
              </div>

              {/* Activiteiten-lijst */}
              <div className="activitiesSection">
                <h4>My Activities</h4>
                <ul>
                  {activities.map((act) => (
                    <li key={act.id}>
                      <h5>{act.title}</h5>
                      <p>{act.desc}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <Navbar />

        {/* Avatar-selectie popup */}
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

        {/* Popup voor gebruikersnaam wijzigen */}
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
              <button className="btn" onClick={handleUsernameSelect}>
                Opslaan
              </button>
              <button className="btn" onClick={() => setUsernameMenuOpen(false)}>
                Annuleren
              </button>
            </div>
          </div>
        )}

        {/* Popup voor beschrijving wijzigen */}
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
              <button className="btn" onClick={handleDescriptionSelect}>
                Opslaan
              </button>
              <button className="btn" onClick={() => setDescriptionMenuOpen(false)}>
                Annuleren
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProfilePage;
