import React from 'react';
import ExitButton from '../components/ExitButton';
import GameMissingLetters from '../components/GameMissingLetters';

function MissingLetters() {
  return (
    <div style={{ position: 'relative', height: '100vh' }}>
      <ExitButton />
      <h1>Missing Letters</h1>
      <GameMissingLetters />
    </div>
  );
}

export default MissingLetters;