import React, { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from 'next/router';
import Header from "./components/header";
import Navbar from "./components/navbar";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

import { firebaseConfig } from "../utils/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";

// Firebase Initialisatie
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);


interface Player {
  username: string;
}

const GameMenu: React.FC = () => {
  const [gameMode, setGameMode] = useState<string>("solo"); // Standaard modus is 'solo'
  const [playerList, setPlayerList] = useState<Player[]>([]); // Spelers uit de database
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]); // Geselecteerde spelers voor multiplayer
  const [showStartButton, setShowStartButton] = useState<boolean>(false); // Verberg de startknop tot multiplayer is geselecteerd
  const [currentUser, setCurrentUser] = useState<string | null>(null); // Huidige gebruiker 
  const router = useRouter(); // Voor router-navigatie


  useEffect(() => {
    // Haal de huidige ingelogde gebruiker op
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Gebruiker is ingelogd, gebruik de gebruikersnaam of email
        setCurrentUser(user.displayName || user.email || "Unknown User");
      } else {
        // Geen gebruiker ingelogd, doorverwijzen naar login-pagina
        router.push("/login");
      }
    });

    // Opruiming van de listener bij component unmount
    return () => unsubscribe();
  }, [router]);




  useEffect(() => {
    // Haal de gebruikers op uit Firebase
    const fetchPlayers = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      const players: Player[] = querySnapshot.docs.map((doc) => ({
        username: doc.data().username,
      }));
      setPlayerList(players);
    };

    fetchPlayers();
  }, []);


  // Functie om het spel te starten in solo-modus
  const handleSoloStart = () => {
    if (currentUser) {
      router.push({
        pathname: "/game/quiz-master-start",
        query: { players: JSON.stringify([currentUser]) },
      });
    }
  };




  // Functie om de geselecteerde gamemode te wijzigen en multiplayer startknop te tonen
  const handleGameModeChange = (mode: string) => {
    setGameMode(mode);
    if (mode === "multiplayer") {
      setShowStartButton(true); // Toon startknop
    } else {
      setShowStartButton(false); // Verberg startknop als terug naar solo
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

  // Functie om het spel te starten in multiplayer-modus
  const handleStartGame = () => {
    if (selectedPlayers.length > 0) {
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
          <Image src="/assets/background.jpg" alt="Solo" className="game-mode-image" width={150} height={150} />
          <button className="disney-button" onClick={handleSoloStart}>
            <i className="bi bi-play-fill"></i> {/* Dit is een controller-icoon van Bootstrap Icons */}
          </button>
          <span className="game-mode-title">Solo</span>
        </div>

        {/* Multiplayer Mode */}
        <div className="game-mode-container">
          <Image src="/assets/background.jpg" alt="Multiplayer" className="game-mode-image" width={150} height={150} />
          <button className="disney-button" onClick={() => setGameMode("multiplayer")}>
            <i className="bi bi-play-fill"></i> {/* Dit is een controller-icoon van Bootstrap Icons */}
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
                className={`player-item ${selectedPlayers.includes(player.username) ? "selected" : ""}`}
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
              <button className="submit-btn" onClick={handleStartGame}>
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
