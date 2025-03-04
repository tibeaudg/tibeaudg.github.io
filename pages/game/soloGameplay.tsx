import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import questionsData from "./questions.json";
import Head from "next/head";
import Script from "next/script";
import { db, auth } from "../../utils/firebase";
import {
  doc,
  writeBatch,
  increment,
  getDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import Header from "../components/header";

interface GameState {
  currentQuestionIndex: number;
  answerStatus: string;
  isRoundOver: boolean;
  isAnswerDisabled: boolean;
  isSessionEnded: boolean;
  score: number;
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
  type: "multiple-choice";
}

interface User {
  username: string;
  avatar?: string;
  points?: number;
  gamesPlayed?: number;
  league?: string;
  description?: string;
}

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const SoloGame: React.FC = () => {
  const router = useRouter();
  const [gameState, setGameState] = useState<GameState>({
    currentQuestionIndex: 0,
    answerStatus: "",
    isRoundOver: false,
    isAnswerDisabled: false,
    isSessionEnded: false,
    score: 0,
    shuffledQuestions: [],
    usedQuestionIds: new Set<number>(),
    correctAnswerIndex: null,
  });

  const [scoreSaved, setScoreSaved] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [userLoading, setUserLoading] = useState(true);

  // Haal de huidige gebruiker op met firebase auth en firestore
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser && firebaseUser.email) {
        try {
          const userRef = doc(db, "users", firebaseUser.email);
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            const userData = userDoc.data() as User;
            setUser(userData);
          } else {
            setUser(null);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUser(null);
        }
      } else {
        setUser(null);
        router.push("/login");
      }
      setUserLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  // Initialiseer de vragen
  useEffect(() => {
    initializeGameState();
  }, []);

  const initializeGameState = () => {
    const shuffledQuestions: Question[] = shuffleArray(
      questionsData.questions.map((q) => ({
        id: q.id,
        category: q.category,
        question: q.question,
        correctAnswer: q.correctAnswer || "",
        options: q.options || [],
        type: "multiple-choice" as const,
      }))
    );
    setGameState((prevState) => ({
      ...prevState,
      shuffledQuestions,
      usedQuestionIds: new Set<number>(),
      currentQuestionIndex: 0,
      correctAnswerIndex: null,
    }));
  };

  const moveToNextQuestion = () => {
    setGameState((prev) => {
      const nextQuestionIndex = prev.currentQuestionIndex + 1;
      const newUsedIds = new Set(prev.usedQuestionIds).add(
        prev.shuffledQuestions[prev.currentQuestionIndex].id
      );

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
        usedQuestionIds: newUsedIds,
        correctAnswerIndex: null,
        answerStatus: "",
        isAnswerDisabled: false,
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
        score: prev.score + points,
        isAnswerDisabled: true,
        correctAnswerIndex:
          prev.shuffledQuestions[prev.currentQuestionIndex].options?.findIndex(
            (option) =>
              option === prev.shuffledQuestions[prev.currentQuestionIndex].correctAnswer
          ) || null,
      };
    });

    setTimeout(() => moveToNextQuestion(), 1000);
  };

  const handleMultipleChoiceAnswer = (answer: string) => {
    const currentQuestion =
      gameState.shuffledQuestions[gameState.currentQuestionIndex];
    const isCorrect =
      answer.toLowerCase() === currentQuestion.correctAnswer.toLowerCase();
    handleAnswer(isCorrect);
  };

  const renderQuestion = () => {
    const currentQuestion =
      gameState.shuffledQuestions[gameState.currentQuestionIndex];
    if (!currentQuestion) return null;

    return (
      <div className="question-container">
        <h3 className="question">{currentQuestion.question}</h3>
        {currentQuestion.type === "multiple-choice" && (
          <div className="answer-section">
            {currentQuestion.options?.map((option, index) => {
              const isCorrectAnswer = gameState.correctAnswerIndex === index;
              const isSelectedAnswer =
                gameState.correctAnswerIndex !== null &&
                gameState.correctAnswerIndex === index;

              return (
                <button
                  key={index}
                  className={`option-button ${
                    isCorrectAnswer ? "correct" : ""
                  } ${isSelectedAnswer ? "selected" : ""}`}
                  onClick={() => handleMultipleChoiceAnswer(option)}
                  disabled={gameState.isAnswerDisabled}
                  style={{
                    backgroundColor: isCorrectAnswer
                      ? "#28a745"
                      : gameState.isAnswerDisabled && isSelectedAnswer
                      ? "#f44336"
                      : "",
                    color: isCorrectAnswer
                      ? "#fff"
                      : gameState.isAnswerDisabled && isSelectedAnswer
                      ? "#fff"
                      : "",
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

  const handleEndSession = () => {
    setGameState((prev) => ({
      ...prev,
      isSessionEnded: true,
      isRoundOver: true,
    }));
    if (!scoreSaved) {
      saveScoreToFirebase();
    }

    router.push({
      pathname: "/game/progress",
      query: { score: gameState.score },
    });
  };

  const saveScoreToFirebase = async () => {
    if (scoreSaved) return;
    if (!auth.currentUser || !auth.currentUser.email) return;

    try {
      const userDocRef = doc(db, "users", auth.currentUser.email);
      const batch = writeBatch(db);
      batch.update(userDocRef, {
        points: increment(gameState.score),
      });
      await batch.commit();
      setScoreSaved(true);
    } catch (error) {
      console.error("Error saving score to Firebase:", error);
    }
  };

  if (userLoading) {
    return <div>Loading user...</div>;
  }

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />
        <title>Disney Magic Quest - Solo Mode</title>
      </Head>

      <Header />

      <button className="goback-button" onClick={handleEndSession}>
        <i className="bi bi-arrow-left"></i> Return
      </button>

      <div className="quiz-background">
        <Script
          src="https://cdn.jsdelivr.net/npm/sweetalert2@11"
          strategy="lazyOnload"
        />

        {!gameState.isRoundOver ? (
          <>
            {/* Toon de username van de huidige gebruiker */}
            <h2 className="player-turn">
              {user?.username ? user.username : "Speler"}
            </h2>
            <div className="answer-grid">{renderQuestion()}</div>
          </>
        ) : (
          <div className="game-over" />
        )}
      </div>
    </>
  );
};

export default SoloGame;
