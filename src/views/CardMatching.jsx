import React from 'react';
import ExitButton from '../components/ExitButton';
import GameCardmatching from '../components/GameCardmatching';

function CardMatching() {
  return (
    <div style={{ position: 'relative', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <ExitButton />
      <h1>Card Matching</h1>
      <GameCardmatching />
    </div>
  );
}

export default CardMatching;