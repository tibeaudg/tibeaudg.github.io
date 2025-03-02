import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from 'next/router';
import Header from "./components/header"; // Importeer je Header component
import Navbar from "./components/navbar"; // Importeer je Navbar component
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { firebaseConfig } from "../utils/firebase"; // Voeg je Firebase-configuratie toe

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

interface Player {
  username: string;
}

const GameMenu: React.FC = () => {
  const [gameMode, setGameMode] = useState<string>("solo"); // Standaard solo gamemode
  const [playerList, setPlayerList] = useState<Player[]>([]); // Lijst met alle spelers uit de database
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]); // Geselecteerde spelers voor multiplayer
  const router = useRouter(); // Hook om de router te gebruiken

  useEffect(() => {
    // Haal alle spelers op uit de Firebase-database
    const fetchPlayers = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      const players: Player[] = querySnapshot.docs.map((doc) => ({
        username: doc.data().username,
      }));
      setPlayerList(players);
    };

    fetchPlayers();
  }, []);

  // Functie om de geselecteerde gamemode te wijzigen
  const handleGameModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setGameMode(e.target.value);
  };

  // Functie om de geselecteerde spelers bij te werken
  const handlePlayerSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
    setSelectedPlayers(selectedOptions);
  };

  // Functie om het spel te starten
  const handleStartGame = () => {
    const playersToSend = gameMode === "solo" ? ["solo"] : selectedPlayers;
    // Zet de lijst met gebruikersnamen in de query string en navigeer naar de game pagina
    router.push({
      pathname: "/game/quiz-master-start",
      query: { players: JSON.stringify(playersToSend) },
    });
  };

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Disney Magic Quest</title>
      </Head>

      <Header /> {/* Hergebruik Header component */}

      <div>

        {/* Dropdown-menu om de gamemode te selecteren */}
        <div className="game-mode-select">
          <label htmlFor="gameMode">Choose Game Mode:</label>
          <select id="gameMode" value={gameMode} onChange={handleGameModeChange}>
            <option value="solo">Solo</option>
            <option value="multiplayer">Multiplayer</option>
          </select>
        </div>

        {/* Dynamische lijst van gebruikers voor multiplayer, alleen zichtbaar als multiplayer is geselecteerd */}
        {gameMode === "multiplayer" && (
          <div className="player-select">
            <label htmlFor="players">Select Players:</label>
            <select id="players" multiple value={selectedPlayers} onChange={handlePlayerSelection}>
              {playerList.map((player, index) => (
                <option key={index} value={player.username}>
                  {player.username}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Start game knop */}
        <div className="container">
          <button className="submit-btn" onClick={handleStartGame}>
            Start Game
          </button>
        </div>
      </div>

      <Navbar /> {/* Hergebruik Navbar component */}
    </>
  );
};

export default GameMenu;
