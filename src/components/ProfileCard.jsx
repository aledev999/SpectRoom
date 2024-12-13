import React, { useState } from 'react';
import AvatarDisplay from './AvatarDisplay';
import Badges from './badges';
import './ProfileCard.css';

function ProfileCard({ profile, onClick }) {
  const [isHovered, setIsHovered] = useState(false);
 
  const gameOrder = ['CardMatching', 'RevealThePath', 'SimonSays', 'MissingLetters'];
   // Scores
  const totalScore = Object.values(profile.games || {}).reduce((total, game) => {
    return total + (game.easy?.score || 0) + (game.hard?.score || 0);
  }, 0);
  
  // Badges
  const getBadgeColor = (level) => {
    switch(level) {
      case 0: return '#ccc'; 
      case 1: return '#CD7F32'; 
      case 2: return '#C0C0C0'; 
      case 3: return '#FFD700'; 
      default: return '#ccc';
    }
  };

  return (
    <div 
      className="profile-card" 
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ borderColor: profile.favoriteColor || '#ccc' }}
    >
      <div className="profile-info">
        <h3>{profile.nickname}</h3>
      </div>

      <div className="profile-picture">
        <AvatarDisplay
          avatarId={profile.profilePicture} 
          size="md"
          isAnimating={isHovered}
        />
      </div>

      <div className="total-score">Score: {totalScore}</div>

      <div className="badges-container">
        {/* Easy Mode Badges  */}
        <div className="badge-row">
          {gameOrder.map(game => (
            <div 
              key={`Easy${game}`}
              className="badge"
              style={{ backgroundColor: getBadgeColor(profile.badges[`Easy${game}`]) }}
              title={`Easy ${game}`}
            >
              {profile.badges[`Easy${game}`] === 0 ? (
                <span>E</span>
              ) : (
                <Badges 
                  gameType={game}
                  level={profile.badges[`Easy${game}`]}
                />
              )}
            </div>
          ))}
        </div>
        {/* Hard Mode Badges  */}
        <div className="badge-row">
          {gameOrder.map(game => (
            <div 
              key={`Hard${game}`}
              className="badge"
              style={{ backgroundColor: getBadgeColor(profile.badges[`Hard${game}`]) }}
              title={`Hard ${game}`}
            >
              {profile.badges[`Hard${game}`] === 0 ? (
                <span>H</span>
              ) : (
                <Badges 
                  gameType={game}
                  level={profile.badges[`Hard${game}`]}
                />
              )}
            </div>
          ))}
        </div>
        {/* Streak Badge  */}
        <div className="badge-row streak-row">
          <div 
            className="badge streak-badge"
            style={{ backgroundColor: getBadgeColor(profile.badges.StreakBadge) }}
            title={`Streak Badge: ${profile.streakTracking} days`}
          >
            {profile.badges.StreakBadge === 0 ? (
              <span>S</span>
            ) : (
              <Badges 
                gameType="Streak"
                level={profile.badges.StreakBadge}
                isStreak={true}
              />
            )}
          </div>
        </div>
      </div>

      {profile.active && <div className="active-badge">(Active)</div>}
    </div>
  );
}

export default ProfileCard;