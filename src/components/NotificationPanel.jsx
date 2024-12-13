import React, { useState, useEffect } from 'react';
import { collection, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

function NotificationPanel() {
  const [isHovered, setIsHovered] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [patchNotes, setPatchNotes] = useState('');

  useEffect(() => {
    const fetchPatchNotes = async () => {
      try {
        const patchDoc = doc(db, 'notifications', 'Patch');
        const docSnap = await getDoc(patchDoc);
        
        if (docSnap.exists()) {
          setPatchNotes(docSnap.data().Notes || '');
          console.log('Fetched notes:', docSnap.data().Notes);
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching patch notes:', error);
      }
    };

    fetchPatchNotes();
  }, []);

  return (
    <div 
      style={{
        position: 'fixed',
        right: '0',
        top: '0',
        width: isOpen ? '300px' : (isHovered ? '50px' : '40px'),
        height: '100vh',
        backgroundColor: isOpen ? 'rgba(147, 51, 234, 0.95)' : (isHovered ? 'rgba(147, 51, 234, 0.9)' : 'rgb(147, 51, 234)'),
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: isOpen ? 'flex-start' : 'center',
        transition: 'all 0.3s ease-in-out',
        cursor: 'pointer',
        padding: isOpen ? '20px' : '0',
        boxShadow: isOpen || isHovered ? '0 0 15px rgba(147, 51, 234, 0.3)' : 'none',
        borderLeft: '2px solid rgba(255, 255, 255, 0.2)'
      }}
      onMouseEnter={() => !isOpen && setIsHovered(true)}
      onMouseLeave={() => !isOpen && setIsHovered(false)}
      onClick={() => setIsOpen(!isOpen)}
    >
      {!isOpen && (
        <span style={{
          transform: 'rotate(-90deg)',
          color: 'white',
          fontSize: '18px',
          whiteSpace: 'nowrap',
          fontWeight: 'bold',
          letterSpacing: '1px',
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
          transition: 'text-shadow 0.3s ease'
        }}>
          NOTIFICATIONS
        </span>
      )}
      
      {isOpen && (
        <div style={{
          color: '#2D0A4E',
          width: '100%',
          height: '100%',
          overflowY: 'auto',
          paddingRight: '10px'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            marginBottom: '20px',
            color: 'white',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
            paddingBottom: '10px',
            borderBottom: '2px solid rgba(255, 255, 255, 0.2)'
          }}>
            Patch Notes
          </h2>
          <p style={{
            fontSize: '16px',
            lineHeight: '1.5',
            whiteSpace: 'pre-wrap',
            color: 'white',
            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)'
          }}>
            {patchNotes || 'Loading...'}
          </p>
        </div>
      )}
    </div>
  );
}

export default NotificationPanel;