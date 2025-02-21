import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import { questions } from "./questions.tsx";
import Head from "next/head";
import Link from "next/link";
import "../../styles/index.css";
import "../../styles/play.css";
import "../../styles/quizmaster.css";

const GameMenu: React.FC = () => {
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answerStatus, setAnswerStatus] = useState('');
  const [isRoundOver, setIsRoundOver] = useState(false);
  const [isAnswerDisabled, setIsAnswerDisabled] = useState(false);
  const [players, setPlayers] = useState<string[]>([]);
  const [showMagicEffect, setShowMagicEffect] = useState(false);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [showScores, setShowScores] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (router.query.players) {
      const playerList = JSON.parse(router.query.players as string);
      setPlayers(playerList);
      // Initialize scores
      const initialScores: Record<string, number> = {};
      playerList.forEach((player: string) => {
        initialScores[player] = 0;
      });
      setScores(initialScores);
    }
  }, [router.query.players]);

  const handleAnswer = (answer: string) => {
    setIsAnswerDisabled(true);
    const correct = questions[currentQuestionIndex].correctAnswer;
    const isCorrect = answer === correct;
    setAnswerStatus(isCorrect ? 'Correct!' : 'Wrong!');
    setShowMagicEffect(true);

    // Update scores
    if (isCorrect) {
      setScores(prevScores => ({
        ...prevScores,
        [players[currentPlayerIndex]]: prevScores[players[currentPlayerIndex]] + 1
      }));
    }

    setTimeout(() => {
      setAnswerStatus('');
      setIsAnswerDisabled(false);
      setShowMagicEffect(false);
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setCurrentPlayerIndex((currentPlayerIndex + 1) % players.length);
      } else {
        setIsRoundOver(true);
        setShowScores(true);
      }
    }, 2000);
  };

  const startNewRound = () => {
    setCurrentQuestionIndex(0);
    setCurrentPlayerIndex(0);
    setIsRoundOver(false);
    setShowScores(false);
    setAnswerStatus('');
    setIsAnswerDisabled(false);
    setShowMagicEffect(false);
  };

  // Sort players by score for the leaderboard
  const sortedPlayers = [...players].sort((a, b) => scores[b] - scores[a]);

  return (
    <>
      <Head>
        {/* Previous head content remains the same */}
        <style>{`
          /* Previous styles remain the same */

          .scoreboard {
            background: rgba(255, 255, 255, 0.95);
            border-radius: 20px;
            padding: 2rem;
            max-width: 600px;
            margin: 2rem auto;
            box-shadow: 0 0 30px rgba(111, 53, 165, 0.3);
            animation: scoreboardAppear 0.8s ease-out;
          }

          .scoreboard-title {
            color: var(--disney-purple);
            text-align: center;
            font-size: 2.5rem;
            margin-bottom: 2rem;
            text-shadow: 2px 2px 4px rgba(111, 53, 165, 0.2);
          }

          .player-score {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem;
            margin: 0.5rem 0;
            background: linear-gradient(to right, rgba(111, 53, 165, 0.1), transparent);
            border-radius: 10px;
            transition: transform 0.3s ease;
          }

          .player-score:hover {
            transform: translateX(10px);
          }

          .player-name {
            font-size: 1.3rem;
            color: var(--disney-purple);
            font-weight: bold;
          }

          .player-points {
            font-size: 1.5rem;
            color: var(--disney-gold);
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
          }

          .new-round-button {
            display: block;
            margin: 2rem auto;
            padding: 1rem 2rem;
            font-size: 1.2rem;
            background: linear-gradient(45deg, var(--disney-purple), var(--disney-blue));
            color: white;
            border: none;
            border-radius: 25px;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(111, 53, 165, 0.3);
          }

          .new-round-button:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 20px rgba(111, 53, 165, 0.4);
          }

          @keyframes scoreboardAppear {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .trophy {
            font-size: 2rem;
            margin-right: 1rem;
          }

          .first-place {
            background: linear-gradient(to right, rgba(255, 215, 0, 0.2), transparent);
          }

          .second-place {
            background: linear-gradient(to right, rgba(192, 192, 192, 0.2), transparent);
          }

          .third-place {
            background: linear-gradient(to right, rgba(205, 127, 50, 0.2), transparent);
          }
        `}</style>
      </Head>

      <div>
        <header className="headerqz">
          <Link href="quiz-master" passHref>
            <div className="logout">
              <i className="bi bi-arrow-left-circle-fill"></i>
            </div>
          </Link>
          <div className="quiz-master-title-container">
            <h3 className="quiz-master-title">Disney Magic Quest</h3>
          </div>
        </header>

        <div className="quiz-container">
          {!isRoundOver ? (
            <>
              <h2 className="player-turn">{players[currentPlayerIndex]}&apos;s Turn</h2>
              <div className="question-container">
                <h3 className="question">{questions[currentQuestionIndex].question}</h3>
                <div className="options-container">
                  {questions[currentQuestionIndex].options.map((option, index) => (
                    <button
                      key={index}
                      className="option-button"
                      onClick={() => handleAnswer(option)}
                      disabled={isAnswerDisabled}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
              {answerStatus && (
                <div className={`answer-status ${answerStatus === 'Correct!' ? 'correct' : 'wrong'}`}>
                  {answerStatus}
                </div>
              )}
              {showMagicEffect && (
                <div className={`magic-effect ${answerStatus === 'Correct!' ? 'correct' : 'wrong'}`} />
              )}
            </>
          ) : (
            <>
              <div className="game-over">
                <h2>✨ Magic Complete! ✨</h2>
              </div>
              {showScores && (
                <div className="scoreboard">
                  <h3 className="scoreboard-title">Magical Scoreboard</h3>
                  {sortedPlayers.map((player, index) => (
                    <div 
                      key={player} 
                      className={`player-score ${
                        index === 0 ? 'first-place' : 
                        index === 1 ? 'second-place' : 
                        index === 2 ? 'third-place' : ''
                      }`}
                    >
                      <span className="player-name">
                        {index === 0 && '🏆 '}
                        {index === 1 && '🥈 '}
                        {index === 2 && '🥉 '}
                        {player}
                      </span>
                      <span className="player-points">{scores[player]} points</span>
                    </div>
                  ))}
                  <button className="new-round-button" onClick={startNewRound}>
                    Start New Round ✨
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default GameMenu;