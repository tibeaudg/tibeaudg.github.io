import React, { useState, useEffect } from "react";

import { useRouter } from "next/router";
import { auth, db } from "../utils/firebase"; // Firebase auth en db importeren
import { onAuthStateChanged, updateProfile } from "firebase/auth";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";import Image from "next/image";
import Head from "next/head";
import Header from "../pages/components/header"; // Importeer je Header component
import Navbar from "../pages/components/navbar"; // Importeer je Navbar component

// Gegevens per user
interface User {
  avatar: string;
  username?: string;
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
  const [, setLoading] = useState(true);
  const router = useRouter();


  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
  const [usernameMenuOpen, setUsernameMenuOpen] = useState(false);
  const [newUsername, setNewUsername] = useState("");



// Functie om de gekozen avatar op te slaan
const handleAvatarSelect = async (avatar: string) => {
  if (!auth.currentUser || !auth.currentUser.email) return;

  try {
    // Use email as document ID
    const userRef = doc(db, "users", auth.currentUser.email);
    
    // Update the Firestore document
    await updateDoc(userRef, { avatar });
    
    // Update local state
    setUser(prevUser => prevUser ? {...prevUser, avatar} : null);
    setAvatarMenuOpen(false);
    
    console.log("Avatar updated successfully!");
  } catch (error) {
    console.error("Error updating avatar:", error);
  }
};

// Functie om de nieuwe gebruikersnaam op te slaan
const handleUsernameSelect = async () => {
  if (!newUsername || !auth.currentUser || !auth.currentUser.email) return;

  try {
    // Use email as document ID
    const userRef = doc(db, "users", auth.currentUser.email);

    // Update Firebase authentication profile
    await updateProfile(auth.currentUser, {
      displayName: newUsername,
    });

    // Update Firestore with the new username
    await updateDoc(userRef, { username: newUsername });

    // Update local state
    setUser(prevUser => prevUser ? {...prevUser, username: newUsername} : null);
    setUsernameMenuOpen(false);
    
    console.log("Username updated successfully!");
  } catch (error) {
    console.error("Error updating username:", error);
  }
};





// In your useEffect function for authentication state
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      console.log("User email:", firebaseUser.email); // Debug: Log the email
      
      if (!firebaseUser.email) {
        console.error("User has no email address!");
        setLoading(false);
        return;
      }
      
      // IMPORTANT: Use the email as the document ID instead of UID
      const userRef = doc(db, "users", firebaseUser.email);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        console.log("Existing user document found with email ID"); // Debug
        const userData = userDoc.data();
        setUser(userData as User);
        
        // Update any missing fields if necessary
        const updates: Partial<User> = {};
        let needsUpdate = false;
        
        if (!userData.avatar) {
          updates.avatar = "/assets/avatars/31.png";
          needsUpdate = true;
        }
        
        if (!userData.username && firebaseUser.displayName) {
          updates.username = firebaseUser.displayName;
          needsUpdate = true;
        }
        
        if (needsUpdate) {
          console.log("Updating missing fields in existing document"); // Debug
          await updateDoc(userRef, updates);
          setUser(prevUser => prevUser ? {...prevUser, ...updates} : null);
        }
      } else {
        console.log("No user document found with email ID, creating new one"); // Debug
        // Create a new user document if it doesn't exist
        const newUserData: User = {
          avatar: "/assets/avatars/31.png",
          username: firebaseUser.displayName || "User"
        };
        
        // Create document with email as ID
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

        </div>

        <div className="stats-inline">
        </div>


        <Navbar /> {/* Hergebruik Navbar component */}

      </div>
    </>
  );
};


export default HomePage;