import React from 'react';
import './FullPageLoader.css';

function FullPageLoader() {
  return (
    <div className="loader-overlay">
      <div className="loader"></div>
    </div>
  );
}

export default FullPageLoader;