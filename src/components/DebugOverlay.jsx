import React, { useState } from 'react';
import { useSelector } from 'react-redux';

function DebugOverlay() {
  const [isMinimized, setIsMinimized] = useState(false);
  const user = useSelector((state) => state.users.currentUser);
  const activeProfile = useSelector((state) => state.profiles.activeProfile);

  if (!user) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '10px', 
      left: '10px',  
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      color: '#00ff00',
      padding: '10px',
      borderRadius: '5px',
      fontFamily: 'monospace',
      fontSize: '12px',
      zIndex: 9999,
      maxWidth: isMinimized ? '100px' : '300px',
      maxHeight: isMinimized ? '30px' : '500px',
      overflow: 'auto',
      transition: 'all 0.3s ease'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '5px',
        cursor: 'pointer'
      }}
      onClick={() => setIsMinimized(!isMinimized)}>
        <span>Debug Info {isMinimized ? '[ + ]' : '[ - ]'}</span>
      </div>

      {!isMinimized && (
        <>
          <div style={{ marginBottom: '10px' }}>
            <strong>User:</strong><br />
            ID: {user.id}<br />
            Email: {user.email}
          </div>

          {activeProfile && (
            <div>
              <strong>Active Profile:</strong><br />
              Nickname: {activeProfile.nickname}<br />
              Grade: {activeProfile.gradeClass}<br />
              School: {activeProfile.schoolName}<br />
              Teacher: {activeProfile.schoolTeacher}<br />
              Bus: {activeProfile.schoolBusNumber}<br />
              Blood Type: {activeProfile.bloodType}<br />
              Sound: {activeProfile.soundEffects}<br />
              Music: {activeProfile.music}<br />
              Color: <span style={{
                display: 'inline-block',
                width: '12px',
                height: '12px',
                backgroundColor: activeProfile.favoriteColor,
                marginLeft: '5px',
                border: '1px solid white'
              }}></span>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default DebugOverlay;