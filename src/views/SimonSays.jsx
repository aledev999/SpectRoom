import React from 'react';
import ExitButton from '../components/ExitButton'; 
import GameSimonSays from '../components/GameSimonSays';

function SimonSays() {
  return (
    <div style={{ position: 'relative', height: '100vh' }}> {}
    <ExitButton />
      <h1>Simon Says</h1>
      <GameSimonSays />
      <p></p>
    </div>
  );
}

export default SimonSays;

