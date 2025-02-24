import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { questions } from "./questions.json";
import Head from "next/head";

const GameMenu: React.FC = () => {
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answerStatus, setAnswerStatus] = useState("");
  const [isRoundOver, setIsRoundOver] = useState(false);
  const [isAnswerDisabled, setIsAnswerDisabled] = useState(false);
  const [players, setPlayers] = useState<string[]>([]);
  const [showMagicEffect, setShowMagicEffect] = useState(false);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [isSessionEnded, setIsSessionEnded] = useState(false);
  const [openAnswer, setOpenAnswer] = useState("");
  const router = useRouter();

  const getDifficultyPoints = (difficulty: string): number => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return 1;
      case "medium":
        return 2;
      case "difficult":
      case "hard":
        return 3;
      default:
        return 1;
    }
  };

  const resetScores = () => {
    const initialScores: Record<string, number> = {};
    players.forEach((player: string) => {
      initialScores[player] = 0;
    });
    setScores(initialScores);
  };

  useEffect(() => {
    if (router.query.players) {
      const playerList = JSON.parse(router.query.players as string);
      setPlayers(playerList);
      const initialScores: Record<string, number> = {};
      playerList.forEach((player: string) => {
        initialScores[player] = 0;
      });
      setScores(initialScores);
    }
  }, [router.query.players]);

  const handleMultipleChoiceAnswer = (answer: string) => {
    setIsAnswerDisabled(true);
    const correct = questions[currentQuestionIndex].correctAnswer;
    const isCorrect = answer.toLowerCase() === correct.toLowerCase();
    handleAnswerResult(isCorrect);
  };

  const handleOpenAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnswerDisabled(true);
    const correct = questions[currentQuestionIndex].correctAnswer;
    const isCorrect = openAnswer.toLowerCase() === correct.toLowerCase();
    handleAnswerResult(isCorrect);
    setOpenAnswer("");
  };

  const handleAnswerResult = (isCorrect: boolean) => {
    setAnswerStatus(isCorrect ? "Correct!" : "Wrong!");
    setShowMagicEffect(true);

    if (isCorrect) {
      const points = getDifficultyPoints(questions[currentQuestionIndex].difficulty);
      setScores((prevScores) => ({
        ...prevScores,
        [players[currentPlayerIndex]]: prevScores[players[currentPlayerIndex]] + points,
      }));
    }

    setTimeout(() => {
      setAnswerStatus("");
      setIsAnswerDisabled(false);
      setShowMagicEffect(false);
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setCurrentPlayerIndex((currentPlayerIndex + 1) % players.length);
      } else {
        setIsRoundOver(true);
      }
    }, 2000);
  };

  const startNewRound = () => {
    setCurrentQuestionIndex(0);
    setCurrentPlayerIndex(0);
    setIsRoundOver(false);
    setAnswerStatus("");
    setIsAnswerDisabled(false);
    setShowMagicEffect(false);
    setIsSessionEnded(false);
    setOpenAnswer("");
    resetScores();
  };

  const endSession = () => {
    setIsSessionEnded(true);
    setIsRoundOver(true);
  };

  const sortedPlayers = [...players].sort((a, b) => scores[b] - scores[a]);

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Disney Magic Quest</title>
        <link
          rel="stylesheet"
          href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
        />
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css"
        />
      </Head>

      <div>
        <header className="headerqz">
          <div className="quiz-master-title-container">
            <h3 className="quiz-master-title">Quiz Master</h3>
          </div>
        </header>

        <div className="quiz-container">
          {!isRoundOver ? (
            <>
              <h2 className="player-turn">{players[currentPlayerIndex]}</h2>
              <div className="question-container">



                <div className="question-info">
                    <div className="category">
                      <span className="label">Category:</span>
                      <span className="value">{questions[currentQuestionIndex].category}</span>
                    </div>
                    <div className="category">
                    <span className="label">Difficulty:</span>
                    <span className="value">{questions[currentQuestionIndex].difficulty} 
                      ({getDifficultyPoints(questions[currentQuestionIndex].difficulty)} points)
                    </span>
                  </div>
                </div>


                <h3 className="question">{questions[currentQuestionIndex].question}</h3>
                
                {questions[currentQuestionIndex].type === "multiple-choice" ? (
                  <div className="options-container">
                    {questions[currentQuestionIndex].options?.map((option, index) => (
                      <button
                        key={index}
                        className="option-button"
                        onClick={() => handleMultipleChoiceAnswer(option)}
                        disabled={isAnswerDisabled}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                ) : (
                  <form onSubmit={handleOpenAnswer} className="open-answer-form">
                    <input
                      type="text"
                      value={openAnswer}
                      onChange={(e) => setOpenAnswer(e.target.value)}
                      placeholder="Type your answer..."
                      disabled={isAnswerDisabled}
                      className="open-answer-input"
                    />
                    <button 
                      type="submit" 
                      disabled={isAnswerDisabled || !openAnswer.trim()}
                      className="submit-answer-button"
                    >
                      Submit Answer
                    </button>
                  </form>
                )}
              </div>
              {answerStatus && (
                <div className={`answer-status ${answerStatus === "Correct!" ? "correct" : "wrong"}`}>
                  {answerStatus}
                </div>
              )}
              {showMagicEffect && (
                <div className={`magic-effect ${answerStatus === "Correct!" ? "correct" : "wrong"}`} />
              )}
            </>
          ) : (
            <div className="game-over"></div>
          )}

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
                    : ""
                }`}
              >
                <span className="player-name">
                  {index === 0 && "🏆 "}
                  {index === 1 && "🥈 "}
                  {index === 2 && "🥉 "}
                  {player}
                </span>
                <span className="player-points">{scores[player]} points</span>
              </div>
            ))}
          </div>

          {!isSessionEnded && (
            <div className="scoreboard-buttons">
              <button className="end-session-button" onClick={endSession}>
                End Session
              </button>
            </div>
          )}

          {isSessionEnded && (
            <div className="scoreboard-buttons">
              <button className="continue-playing-button" onClick={startNewRound}>
                New Game
              </button>
              <div className="go-to-quizmaster-container">
                <button
                  className="end-session-button"
                  onClick={() => router.push("quiz-master")}
                >
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