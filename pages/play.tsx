import React, { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import Header from "./components/header";
import Navbar from "./components/navbar";
import { initializeApp } from "firebase/app";
import { setDoc } from "firebase/firestore";

import {
  getFirestore,
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { useAuth } from "../contexts/authContext"; // Zorg ervoor dat dit pad correct is

import { firebaseConfig } from "../utils/firebase";

// Firebase initialisatie
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

interface Player {
  username: string;
}

const GameMenu: React.FC = () => {
  const [gameMode, setGameMode] = useState<string>("solo"); // Standaard modus is 'solo'
  const [playerList, setPlayerList] = useState<Player[]>([]); // Spelers uit de database
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]); // Geselecteerde spelers voor multiplayer

  const router = useRouter(); // Voor router-navigatie

  // Gebruik de useAuth hook bovenaan de component
  const { currentUser } = useAuth();

  // Gebruik eventueel een useEffect om de spelerlijst op te halen
  useEffect(() => {
    const fetchPlayers = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      const players: Player[] = querySnapshot.docs.map((doc) => ({
        username: doc.data().username,
      }));
      setPlayerList(players);
    };

    fetchPlayers();
  }, []);



  const handleSoloStart = async () => {
    if (currentUser && currentUser.email) {
      try {
        const userRef = doc(db, "users", currentUser.email);
        const userDoc = await getDoc(userRef);
        
        // Get the username to use (for either case)
        const username = currentUser.displayName || "DefaultUsername";
  
        if (!userDoc.exists()) {
          // Document doesn't exist yet; create it with gamesPlayed set to 1
          await setDoc(userRef, { 
            gamesPlayed: 1,
            username: username  // Using the username value
          }, { merge: true });
          console.log("Gebruikersdocument aangemaakt met gamesPlayed: 1");
        } else {
          // Document exists; update gamesPlayed
          const currentGamesPlayed = userDoc.data().gamesPlayed || 0;
          await updateDoc(userRef, {
            gamesPlayed: currentGamesPlayed + 1,
          });
          console.log("Aantal spellen succesvol bijgewerkt (solo).");
        }
      } catch (error) {
        console.error("Fout bij het bijwerken van spellen:", error);
      }
  
      router.push({
        pathname: "/game/progress",
        query: { players: JSON.stringify([currentUser.email]) },
      });
    }
  };
  


  // Update de lijst van geselecteerde spelers
  const handlePlayerSelection = (username: string) => {
    setSelectedPlayers((prevSelected) =>
      prevSelected.includes(username)
        ? prevSelected.filter((player) => player !== username) // Deselecteer als al geselecteerd
        : [...prevSelected, username] // Voeg toe als nog niet geselecteerd
    );
  };

  const handleStartGame = async () => {
    if (selectedPlayers.length > 0 && currentUser && currentUser.email) {
      try {
        const userRef = doc(db, "users", currentUser.email);
        const userDoc = await getDoc(userRef);
        const currentGamesPlayed = userDoc.exists() ? userDoc.data().gamesPlayed || 0 : 0;
        await updateDoc(userRef, {
          gamesPlayed: currentGamesPlayed + 1,
        });
        console.log("Aantal spellen succesvol bijgewerkt (multiplayer).");
      } catch (error) {
        console.error("Fout bij het bijwerken van spellen:", error);
      }
  
      router.push({
        pathname: "/game/quiz-master-start",
        query: { players: JSON.stringify(selectedPlayers) },
      });
    }
  };
  

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Disney Magic Quest</title>
      </Head>

      <Header /> {/* Hergebruik Header component */}

      {/* Game Mode Sectie */}
      <div className="game-mode-wrapper">
        {/* Solo Mode */}
        <div className="game-mode-container">
          <Image
            src="/assets/solo2.png"
            alt="Solo"
            className="game-mode-image"
            width={150}
            height={150}
          />
          <button className="disney-button" onClick={handleSoloStart}>
            <i className="bi bi-play-fill"></i>
          </button>
          <span className="game-mode-title">Solo</span>
        </div>

        {/* Multiplayer Mode */}
        <div className="game-mode-container">
          <Image
            src="/assets/multiplayer.jpg"
            alt="Multiplayer"
            className="game-mode-image"
            width={150}
            height={150}
          />
          <button
            className="disney-button"
            onClick={() => setGameMode("multiplayer")}
          >
            <i className="bi bi-play-fill"></i>
          </button>
          <span className="game-mode-title">Multiplayer</span>
        </div>
      </div>

      {/* Multiplayer Selectie Menu */}
      {gameMode === "multiplayer" && (
        <div className="player-select">
          <div className="player-list">
            {playerList.map((player, index) => (
              <div
                key={index}
                className={`player-item ${
                  selectedPlayers.includes(player.username) ? "selected" : ""
                }`}
                onClick={() => handlePlayerSelection(player.username)}
              >
                <input
                  type="checkbox"
                  checked={selectedPlayers.includes(player.username)}
                  onChange={() => handlePlayerSelection(player.username)}
                />
                <span>{player.username}</span>
              </div>
            ))}
          </div>
          {/* Start Game Button */}
          <div className="container">
            <button className="startGame-btn" onClick={handleStartGame}>
              Start Game
            </button>
          </div>
        </div>
      )}

      <Navbar /> {/* Hergebruik Navbar component */}
    </>
  );
};

export default GameMenu;
