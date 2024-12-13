import React, { useEffect, useRef } from 'react';
import backgroundMusic from '../assets/background-music.mp3';

function BackgroundMusic() {
  const audioRef = useRef(new Audio(backgroundMusic));

  useEffect(() => {
    const audio = audioRef.current;
    audio.volume = 0.5;
    audio.loop = true;
    
    const playAudio = async () => {
      try {
        await audio.play();
        console.log('Audio should be playing');
      } catch (err) {
        console.error('Audio play failed:', err);
      }
    };
    
    playAudio();

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  return null;
}

export default BackgroundMusic;