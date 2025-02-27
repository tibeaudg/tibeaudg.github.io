import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { questions } from "./questions.json";
import Head from "next/head";
import Script from 'next/script';

import Swal from "sweetalert2";

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
  shuffledQuestions: Question[]; // Voeg deze regel toe
  usedQuestionIds: Set<number>; // Track used questions

}



// Utility functions
const shuffleArray = (array: unknown[]) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};


// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getUniqueQuestions = (allQuestions: any[], usedIds: Set<number>) => {
  return allQuestions.filter(question => !usedIds.has(question.id));
};




// New interface for persistent player data
interface PlayerData {
  username: string;
  totalPoints: number;
}

interface Question {
  id: number;
  category: string;
  difficulty: 'easy' | 'medium' | 'difficult' | 'hard';
  question: string;
  correctAnswer: string;
  options?: string[];
  type: 'multiple-choice' | 'open';
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
    usedPasses: {},
    shuffledQuestions: [],
    usedQuestionIds: new Set<number>()
  });
  
  // Track if scores have been saved already
  const [scoresSaved, setScoresSaved] = useState(false);
  

  const getDifficultyPoints = (difficulty: 'easy' | 'medium' | 'difficult' | 'hard'): number => {
    const difficultyMap = {
      easy: 1,
      medium: 2,
      difficult: 3,
      hard: 4
    };
    return difficultyMap[difficulty] || 1;
  };

  const [isScoreboardVisible, setIsScoreboardVisible] = useState(false);


  // eslint-disable-next-line react-hooks/exhaustive-deps
  const initializeGameState = (playerList: string[]) => {
    const uniqueQuestions = getUniqueQuestions(questions, new Set<number>());
    const shuffledQuestions = shuffleArray(uniqueQuestions) as Question[];



    const initialState = {
      ...gameState,
      players: playerList,
      scores: Object.fromEntries(playerList.map(player => [player, 0])),
      usedPasses: Object.fromEntries(playerList.map(player => [player, false])),
      shuffledQuestions: shuffledQuestions as Question[],
      usedQuestionIds: new Set<number>(),
      currentQuestionIndex: 0
    };
    setGameState(initialState);
    
  };




  useEffect(() => {
    if (router.query.players) {
      const playerList = JSON.parse(router.query.players as string);
      initializeGameState(playerList);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.players]);  // Removed initializeGameState from dependencies
  



  // Function to save scores to localStorage when session ends
  const saveScoresToStorage = () => {
    if (scoresSaved) return; // Prevent duplicate saves
    
    try {
      
      // Get existing player data from localStorage
      const existingDataStr = localStorage.getItem('playerRankings');
      const playerRankings: PlayerData[] = existingDataStr ? JSON.parse(existingDataStr) : [];
      
      // Update player data with current session scores
      gameState.players.forEach(playerName => {
        const sessionScore = gameState.scores[playerName] || 0;
        
        // Find existing player data or create new entry
        const existingPlayerIndex = playerRankings.findIndex(p => p.username === playerName);
        
        if (existingPlayerIndex >= 0) {
          // Update existing player
          playerRankings[existingPlayerIndex].totalPoints += sessionScore;
        } else {
          // Add new player
          playerRankings.push({
            username: playerName,
            totalPoints: sessionScore,
          });
        }
      });
      
      // Save updated data back to localStorage
      localStorage.setItem('playerRankings', JSON.stringify(playerRankings));
      setScoresSaved(true);
      
    } catch (error) {
      console.error('Error saving scores:', error);
      
      // Show error notification
      Swal.fire({
        icon: 'error',
        title: 'Error Saving Scores',
        text: 'There was a problem saving your scores to the leaderboard.',
        showConfirmButton: true
      });
    }
  };

  const showAnswerPopup = (status: string, correctAnswer: string) => {
    // Determine the icon and color based on status
    const icon = status === "Correct!" ? "success" : "error";
    const title = status === "Correct!" ? status : "Wrong!";
    
    Swal.fire({
      icon: icon as unknown,
      title: title,
      html: status === "Correct!" 
        ? `<p>You got it right! 🎉</p>` 
        : `<p>The correct answer is:</p><p class="font-weight-bold text-success">${correctAnswer}</p>`,
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: true,
      allowOutsideClick: true,
      allowEscapeKey: true,
      allowEnterKey: true
    });
  };

  const handlePass = () => {
    const currentQuestion = questions[gameState.currentQuestionIndex];
    
    setGameState(prev => ({
      ...prev,
      isAnswerDisabled: true,
      usedPasses: { ...prev.usedPasses, [prev.players[prev.currentPlayerIndex]]: true }
    }));

    // Show the answer in a popup
    Swal.fire({
      icon: 'info',
      title: 'Question Passed',
      html: `<p>The correct answer is:</p><p class="font-weight-bold text-success">${currentQuestion.correctAnswer || ""}</p>`,
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false,
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false
    });

    setTimeout(() => moveToNextQuestion(true), 3000);
  };





  const moveToNextQuestion = (isPass: boolean = false) => {
    setGameState(prev => {
      const nextQuestionIndex = prev.currentQuestionIndex + 1;
      const currentQuestion = prev.shuffledQuestions[prev.currentQuestionIndex];

      // Mark question as used
      const newUsedIds = new Set(prev.usedQuestionIds).add((currentQuestion as { id: number }).id);

      if (nextQuestionIndex >= prev.shuffledQuestions.length) {
        return {
          ...prev,
          isRoundOver: true,
          usedQuestionIds: newUsedIds
        };
      }








      return {
        ...prev,
        currentQuestionIndex: nextQuestionIndex,
        currentPlayerIndex: isPass ? prev.currentPlayerIndex : (prev.currentPlayerIndex + 1) % prev.players.length,
        usedPasses: { ...prev.usedPasses, [prev.players[prev.currentPlayerIndex]]: false },
        answerStatus: "",
        isAnswerDisabled: false,
        showMagicEffect: false,
        usedQuestionIds: newUsedIds
      };
    });
  };





  const handleAnswer = (isCorrect: boolean) => {
    const currentQuestion = gameState.shuffledQuestions[gameState.currentQuestionIndex];
    const status = isCorrect ? "Correct!" : "Wrong!";

    setGameState(prev => {
      const newState = {
        ...prev,
        answerStatus: status,
        showMagicEffect: true,
        isAnswerDisabled: true
      };





      if (isCorrect) {
        const points = getDifficultyPoints((currentQuestion as { difficulty: 'easy' | 'medium' | 'difficult' | 'hard' }).difficulty);
        newState.scores = {
          ...prev.scores,
          [prev.players[prev.currentPlayerIndex]]: prev.scores[prev.players[prev.currentPlayerIndex]] + points
        };
      }

      return newState;
    });




    showAnswerPopup(status, (currentQuestion as { correctAnswer: string }).correctAnswer || "");
    setTimeout(() => moveToNextQuestion(), 3000);
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
    const uniqueQuestions = getUniqueQuestions(questions, gameState.usedQuestionIds);


    if (uniqueQuestions.length === 0) {
      Swal.fire({
        icon: 'info',
        title: 'No More Questions',
        text: 'All questions have been used in this session!',
        showConfirmButton: true
      });
      return;
    }

    const shuffledQuestions = shuffleArray(uniqueQuestions) as Question[];





    // Reset scores saved flag when starting a new round
    setScoresSaved(false);
    





    setGameState(prev => ({
      ...prev,
      shuffledQuestions: shuffledQuestions,
      currentQuestionIndex: 0,
      currentPlayerIndex: 0,
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





  const handleEndSession = () => {
    setGameState(prev => ({ 
      ...prev, 
      isSessionEnded: true, 
      isRoundOver: true 
    }));


    setIsScoreboardVisible(true);  // Maak het scoreboard zichtbaar

    
    // Save scores when session ends
    saveScoresToStorage();
  };

  const handleQuit = () => {
    // Make sure scores are saved before quitting
    if (!scoresSaved) {
      saveScoresToStorage();
    }
    router.push("/play");
  };

  const renderQuestion = () => {
    const currentQuestion = gameState.shuffledQuestions[gameState.currentQuestionIndex];
    if (!currentQuestion) return null;




    
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
              index === 0 ? "first-place" : 
              index === 1 ? "second-place" : 
              index === 2 ? "third-place" : 
              index === 3 ? "fourth-place" : ""
            }`}
          >
            <span className="player-name">
              {index === 0 && "🏆 "}
              {index === 1 && "🥈 "}
              {index === 2 && "🥉 "}
              {index === 3 && "💩 "}
              {player} {/* Voeg de speler naam expliciet toe */}
            </span>
            <span className="player-points">{gameState.scores[player]}</span>
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
        <Script src="https://cdn.jsdelivr.net/npm/sweetalert2@11" strategy="lazyOnload" />





        <div className="quiz-container">

          {!gameState.isRoundOver ? (
            <>
              <h2 className="player-turn">{gameState.players[gameState.currentPlayerIndex]}</h2>
              {renderQuestion()}
              {gameState.showMagicEffect && (
                <div className={`magic-effect ${gameState.answerStatus === "Correct!" ? "correct" : "wrong"}`} />
              )}
            </>
          ) : (
            <div className="game-over" />
            
          )}

          {isScoreboardVisible && renderScoreboard()}


          {!gameState.isSessionEnded ? (
            <div className="scoreboard-buttons">
              <button className="end-session-button" onClick={handleEndSession}>
                Scoreboard
              </button>
            </div>



          ) : (
            
            <div className="scoreboard-buttons">
              <button className="btn-newgame" onClick={startNewRound}>
                New Game
              </button>
              <div className="go-to-quizmaster-container">
                <button className="end-session-button" onClick={handleQuit}>
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