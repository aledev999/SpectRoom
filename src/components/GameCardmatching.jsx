import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateProfileGameProgress } from '../store/profilesSlice'; 
import './GameCardmatching.css';
import { db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';

const GameCardmatching = () => {
  const dispatch = useDispatch();

  // get the active profile from Redux store
  const activeProfile = useSelector((state) => state.profiles.activeProfile);

  // State variables
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [gameState, setGameState] = useState('start'); 
  const [difficulty, setDifficulty] = useState(null); 
  const [lives, setLives] = useState(3);
  const [levelData, setLevelData] = useState(null);
  const [levelNumber, setLevelNumber] = useState(1);
  const [timeRemaining, setTimeRemaining] = useState(null);

  // Fetch level data from Firestore
  const fetchLevelData = async (selectedDifficulty, levelNum) => {
    try {
      const levelId = levelNum.toString().padStart(2, '0'); 
      const levelRef = doc(
        db,
        'games',
        'card_matching',
        'difficulties',
        selectedDifficulty,
        'levels',
        levelId
      );
      const levelSnap = await getDoc(levelRef);
      if (levelSnap.exists()) {
        const data = levelSnap.data();
        return data;
      } else {
        console.error('Level data does not exist');
        return null;
      }
    } catch (error) {
      console.error('Error fetching level data:', error);
      return null;
    }
  };

  // Initialize game
  const initializeGame = async (selectedDifficulty) => {
    if (!activeProfile) {
      console.error('Profile data not available');
      return;
    }
  
    console.log('Initializing game with difficulty:', selectedDifficulty);
  
    setGameState('loading');
    setDifficulty(selectedDifficulty);
  
    // Get the level number from the profile
    const profileLevel =
      activeProfile.games.CardMatching[selectedDifficulty]?.level || 1;
  
    const maxLevel = 10; 
    if (profileLevel < 1 || profileLevel > maxLevel) {
      console.error('Invalid profile level:', profileLevel);
      setGameState('gameOver');
      return;
    }
  
    setLevelNumber(profileLevel);
  
    console.log('Profile Level:', profileLevel);
  
    const data = await fetchLevelData(selectedDifficulty, profileLevel);
  
    console.log('Fetched Level Data:', data);
  
    if (!data || !data.settings) {
      console.error('Level data or settings are invalid.');
      setGameState('gameOver');
      return;
    }
  
    // Validate lives value
    const livesValue =
      typeof data.settings.lives === 'number' && data.settings.lives > 0
        ? data.settings.lives
        : 3; 
  
    setLives(livesValue);
    console.log('Lives set to:', livesValue);
  
    if (data.settings.timeLimit !== null) {
      setTimeRemaining(data.settings.timeLimit);
    } else {
      setTimeRemaining(null);
    }
  
    // Generate card values
    const numPairs = data.numPairs;
    const cardValues = [];
    for (let i = 0; i < numPairs; i++) {
      const value = String.fromCharCode(65 + i); 
      cardValues.push(value, value);
    }
  
    const initialCards = cardValues
      .sort(() => Math.random() - 0.5)
      .map((value, index) => ({ id: index, value, isFlipped: false }));
  
    setCards(initialCards);
    setFlippedCards([]);
    setMatchedPairs([]);
    setGameState('playing');
  };
  

  const handleCardClick = (clickedCard) => {
    if (flippedCards.length === 2 || gameState !== 'playing') return;
    if (matchedPairs.includes(clickedCard.value)) return;
    if (flippedCards.some((card) => card.id === clickedCard.id)) return;

    const newFlippedCards = [...flippedCards, clickedCard];
    setFlippedCards(newFlippedCards);

    const newCards = cards.map((card) =>
      card.id === clickedCard.id ? { ...card, isFlipped: true } : card
    );
    setCards(newCards);

    if (newFlippedCards.length === 2) {
      if (newFlippedCards[0].value === newFlippedCards[1].value) {
        setMatchedPairs([...matchedPairs, newFlippedCards[0].value]);
        setFlippedCards([]);
        if (matchedPairs.length + 1 === cards.length / 2) {
         
          const levelScore = timeRemaining !== null ? timeRemaining * 10 : 100;


          dispatch(
            updateProfileGameProgress({
              profileId: activeProfile.id,
              game: 'CardMatching',
              difficulty,
              level: levelNumber + 1 > 10 ? 10 : levelNumber + 1,
              score:
                (activeProfile.games.CardMatching[difficulty].score || 0) +
                levelScore,
            })
          );

          setGameState('levelComplete');
        }
      } else {
        setTimeout(() => {
          setCards(
            cards.map((card) =>
              newFlippedCards.some((flippedCard) => flippedCard.id === card.id)
                ? { ...card, isFlipped: false }
                : card
            )
          );
          setFlippedCards([]);
          if (lives !== Infinity) {
            setLives((prevLives) => {
              const updatedLives = prevLives - 1;
              if (updatedLives === 0) {
                setGameState('gameOver');
              }
              return updatedLives;
            });
          }
        }, 1000);
      }
    }
  };

  const handleNextLevel = () => {
    const newLevelNumber = levelNumber + 1 > 10 ? 10 : levelNumber + 1;
    setLevelNumber(newLevelNumber);
    setGameState('loading');
    initializeGame(difficulty);
  };


  useEffect(() => {
    let timer;
    if (timeRemaining !== null && gameState === 'playing') {
      if (timeRemaining > 0) {
        timer = setTimeout(() => {
          setTimeRemaining(timeRemaining - 1);
        }, 1000);
      } else {
        setGameState('gameOver');
      }
    }
    return () => clearTimeout(timer);
  }, [timeRemaining, gameState]);

  const renderStartScreen = () => (
    <div className="start-screen">
      <h2>Choose Difficulty</h2>
      <button
        onClick={() => {
          setLevelNumber(
            activeProfile.games.CardMatching.easy?.level || 1
          );
          initializeGame('easy');
        }}
      >
        Easy
      </button>
      <button
        onClick={() => {
          setLevelNumber(
            activeProfile.games.CardMatching.hard?.level || 1
          );
          initializeGame('hard');
        }}
      >
        Hard
      </button>
    </div>
  );

  const renderGameOver = () => (
    <div className="game-over">
      <h2>Game Over</h2>
      <button
        onClick={() => {
          setGameState('start');
        }}
      >
        Back to Menu
      </button>
    </div>
  );

  const renderLevelComplete = () => (
    <div className="level-complete">
      <h2>Level {levelNumber} Complete!</h2>
      {levelNumber < 10 ? (
        <button onClick={handleNextLevel}>Next Level</button>
      ) : (
        <div>
          <h2>Congratulations! You've completed all levels!</h2>
          <button
            onClick={() => {
              setGameState('start');
            }}
          >
            Back to Menu
          </button>
        </div>
      )}
    </div>
  );

  const renderGame = () => (
    <>
      <h2>
        Card Matching Game - Level {levelNumber} ({difficulty})
      </h2>
      <div className="status-bar">
        {difficulty === 'hard' && <div className="lives">Lives: {lives}</div>}
        {timeRemaining !== null && (
          <div className="timer">Time Remaining: {timeRemaining}s</div>
        )}
      </div>
      <div className="card-grid">
        {cards.map((card) => (
          <div
            key={card.id}
            className={`card ${
              card.isFlipped || matchedPairs.includes(card.value)
                ? 'flipped'
                : ''
            }`}
            onClick={() => handleCardClick(card)}
          >
            <div className="card-inner">
              <div className="card-front"></div>
              <div className="card-back">{card.value}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  if (!activeProfile) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="game-cardmatching">
      {gameState === 'start' && renderStartScreen()}
      {gameState === 'playing' && renderGame()}
      {gameState === 'levelComplete' && renderLevelComplete()}
      {gameState === 'gameOver' && renderGameOver()}
    </div>
  );
};

export default GameCardmatching;
