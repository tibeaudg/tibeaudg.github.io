import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import questionsData from "./questions.json";
import Head from "next/head";
import Script from "next/script";
import { db } from "../../utils/firebase";
import { doc, getDoc, writeBatch, collection, query, where, getDocs, increment } from "firebase/firestore";
import Header from "../components/header";

interface GameState {
  currentPlayerIndex: number;
  currentQuestionIndex: number;
  answerStatus: string;
  isRoundOver: boolean;
  isAnswerDisabled: boolean;
  isSessionEnded: boolean;
  players: string[];
  scores: Record<string, number>;
  usedPasses: Record<string, boolean>;
  shuffledQuestions: Question[];
  usedQuestionIds: Set<number>;
  correctAnswerIndex: number | null;
}

interface Question {
  id: number;
  category: string;
  question: string;
  correctAnswer: string;
  options?: string[];
  type: 'multiple-choice';
}

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const GameMenu: React.FC = () => {
  const router = useRouter();
  const [gameState, setGameState] = useState<GameState>({
    currentPlayerIndex: 0,
    currentQuestionIndex: 0,
    answerStatus: "",
    isRoundOver: false,
    isAnswerDisabled: false,
    isSessionEnded: false,
    players: [],
    scores: {},
    usedPasses: {},
    shuffledQuestions: [],
    usedQuestionIds: new Set<number>(),
    correctAnswerIndex: null,
  });

  const [scoresSaved, setScoresSaved] = useState(false);

  useEffect(() => {
    if (router.query.players) {
      const playerList = JSON.parse(router.query.players as string);
      initializeGameState(playerList);
    }
  }, [router.query.players]);

  const initializeGameState = async (playerEmails: string[]) => {
    const playerUsernames: string[] = await Promise.all(
      playerEmails.map(async (email) => {
        const userRef = doc(collection(db, 'users'), email);
        const userSnapshot = await getDoc(userRef);
        const userData = userSnapshot.data();
        return userData ? userData.username : email;
      })
    );

    const shuffledQuestions: Question[] = shuffleArray(questionsData.questions.map((q) => ({
      id: q.id,
      category: q.category,
      question: q.question,
      correctAnswer: q.correctAnswer || "",
      options: q.options || [],
      type: 'multiple-choice' as const,
    })));
    setGameState((prevState) => ({
      ...prevState,
      players: playerUsernames,
      scores: Object.fromEntries(playerUsernames.map((username) => [username, 0])),
      usedPasses: Object.fromEntries(playerUsernames.map((username) => [username, false])),
      shuffledQuestions,
      usedQuestionIds: new Set<number>(),
      currentQuestionIndex: 0,
      correctAnswerIndex: null,
    }));
  };

  const handlePass = () => {
    setGameState((prev) => ({
      ...prev,
      isAnswerDisabled: true,
      usedPasses: { ...prev.usedPasses, [prev.players[prev.currentPlayerIndex]]: true },
    }));

    setTimeout(() => moveToNextQuestion(), 1000);
  };

  const moveToNextQuestion = (isPass: boolean = false) => {
    setGameState((prev) => {
      const nextQuestionIndex = prev.currentQuestionIndex + 1;
      const newUsedIds = new Set(prev.usedQuestionIds).add(prev.shuffledQuestions[prev.currentQuestionIndex].id);

      if (nextQuestionIndex >= prev.shuffledQuestions.length) {
        return {
          ...prev,
          isRoundOver: true,
          usedQuestionIds: newUsedIds,
        };
      }

      return {
        ...prev,
        currentQuestionIndex: nextQuestionIndex,
        currentPlayerIndex: isPass ? prev.currentPlayerIndex : (prev.currentPlayerIndex + 1) % prev.players.length,
        usedPasses: { ...prev.usedPasses, [prev.players[prev.currentPlayerIndex]]: false },
        answerStatus: "",
        isAnswerDisabled: false,
        usedQuestionIds: newUsedIds,
        correctAnswerIndex: null,
      };
    });
  };

  const handleAnswer = (isCorrect: boolean) => {
    const status = isCorrect ? "Correct!" : "Wrong!";
    setGameState((prev) => {
      const points = isCorrect ? 1 : 0;
      return {
        ...prev,
        answerStatus: status,
        scores: {
          ...prev.scores,
          [prev.players[prev.currentPlayerIndex]]: prev.scores[prev.players[prev.currentPlayerIndex]] + points,
        },
        isAnswerDisabled: true,
        correctAnswerIndex: prev.shuffledQuestions[prev.currentQuestionIndex].options?.findIndex(
          (option) => option === prev.shuffledQuestions[prev.currentQuestionIndex].correctAnswer
        ) || null,
      };
    });

    setTimeout(() => moveToNextQuestion(), 1000);
  };

  const handleMultipleChoiceAnswer = (answer: string) => {
    const currentQuestion = gameState.shuffledQuestions[gameState.currentQuestionIndex];
    const isCorrect = answer.toLowerCase() === currentQuestion.correctAnswer.toLowerCase();
    handleAnswer(isCorrect);
  };
  
  const renderQuestion = () => {
    const currentQuestion = gameState.shuffledQuestions[gameState.currentQuestionIndex];
    if (!currentQuestion) return null;

    return (
      <div className="question-container">
        <h3 className="question">{currentQuestion.question}</h3>
        {currentQuestion.type === "multiple-choice" && (
          <div className="answer-section">
            {currentQuestion.options?.map((option, index) => {
              const isCorrectAnswer = gameState.correctAnswerIndex === index;
              const isSelectedAnswer = gameState.correctAnswerIndex !== null && gameState.correctAnswerIndex === index;

              return (
                <button
                  key={index}
                  className={`option-button ${isCorrectAnswer ? 'correct' : ''} ${isSelectedAnswer ? 'selected' : ''}`}
                  onClick={() => handleMultipleChoiceAnswer(option)}
                  disabled={gameState.isAnswerDisabled}
                  style={{
                    backgroundColor: isCorrectAnswer ? '#28a745' : (gameState.isAnswerDisabled && isSelectedAnswer ? '#f44336' : ''),
                    color: isCorrectAnswer ? '#fff' : (gameState.isAnswerDisabled && isSelectedAnswer ? '#fff' : ''),
                  }}
                >
                  {option}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  };

// In GameMenu component (waar de sessie eindigt)
const handleEndSession = () => {
  setGameState((prev) => ({ ...prev, isSessionEnded: true, isRoundOver: true }));
  if (!scoresSaved) {
    saveScoresToFirebase();
  }

  // Zet de scores en spelers om in query parameters
  const players = JSON.stringify(gameState.players);
  const scores = JSON.stringify(gameState.scores);
  router.push({
    pathname: "/game/scoreboard",
    query: { players, scores }, // Verstuur de scores en spelers
  });
};


  const saveScoresToFirebase = async () => {
    if (scoresSaved) return;

    try {
      const batch = writeBatch(db);
      for (const playerEmail of gameState.players) {
        const sessionScore = gameState.scores[playerEmail] || 0;
        const userQuery = query(collection(db, "users"), where("username", "==", playerEmail));
        const querySnapshot = await getDocs(userQuery);

        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          const playerDocRef = doc(db, "users", userDoc.id);
          batch.update(playerDocRef, { points: increment(sessionScore) });
        }
      }

      await batch.commit();
      setScoresSaved(true);
    } catch (error) {
      console.error('Error saving scores to Firebase:', error);
    }
  };

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Disney Magic Quest</title>
      </Head>

      <Header />

      <button className="goback-button" onClick={handleEndSession}>
        <i className="bi bi-arrow-left"></i> Return
      </button>

      <div className="quiz-background">
        <Script src="https://cdn.jsdelivr.net/npm/sweetalert2@11" strategy="lazyOnload" />

        {!gameState.isRoundOver ? (
          <>
            <h2 className="player-turn">{gameState.players[gameState.currentPlayerIndex]}</h2>
            <div className="answer-grid">
              {renderQuestion()}
            </div>
          </>
        ) : (
          <div className="game-over" />
        )}
      </div>
    </>
  );
};

export default GameMenu;
