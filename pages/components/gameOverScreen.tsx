import React from 'react';
import Head from "next/head";

interface GameOverProps {
  score: number;
  username: string;
  onPlayAgain: () => void;
  onReturnHome: () => void;
}

const GameOverScreen: React.FC<GameOverProps> = ({ 
  score, 
  onPlayAgain,
  onReturnHome,
}) => {
  const getScoreMessage = (score: number) => {
    return score > 7 ? "Level UP!" : "Try again";
  };

  const getScoreMessageClass = (score: number) => {
    return score > 7 ? "level-up" : "try-again";
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
          <p>Your Score: {score}/7</p>
        </div>

        <div className="game-over-actions">
          {score < 7 && (
            <button 
              className="btn btn-primary play-again-button" 
              onClick={onPlayAgain}
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
