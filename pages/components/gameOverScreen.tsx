import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

interface GameOverProps {
  score: number;
  onPlayAgain: () => void;
  onReturnHome: () => void;
}

const GameOverScreen: React.FC<GameOverProps> = ({ 
  score, 
  onPlayAgain, 
  onReturnHome 
}) => {
  const router = useRouter();  // Gebruik de Next.js router hook

  const getScoreMessage = (score: number) => {
    return score > 7 ? 'Level UP!' : 'Try again';
  };

  const getScoreMessageClass = (score: number) => {
    return score > 7 ? 'level-up' : 'try-again';
  };

  const handlePlayAgain = () => {
    onPlayAgain();
    router.push('/soloGameplay');  // Stuur de gebruiker naar soloGameplay
  };

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Disney Magic Quest - Solo Mode</title>
      </Head>

      <div className="game-over-container">
        <div className={`score-message ${getScoreMessageClass(score)}`}>
          <p>{getScoreMessage(score)}</p>
        </div>

        <div className="score-summary">
          <p>your score: {score}/7</p>
        </div>

        <div className="game-over-actions">
          {score < 7 && (
            <button
              className="btn btn-primary play-again-button"
              onClick={handlePlayAgain}  // Gebruik de aangepaste onClick-handler
            >
              Play Again
            </button>
          )}
          <button
            className="btn btn-primary return-home-button"
            onClick={onReturnHome}
          >
            Return
          </button>
        </div>
      </div>
    </>
  );
};

export default GameOverScreen;
