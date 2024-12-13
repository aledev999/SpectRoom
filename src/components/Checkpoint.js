import React from 'react';

const Checkpoint = ({ name, x, y, onClick }) => {
  return (
    <div
      className="checkpoint"
      style={{ left: `${x}px`, top: `${y}px` }}
      onClick={() => onClick(name)}
    >
      {name}
    </div>
  );
};

export default Checkpoint;
