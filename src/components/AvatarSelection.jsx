import React, { useState } from 'react';
import './avatar.css';
import AvatarDisplay from './AvatarDisplay';

const AvatarSelection = ({ currentAvatar = 1, onSelect, disabled = true }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  const totalAvatars = 4;

  const handlePrevious = () => {
    if (disabled) return;
    
    setIsChanging(true);
    const newAvatarId = currentAvatar === 1 ? totalAvatars : currentAvatar - 1;
    onSelect(newAvatarId);
    setTimeout(() => setIsChanging(false), 300);
  };

  const handleNext = () => {
    if (disabled) return;
    setIsChanging(true);
    const newAvatarId = currentAvatar === totalAvatars ? 1 : currentAvatar + 1;
    onSelect(newAvatarId);
    setTimeout(() => setIsChanging(false), 300); 
  };

  return (
    <div className={`avatar-selection ${disabled ? 'disabled' : ''}`}>
      <button 
        className="nav-button prev"
        onClick={handlePrevious}
        disabled={disabled}
      />

      <div className={`avatar-preview ${isChanging ? 'changing' : ''}`}>
        <div 
          className="avatar-container"
          onMouseEnter={() => !disabled && setIsHovered(true)}
          onMouseLeave={() => !disabled && setIsHovered(false)}
        >
          <AvatarDisplay 
            avatarId={currentAvatar}
            isAnimating={isHovered && !disabled}
            size="lg"
          />
        </div>
      </div>

      <button 
        className="nav-button next"
        onClick={handleNext}
        disabled={disabled}
      />
    </div>
  );
};

export default AvatarSelection;