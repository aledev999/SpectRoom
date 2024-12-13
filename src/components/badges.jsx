import React from 'react';
import badgesImage from '../assets/badges.png';
import './badges.css';

const Badges = ({ gameType, level, isStreak = false }) => {
  const getGameNumber = (gameType) => {
    const gameNumbers = {
      'CardMatching': 1,
      'RevealThePath': 2,
      'SimonSays': 3,
      'MissingLetters': 4
    };
    return gameNumbers[gameType] || 1;
  };

  const getBadgeStyle = () => {
    if (level === 0) return { display: 'none' };

    const row = Math.min(level - 1, 3);
    const column = getGameNumber(gameType) - 1;
    
    return {
      width: '48px',
      height: '48px',
      backgroundImage: `url(${badgesImage})`,
      backgroundPosition: `-${column * 48}px -${row * 48}px`,
      backgroundSize: 'auto',
      backgroundRepeat: 'no-repeat',
      imageRendering: 'pixelated'
    };
  };

  if (level === 0) return null;

  return (
    <div className="badge-sprite" style={getBadgeStyle()} />
  );
};

export default Badges;