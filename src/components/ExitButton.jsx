import React from 'react';
import { useNavigate } from 'react-router-dom';

function ExitButton() {
  const navigate = useNavigate();

  const handleExit = () => {
    // Confirm before exiting
    if (window.confirm("Are you sure you want to exit this activity?")) {
      navigate('/');
    }
  };

  return (
    <button onClick={handleExit} className="exit-button">
      Exit
      <style jsx>{`
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

.exit-button {
  position: absolute;
  top: 10px;
  right: 10px;
  font-family: 'Press Start 2P', cursive;
  font-size: 12px;
  padding: 10px 15px;
  border: 2px solid #f7d794;
  cursor: pointer;
  background-color: #8B0000;
  color: #f7d794;
  text-transform: uppercase;
  transition: all 0.3s ease;
  overflow: hidden;
  box-shadow: 
    inset 0 0 10px rgba(247, 215, 148, 0.5),
    0 4px 0 #4a0000;
}

.exit-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 200%;
  background: repeating-linear-gradient(
    to bottom,
    transparent 0%,
    rgba(255, 255, 255, 0.1) 1%,
    transparent 2%
  );
  pointer-events: none;
  animation: scanline 4s linear infinite;
}

@keyframes scanline {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-50%);
  }
}

.exit-button:hover {
  transform: translateY(2px);
  box-shadow: 
    inset 0 0 10px rgba(247, 215, 148, 0.5),
    0 2px 0 #4a0000;
}

.exit-button:active {
  transform: translateY(4px);
  box-shadow: none;
}

@media (max-width: 768px) {
  .exit-button {
    font-size: 10px;
    padding: 8px 12px;
  }
}
`}</style>
    </button>
  );
}

export default ExitButton;