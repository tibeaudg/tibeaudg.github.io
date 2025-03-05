import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import questionsData from "./questions.json";
import Head from "next/head";
import Script from "next/script";
import { db, auth } from "../../utils/firebase";
import { doc, writeBatch, increment, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import Header from "../components/header";
import GameOverScreen from "../components/gameOverScreen";
import Swal, { SweetAlertOptions } from "sweetalert2"; // Correct import for SweetAlert2

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
  correctAnswersCount: number;
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
  level?: number;
}

interface CounterProps {
  currentQuestionIndex: number;
  totalQuestions: number;
}

const Counter: React.FC<CounterProps> = ({ currentQuestionIndex, totalQuestions }) => {
  return (
    <div className="counter-container">
      <p>
        Question {currentQuestionIndex + 1} of {totalQuestions}
      </p>
    </div>
  );
};

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
    correctAnswersCount: 0,
  });

  const [scoreSaved, setScoreSaved] = useState<boolean>(false);
  const [, setUser] = useState<User | null>(null);
  const [userLoading, setUserLoading] = useState<boolean>(true);

  // Firebase auth en firestore user ophalen
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

  // Initialiseer het spel met vragen
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
    ).slice(0, 10);

    setGameState((prevState) => ({
      ...prevState,
      shuffledQuestions,
      usedQuestionIds: new Set<number>(),
      currentQuestionIndex: 0,
      correctAnswerIndex: null,
      correctAnswersCount: 0,
    }));
  };

  const moveToNextQuestion = () => {
    setGameState((prev) => {
      const nextQuestionIndex = prev.currentQuestionIndex + 1;
      const newUsedIds = new Set(prev.usedQuestionIds).add(
        prev.shuffledQuestions[prev.currentQuestionIndex].id
      );

      if (nextQuestionIndex >= prev.shuffledQuestions.length) {
        // Laat de spelautomatische eindigen
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
    setGameState((prev) => {
      const newScore = prev.score + (isCorrect ? 1 : 0);
      const newCorrectAnswersCount = isCorrect
        ? prev.correctAnswersCount + 1
        : prev.correctAnswersCount;
      const correctAnswerIndex =
        prev.shuffledQuestions[prev.currentQuestionIndex].options?.findIndex(
          (option) =>
            option.toLowerCase() ===
            prev.shuffledQuestions[prev.currentQuestionIndex].correctAnswer.toLowerCase()
        ) || null;

      return {
        ...prev,
        score: newScore,
        correctAnswerIndex: correctAnswerIndex,
        isAnswerDisabled: true,
        correctAnswersCount: newCorrectAnswersCount,
      };
    });

    const isLastQuestion =
      gameState.currentQuestionIndex === gameState.shuffledQuestions.length - 1;

    const swalOptions:SweetAlertOptions = isCorrect
      ? {
          title: "Correct!",
          text: "+1",
          icon: "success",
          timer: 1000,
          showConfirmButton: false,
          scrollbarPadding: true,
        }
      : {
          title: "Wrong!",
          text: "Better luck next time!",
          icon: "error",
          timer: 1000,
          showConfirmButton: false,
          scrollbarPadding: true,
        };

        Swal.fire(swalOptions).then(() => {
          if (isLastQuestion) {
            handleEndSession();
          } else {
            moveToNextQuestion();
          }
        });
        
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
      <>
        <button className="goback-button" onClick={handleGoHome}>
          <i className="bi bi-arrow-left"></i> Return
        </button>
        <div className="question-container">
          <Counter
            currentQuestionIndex={gameState.currentQuestionIndex}
            totalQuestions={10}
          />
          <h3 className="question">{currentQuestion.question}</h3>
          {currentQuestion.type === "multiple-choice" && (
            <div className="answer-section">
              {currentQuestion.options?.map((option, index) => {
                const isCorrectAnswer =
                  gameState.correctAnswerIndex === index;
                const isSelectedAnswer =
                  gameState.correctAnswerIndex !== null &&
                  gameState.correctAnswerIndex === index;

                return (
                  <button
                    key={index}
                    className={`option-button ${isCorrectAnswer ? "correct" : ""} ${isSelectedAnswer ? "selected" : ""}`}
                    onClick={() => handleMultipleChoiceAnswer(option)}
                    disabled={
                      gameState.isAnswerDisabled ||
                      gameState.correctAnswerIndex !== null
                    }
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
      </>
    );
  };

  const handleGoHome = () => {
    router.push("/game/progress");
  };

  const handleEndSession = async () => {
    setGameState((prev) => ({
      ...prev,
      isSessionEnded: true,
      isRoundOver: true,
    }));
    if (!scoreSaved) {
      await saveScoreAndLevelToFirebase();
    }
  };

  const saveScoreAndLevelToFirebase = async () => {
    if (scoreSaved) return;
    if (!auth.currentUser || !auth.currentUser.email) return;

    try {
      const userDocRef = doc(db, "users", auth.currentUser.email);
      const userDoc = await getDoc(userDocRef);
      const batch = writeBatch(db);

      // Update punten
      batch.update(userDocRef, {
        points: increment(gameState.score),
      });

      if (gameState.score > 7) {
        if (userDoc.exists()) {
          const userData = userDoc.data() as User;
          const currentLevel = userData.level || 1;
          const newLevel = currentLevel + 1;

          batch.update(userDocRef, {
            level: newLevel,
          });
        } else {
          batch.set(userDocRef, {
            level: 1,
          });
        }
      }

      await batch.commit();
      setScoreSaved(true);
    } catch (error) {
      console.error("Error updating score and level:", error);
    }
  };

  if (userLoading) return <div>Loading...</div>;

  return (
    <div>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Disney Magic Quest</title>
      </Head>

      <Header />
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js" />

      {!gameState.isSessionEnded ? (
        <div className="game-container">{renderQuestion()}</div>
      ) : (
        <GameOverScreen
          score={gameState.score}
          onReturnHome={handleGoHome}
          onPlayAgain={() => {
            throw new Error("Function not implemented.");
          }}
        />
      )}
    </div>
  );
};

export default SoloGame;
