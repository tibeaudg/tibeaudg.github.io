import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { questions } from "./questions.json";
import Head from "next/head";

interface GameState {
  currentPlayerIndex: number;
  currentQuestionIndex: number;
  answerStatus: string;
  isRoundOver: boolean;
  isAnswerDisabled: boolean;
  showMagicEffect: boolean;
  isSessionEnded: boolean;
  openAnswer: string;
  players: string[];
  scores: Record<string, number>;
  usedPasses: Record<string, boolean>;
}

const GameMenu: React.FC = () => {
  const router = useRouter();
  const [gameState, setGameState] = useState<GameState>({
    currentPlayerIndex: 0,
    currentQuestionIndex: 0,
    answerStatus: "",
    isRoundOver: false,
    isAnswerDisabled: false,
    showMagicEffect: false,
    isSessionEnded: false,
    openAnswer: "",
    players: [],
    scores: {},
    usedPasses: {}
  });

  const getDifficultyPoints = (difficulty: 'easy' | 'medium' | 'difficult' | 'hard'): number => {
    const difficultyMap = {
      easy: 1,
      medium: 2,
      difficult: 3,
      hard: 3
    };
    return difficultyMap[difficulty] || 1;
  };

  const initializeGameState = (playerList: string[]) => {
    const initialState = {
      ...gameState,
      players: playerList,
      scores: Object.fromEntries(playerList.map(player => [player, 0])),
      usedPasses: Object.fromEntries(playerList.map(player => [player, false]))
    };
    setGameState(initialState);
  };

  useEffect(() => {
    if (router.query.players) {
      const playerList = JSON.parse(router.query.players as string);
      initializeGameState(playerList);
    }
  }, [router.query.players]);

  const handlePass = () => {
    setGameState(prev => ({
      ...prev,
      isAnswerDisabled: true,
      usedPasses: { ...prev.usedPasses, [prev.players[prev.currentPlayerIndex]]: true }
    }));

    setTimeout(() => moveToNextQuestion(true), 1000);
  };

  const moveToNextQuestion = (isPass: boolean = false) => {
    setGameState(prev => {
      const nextQuestionIndex = prev.currentQuestionIndex + 1;

      if (nextQuestionIndex >= questions.length) {
        return { ...prev, isRoundOver: true };
      }




      return {
        ...prev,
        currentQuestionIndex: nextQuestionIndex,
        currentPlayerIndex: isPass ? prev.currentPlayerIndex : (prev.currentPlayerIndex + 1) % prev.players.length,
        usedPasses: { ...prev.usedPasses, [prev.players[prev.currentPlayerIndex]]: false },

        answerStatus: "",
        isAnswerDisabled: false,
        showMagicEffect: false
      };
    });
  };



  const handleAnswer = (isCorrect: boolean) => {
    setGameState(prev => {
      const newState = {
        ...prev,
        answerStatus: isCorrect ? "Correct!" : "Wrong!",
        showMagicEffect: true,
        isAnswerDisabled: true
      };

      if (isCorrect) {
        const points = getDifficultyPoints(questions[prev.currentQuestionIndex].difficulty as 'easy' | 'medium' | 'difficult' | 'hard');
        newState.scores = {
          ...prev.scores,
          [prev.players[prev.currentPlayerIndex]]: prev.scores[prev.players[prev.currentPlayerIndex]] + points
        };
      }

      return newState;
    });

    setTimeout(() => moveToNextQuestion(), 2000);
  };

  const handleMultipleChoiceAnswer = (answer: string) => {
    const currentQuestion = questions[gameState.currentQuestionIndex];
    const isCorrect = currentQuestion && currentQuestion.correctAnswer && answer.toLowerCase() === currentQuestion.correctAnswer.toLowerCase() ? true : false || false;
    handleAnswer(isCorrect);
  };

  const handleOpenAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    const currentQuestion = questions[gameState.currentQuestionIndex];
    const isCorrect = currentQuestion && currentQuestion.correctAnswer && gameState.openAnswer.toLowerCase() === currentQuestion.correctAnswer.toLowerCase() || false;
    handleAnswer(isCorrect);
    setGameState(prev => ({ ...prev, openAnswer: "" }));
  };

  const startNewRound = () => {
    setGameState(prev => ({
      ...prev,
      currentPlayerIndex: 0,
      currentQuestionIndex: 0,
      isRoundOver: false,
      answerStatus: "",
      isAnswerDisabled: false,
      showMagicEffect: false,
      isSessionEnded: false,
      openAnswer: "",
      scores: Object.fromEntries(prev.players.map(player => [player, 0])),
      usedPasses: Object.fromEntries(prev.players.map(player => [player, false]))
    }));
  };

  const renderQuestion = () => {
    const currentQuestion = questions[gameState.currentQuestionIndex];
    return (
      <div className="question-container">

        <div className="question-info">
          <div className="category">
            <span className="label">Category:</span>
            <span className="value">{currentQuestion.category}</span>
          </div>
          <div className="category">
            <span className="label">Difficulty:</span>
            <span className="value">
              {currentQuestion.difficulty} ({getDifficultyPoints(currentQuestion.difficulty as 'easy' | 'medium' | 'difficult' | 'hard')} points)
            </span>
          </div>
        </div>




        <h3 className="question">{currentQuestion.question}</h3>
        {currentQuestion.type === "multiple-choice" ? (
          <div className="answer-section">
            <div className="options-container">
              {currentQuestion.options?.map((option, index) => (
                <button
                  key={index}
                  className="option-button"
                  onClick={() => handleMultipleChoiceAnswer(option)}
                  disabled={gameState.isAnswerDisabled}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="answer-section">
            <form onSubmit={handleOpenAnswer} className="open-answer-form">
              <input
                type="text"
                value={gameState.openAnswer}
                onChange={(e) => setGameState(prev => ({ ...prev, openAnswer: e.target.value }))}
                placeholder="Type your answer..."
                disabled={gameState.isAnswerDisabled}
                className="open-answer-input"
              />
              <button
                type="submit"
                disabled={gameState.isAnswerDisabled || !gameState.openAnswer.trim()}
                className="submit-answer-button"
              >
                Submit Answer
              </button>
            </form>
          </div>
        )}

        <div className="pass-button-container">

          <button
            className={`pass-button ${gameState.usedPasses[gameState.players[gameState.currentPlayerIndex]] ? 'disabled' : ''}`}
            onClick={handlePass}
            disabled={gameState.isAnswerDisabled || gameState.usedPasses[gameState.players[gameState.currentPlayerIndex]]}
          >
            Pass Question
          </button>


        </div>
      </div>
    );
  };

  const renderScoreboard = () => {
    const sortedPlayers = [...gameState.players].sort((a, b) => gameState.scores[b] - gameState.scores[a]);
    return (
      <div className="scoreboard">
        {sortedPlayers.map((player, index) => (
          <div
            key={player}
            className={`player-score ${
              index === 0 ? "first-place" : index === 1 ? "second-place" : index === 2 ? "third-place" : ""
            }`}
          >
            <span className="player-name">
              {index === 0 && "🏆 "}
              {index === 1 && "🥈 "}
              {index === 2 && "🥉 "}
              {player}
            </span>
            <span className="player-points">{gameState.scores[player]} points</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Disney Magic Quest</title>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" />
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css" />
      </Head>

      <div>
        <header className="headerqz">
          <div className="quiz-master-title-container">
            <h3 className="quiz-master-title">Quiz Master</h3>
          </div>
        </header>

        <div className="quiz-container">
          {!gameState.isRoundOver ? (
            <>
              <h2 className="player-turn">{gameState.players[gameState.currentPlayerIndex]}</h2>
              {renderQuestion()}
              {gameState.answerStatus && (
                <div className={`answer-status ${gameState.answerStatus === "Correct!" ? "correct" : "wrong"}`}>
                  {gameState.answerStatus}
                </div>
              )}
              {gameState.showMagicEffect && (
                <div className={`magic-effect ${gameState.answerStatus === "Correct!" ? "correct" : "wrong"}`} />
              )}
            </>
          ) : (
            <div className="game-over" />
          )}

          {renderScoreboard()}

          {!gameState.isSessionEnded ? (
            <div className="scoreboard-buttons">
              <button className="end-session-button" onClick={() => setGameState(prev => ({ ...prev, isSessionEnded: true, isRoundOver: true }))}>
                End Session
              </button>
            </div>
          ) : (
            <div className="scoreboard-buttons">
              <button className="continue-playing-button" onClick={startNewRound}>
                New Game
              </button>
              <div className="go-to-quizmaster-container">
                <button className="end-session-button" onClick={() => router.push("quiz-master")}>
                  Quit
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default GameMenu;