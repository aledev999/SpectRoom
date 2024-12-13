import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import Header from '../components/Header';
import NotificationPanel from '../components/NotificationPanel';
import Badges from '../components/badges';
import doorImage from '../assets/door.png';
import './MainMenu.css';

function MainMenu() {
  const [isOpening, setIsOpening] = useState(Array(4).fill(false));
  const [isClosing, setIsClosing] = useState(Array(4).fill(false));
  const [hoveredDoor, setHoveredDoor] = useState(null);

  const activeProfile = useSelector((state) => state.profiles.activeProfile);

  const descriptions = [
    'The classic card matching game. Match ALL of the pairs to win!',
    'Use your memory to reveal the path, can you remember the sequence?',
    'A quiz memory game that will test your knowledge!',
    'Can you guess the missing letters in the words?'
  ];

  const getGameInfo = (gameName) => {
    if (!activeProfile || !activeProfile.games || !activeProfile.games[gameName]) {
      return { easy: { level: 1, score: 0 }, hard: { level: 1, score: 0 } };
    }
    const gameData = activeProfile.games[gameName];
    return {
      easy: {
        level: gameData.easy?.level || 1,
        score: gameData.easy?.score || 0
      },
      hard: {
        level: gameData.hard?.level || 1,
        score: gameData.hard?.score || 0
      }
    };
  };

  const getBadgeLevel = (gameName, mode) => {
    if (!activeProfile || !activeProfile.badges) return 0;
    return activeProfile.badges[`${mode}${gameName}`] || 0;
  };

  const handleAnimationEnd = (index) => {
    if (isClosing[index]) {
      setIsClosing(prev => {
        const newState = [...prev];
        newState[index] = false;
        return newState;
      });
    }
  };

  const gameNames = ['CardMatching', 'RevealThePath', 'SimonSays', 'MissingLetters'];
  const paths = ['/cardmatching', '/revealthepath', '/simonsays', '/missletters'];
  const displayNames = ['Card\nMatching', 'Reveal the Path', 'Simon Says', 'Missing Letters'];

  return (
    <div className="main-menu">
      <Header pageTitle="Main Menu" />
      {activeProfile && (
        <div className="welcome-message">
          <span>Welcome Back, {activeProfile.nickname}!</span>
        </div>
      )}
      <div className="menu-container">
        <div className="games-container">
          {paths.map((path, index) => {
            const gameName = gameNames[index];
            const gameInfo = getGameInfo(gameName);
            return (
              <div key={index} className="game-section">
                <div className={`game-details-container ${hoveredDoor !== null && hoveredDoor !== index ? 'dimmed' : ''}`}>
                  <h2 className="game-title">{displayNames[index]}</h2>
                  <div className="game-stats">
                    <div className="stats-column">
                      <div className="difficulty-label">Easy</div>
                      <div className="level-info">Level {gameInfo.easy.level}</div>
                      <div className="score-info">Score {gameInfo.easy.score}</div>
                      <div className="game-badge">
                        {getBadgeLevel(gameName, 'Easy') === 0 ? (
                          <span>E</span>
                        ) : (
                          <Badges
                            gameType={gameName}
                            level={getBadgeLevel(gameName, 'Easy')}
                          />
                        )}
                      </div>
                    </div>
                    <div className="stats-column">
                      <div className="difficulty-label">Hard</div>
                      <div className="level-info">Level {gameInfo.hard.level}</div>
                      <div className="score-info">Score {gameInfo.hard.score}</div>
                      <div className="game-badge">
                        {getBadgeLevel(gameName, 'Hard') === 0 ? (
                          <span>H</span>
                        ) : (
                          <Badges
                            gameType={gameName}
                            level={getBadgeLevel(gameName, 'Hard')}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="door-wrapper">
                  <Link
                    to={path}
                    className="door-container"
                    onMouseEnter={() => {
                      setHoveredDoor(index);
                      setIsOpening(prev => {
                        const newState = [...prev];
                        newState[index] = true;
                        return newState;
                      });
                      setIsClosing(prev => {
                        const newState = [...prev];
                        newState[index] = false;
                        return newState;
                      });
                    }}
                    onMouseLeave={() => {
                      setHoveredDoor(null);
                      setIsOpening(prev => {
                        const newState = [...prev];
                        newState[index] = false;
                        return newState;
                      });
                      setIsClosing(prev => {
                        const newState = [...prev];
                        newState[index] = true;
                        return newState;
                      });
                    }}
                  >
                    <div
                      className={`door-image ${isOpening[index] ? 'opening' : ''} 
                                    ${isClosing[index] ? 'closing' : ''} 
                                    ${hoveredDoor !== null && hoveredDoor !== index ? 'dimmed' : ''}`}
                      onAnimationEnd={() => handleAnimationEnd(index)}
                    />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
        {hoveredDoor !== null && (
          <div className="game-description-container">
            <p className="typing-text">{descriptions[hoveredDoor]}</p>
          </div>
        )}
        <Link to="/settings" className="settings-link">
          <FontAwesomeIcon icon={faCog} />
          <span className="settings-text">User Settings</span>
        </Link>
        <h1 className="spectroom-title">Welcome to SpectRoom</h1>
      </div>
      <NotificationPanel />
    </div>
  );
}

export default MainMenu;