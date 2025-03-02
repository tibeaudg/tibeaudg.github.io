import React, { useState } from "react";
import Head from "next/head";
import { useRouter } from 'next/router'; // Gebruik van useRouter
import Header from "./components/header"; // Importeer je Header component
import Navbar from "./components/navbar"; // Importeer je Navbar component







const GameMenu: React.FC = () => {
  const [, setUsernameList] = useState<string[]>([]); // Lijst om de gebruikersnamen op te slaan
  const router = useRouter(); // Hook om de router te gebruiken

  // Hardcoded lijst van gebruikersnamen
  const hardcodedUsernames = ["Lotte", "Megan", "Florian", "Tibeau"];

  // Voeg hardcoded gebruikersnamen toe aan de lijst
  const handleStartGame = () => {
    setUsernameList(hardcodedUsernames); // Voeg de hardcoded gebruikers toe
    // Zet de lijst met gebruikersnamen in de query string en navigeer naar de game pagina
    router.push({
      pathname: "/game/quiz-master-start",
      query: { players: JSON.stringify(hardcodedUsernames) }
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
        <h3 className="title">Quiz Master</h3>

        <div className="game-menu-container">
          <div className="game-menu-card">
            <div className="mt-3">
              <ul>
                {hardcodedUsernames.map((user, index) => (
                  <li key={index} className="user-item">{user}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>


        <div className="game-menu-container">
        <button className="btn" onClick={handleStartGame}>
          Start Game
        </button>
        </div>

      </div>

      
      <Navbar /> {/* Hergebruik Navbar component */}

        

    </>
  );
};

export default GameMenu;
