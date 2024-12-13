import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfileGameProgress } from '../store/profilesSlice';
import './GameMissingLetters.css';

const GameMissingLetters = () => {
  const dispatch = useDispatch();
  const activeProfile = useSelector((state) => state.profiles.activeProfile);


  // State variables for the game
  const [letters, setLetters] = useState([]);
  const [currentWord, setCurrentWord] = useState('');
  const [missingLetters, setMissingLetters] = useState([]);
  const [userInputs, setUserInputs] = useState([]);
  const [gameState, setGameState] = useState('start');

  // Fetch word data from Firestore (Example Firestore structure)
  const fetchWordData = async () => {
    if (!activeProfile) return null;
  
    // Example: Use the activeProfile's nickname as the word
    const word = activeProfile.nickname || 'default';
  
    const missingIndexes = [];
    const numRows = Math.ceil(word.length / 3); // Split into rows of 3 characters max
  
    for (let row = 0; row < numRows; row++) {
      // Ensure at least one missing letter in each row
      const start = row * 3;
      const end = Math.min(start + 3, word.length); // Ensure we don't go out of bounds
      const rowIndexes = Array.from({ length: end - start }, (_, i) => i + start);
  
      // Randomly pick one letter to be missing in this row
      const randomIndex = rowIndexes[Math.floor(Math.random() * rowIndexes.length)];
      missingIndexes.push(randomIndex);
    }
  
    return { word, missingIndexes };
  };

  // Initialize game
  const initializeGame = async () => {
    setGameState('loading');
    const data = await fetchWordData();
    if (data) {
      setCurrentWord(data.word);
      setMissingLetters(data.missingIndexes);
      setUserInputs(Array(data.word.length).fill(''));
      setGameState('playing');
    } else {
      setGameState('error');
    }
  };

  // Handle user input for missing letters
  const handleInput = (index, value) => {
    const newInputs = [...userInputs];
    newInputs[index] = value;
    setUserInputs(newInputs);
  };

  // Check the answers
  const checkAnswers = () => {
    let allCorrect = true;
    missingLetters.forEach((index) => {
      if (userInputs[index] !== currentWord[index]) {
        allCorrect = false;
      }
    });

    if (allCorrect) {
      setGameState('won');
      // Update game progress here
      dispatch(updateProfileGameProgress({
        profileId: activeProfile.id,
        game: 'MissingLetters',
        score: 100 // Example score
      }));
    } else {
      setGameState('retry');
    }
  };

  useEffect(() => {
    initializeGame();
  }, []);

  if (!activeProfile) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="game-missingletters">
      {gameState === 'start' && <button onClick={initializeGame}>Start Game</button>}
      {gameState === 'playing' && (
        <div>
          <h2>Fill in the Missing Letters</h2>
          <div>
            {currentWord.split('').map((letter, index) =>
              missingLetters.includes(index) ? (
                <input
                  key={index}
                  value={userInputs[index]}
                  onChange={(e) => handleInput(index, e.target.value)}
                />
              ) : (
                <span key={index}>{letter}</span>
              )
            )}
          </div>
          <button onClick={checkAnswers}>Submit Answers</button>
        </div>
      )}
      {gameState === 'won' && <div>Congratulations! You have completed the challenge.</div>}
      {gameState === 'retry' && <div>Try Again. <button onClick={initializeGame}>Retry</button></div>}
      {gameState === 'error' && <div>Error loading game data.</div>}
    </div>
  );
};

export default GameMissingLetters;
