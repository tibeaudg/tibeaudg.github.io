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
  const [isGameOver, setIsGameOver] = useState(false);
  const [isAnswerDisabled, setIsAnswerDisabled] = useState(false);
  const [players, setPlayers] = useState<string[]>([]); // De lijst van spelers
  const router = useRouter(); 

  // Haal de spelerslijst uit de query parameters
  useEffect(() => {
    if (router.query.players) {
      setPlayers(JSON.parse(router.query.players as string)); 
    }
  }, [router.query.players]);

  const spinWheel = () => {
    setCurrentPlayerIndex(Math.floor(Math.random() * players.length));
  };

  useEffect(() => {
    if (!isGameOver) {
      spinWheel();
    }
  }, [isGameOver]);

  const handleAnswer = (answer: string) => {
    setIsAnswerDisabled(true);
    const correct = questions[currentQuestionIndex].correctAnswer;
    setAnswerStatus(answer === correct ? 'Correct!' : 'Wrong!');
    setTimeout(() => {
      setAnswerStatus('');
      setIsAnswerDisabled(false);
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        setIsGameOver(true);
      }
    }, 1000);
  };

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
          <Link href="/play" passHref>
            <div className="logout">
              <i className="bi bi-arrow-left-circle-fill"></i>
            </div>
          </Link>
          <div className="quiz-master-title-container">
            <h3 className="quiz-master-title">Quiz Master</h3>
          </div>
        </header>

        <div>
          {!isGameOver ? (
            <>
              <h2>{players[currentPlayerIndex]}&apos;s Turn</h2>
              <div>
                <h3>{questions[currentQuestionIndex].question}</h3>
                {questions[currentQuestionIndex].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    disabled={isAnswerDisabled}
                  >
                    {option}
                  </button>
                ))}
              </div>
              <div>{answerStatus}</div>
            </>
          ) : (
            <h2>Game Over</h2>
          )}
        </div>
      </div>
    </>
  );
};

export default GameMenu;
