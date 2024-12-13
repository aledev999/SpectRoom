import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ExitButton from '../components/ExitButton';
import './GameSimonSays.css';

function GameSimonSays() {
  const activeProfile = useSelector((state) => state.profiles.activeProfile); // Access activeProfile from Redux store

  const [prompt, setPrompt] = useState('');
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState('');

  const prompts = [
    'What is your nickname?',
    'What is your grade?',
    'What is your school name?',
    'Who is your teacher?',
    'What is your address?',
  ];

  const generatePrompt = () => {
    const randomIndex = Math.floor(Math.random() * prompts.length);
    setPrompt(prompts[randomIndex]);
  };

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  const checkAnswer = () => {
    let correctAnswer = '';

    switch (prompt) {
      case 'What is your nickname?':
        correctAnswer = activeProfile?.nickname || 'n/a';
        break;
      case 'What is your grade?':
        correctAnswer = activeProfile?.gradeClass || 'n/a';
        break;
      case 'What is your school name?':
        correctAnswer = activeProfile?.schoolName || 'n/a';
        break;
      case 'Who is your teacher?':
        correctAnswer = activeProfile?.schoolTeacher || 'n/a';
        break;
      case 'What is your address?':
        correctAnswer = activeProfile?.address || 'n/a'; // Add the address field here
        break;
      default:
        break;
    }

    if (userInput.trim().toLowerCase() === correctAnswer.toLowerCase()) {
      setFeedback('Correct!');
    } else {
      setFeedback(`Incorrect! The correct answer is: ${correctAnswer}`);
    }
  };

  useEffect(() => {
    generatePrompt();
  }, []);

  return (
    <div className="game-container">
      <ExitButton />
      <h1>Simon Says</h1>
      <p className="instructions">{prompt}</p>
      <input
        type="text"
        className="input-field"
        value={userInput}
        onChange={handleInputChange}
        placeholder="Enter your answer here"
      />
      <button className="submit-button" onClick={checkAnswer}>
        Submit
      </button>
      {feedback && <div className="feedback">{feedback}</div>}
    </div>
  );
}

export default GameSimonSays;
