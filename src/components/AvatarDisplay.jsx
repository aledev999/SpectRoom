import React, { useState, useEffect } from 'react';
import './Avatar.css';
import skeletonSprite from '../assets/skeleton.png';
import penguinSprite from '../assets/penguin.png';
import bearSprite from '../assets/bear.png';
import ghostSprite from '../assets/ghost.png';

const AvatarDisplay = ({ avatarId, isAnimating = false, size = 'md' }) => {
  const [currentFrame, setCurrentFrame] = useState(0);

  const avatarConfigs = {
    1: { // Skeleton
      src: skeletonSprite,
      frames: 4,
      frameSize: 32,
      singleRow: true,
      animationSpeed: 150
    },
    2: { // Penguin
      src: penguinSprite,
      frames: 4,
      frameSize: 32,
      singleRow: true,
      animationSpeed: 150
    },
    3: { // Bear
      src: bearSprite,
      frames: 4,
      frameSize: 32,
      singleRow: true,
      animationSpeed: 150
    },
    4: { // Ghost
      src: ghostSprite,
      frames: 8,
      frameSize: 32,
      singleRow: true,
      animationSpeed: 150
    }
  };

  useEffect(() => {
    let intervalId;
    
    if (isAnimating) {
      intervalId = setInterval(() => {
        setCurrentFrame(prev => {
          const config = avatarConfigs[avatarId];
          return (prev + 1) % config.frames;
        });
      }, avatarConfigs[avatarId]?.animationSpeed || 150);
    } else {
      setCurrentFrame(0);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isAnimating, avatarId]);

  const config = avatarConfigs[avatarId];
  if (!config) return null;

  const spriteStyle = {
    width: '32px',
    height: '32px',
    backgroundImage: `url(${config.src})`,
    backgroundPosition: `-${currentFrame * 32}px 0`, 
    backgroundSize: `${config.frames * 32}px 32px`,
    imageRendering: 'pixelated',
    transform: 'scale(4)', 
    transformOrigin: 'center',
    margin: 'auto'
  };

  return (
    <div className={`avatar-display avatar-${size}`}>
      <div 
        className="avatar-sprite"
        style={spriteStyle}
      />
    </div>
  );
};

export default AvatarDisplay;