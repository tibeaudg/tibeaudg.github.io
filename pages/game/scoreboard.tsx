import React, { useEffect, useState } from "react";
import Header from "../components/header";
import Head from "next/head";
import { useRouter } from "next/router";
import Navbar from "../components/navbar";

const Scoreboard: React.FC = () => {
  const router = useRouter();
  const [players, setPlayers] = useState<string[]>([]);
  const [scores, setScores] = useState<Record<string, number>>({});

  useEffect(() => {
    // Haal de spelers en scores op uit de query parameters
    if (router.query.players && router.query.scores) {
      const playersData = JSON.parse(router.query.players as string);
      const scoresData = JSON.parse(router.query.scores as string);

      setPlayers(playersData);
      setScores(scoresData);
    }
  }, [router.query]);

  const getRankEmoji = (index: number) => {
    switch (index) {
      case 0:
        return "🏆";
      case 1:
        return "🥈";
      case 2:
        return "🥉";
      case 3:
        return "💩";
      default:
        return "";
    }
  };

  const renderScoreboard = () => {
    const sortedPlayers = [...players].sort((a, b) => scores[b] - scores[a]);

    return (
      <>
        <Head>
          <meta charSet="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Disney Magic Quest</title>
        </Head>

        <Header />

        <button className="goback-button" onClick={() => router.push("/play")}>
          <i className="bi bi-arrow-left"></i> Return
        </button>

        <div className="scoreboard">
          {sortedPlayers.map((player, index) => (
            <div
              key={player}
              className={`player-score ${
                index === 0
                  ? "first-place"
                  : index === 1
                  ? "second-place"
                  : index === 2
                  ? "third-place"
                  : index === 3
                  ? "fourth-place"
                  : ""
              }`}
            >
              <span className="player-name">
                {getRankEmoji(index)} {player}
              </span>
              <span className="player-points">{scores[player]}</span>
            </div>
          ))}

          <Navbar />
        </div>
      </>
    );
  };

  return <div className="game-menu">{renderScoreboard()}</div>;
};

export default Scoreboard;
