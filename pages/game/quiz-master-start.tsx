import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { questions } from "./questions";
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
  const router = useRouter();

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

  const handleAnswer = (answer: string) => {
    setIsAnswerDisabled(true);
    const correct = questions[currentQuestionIndex].correctAnswer;
    const isCorrect = answer === correct;
    setAnswerStatus(isCorrect ? "Correct!" : "Wrong!");
    setShowMagicEffect(true);

    if (isCorrect) {
      setScores((prevScores) => ({
        ...prevScores,
        [players[currentPlayerIndex]]: prevScores[players[currentPlayerIndex]] + 1,
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



          {/* Scoreboard always visible below questions */}
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


                    {/* Always visible End Session button */}
          {!isSessionEnded && (
            <div className="scoreboard-buttons">
              <button className="end-session-button" onClick={endSession}>
                End Session
              </button>
            </div>
          )}



        {/* Show New Game and Go to Quiz Master button after the session ends */}
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
                Go to Quiz Master
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
