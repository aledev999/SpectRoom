import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth } from '../firebase/config';
import { EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { CirclePicker } from 'react-color';
import AvatarSelection from '../components/AvatarSelection';
import './SettingsPage.css';

function SettingsPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const [noPersonalData, setNoPersonalData] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [authPassword, setAuthPassword] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [profileData, setProfileData] = useState({
    nickname: '',
    bloodType: '',
    favoriteColor: '#a52a2a',
    gradeClass: '',
    schoolName: '',
    schoolTeacher: '',
    schoolBusNumber: '',
    music: '',
    soundEffects: '',
    profilePicture: 1
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    setError(null);
    setIsLoading(true);
    
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        navigate('/login');
        return;
      }

      const db = getFirestore();
      const userDoc = await getDoc(doc(db, 'users', userId));
      
      if (!userDoc.exists()) {
        setError('User data not found');
        setIsLoading(false);
        return;
      }

      const userData = userDoc.data();
      const activeProfile = userData.profiles.find(profile => profile.active);
      
      if (!activeProfile) {
        setError('No active profile found');
        setIsLoading(false);
        return;
      }

      setNoPersonalData(!userData.infoProvided);
      
      setProfileData({
        ...activeProfile,
        nickname: activeProfile.nickname || '',
        bloodType: activeProfile.bloodType || '',
        favoriteColor: activeProfile.favoriteColor || '#a52a2a',
        gradeClass: activeProfile.gradeClass || '',
        schoolName: activeProfile.schoolName || '',
        schoolTeacher: activeProfile.schoolTeacher || '',
        schoolBusNumber: activeProfile.schoolBusNumber || '',
        music: activeProfile.music || '',
        soundEffects: activeProfile.soundEffects || '',
        profilePicture: activeProfile.profilePicture || 1
      });

      setIsLoading(false);
    } catch (error) {
      console.error('Error loading profile data:', error);
      setError('Failed to load settings: ' + error.message);
      setIsLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const userId = auth.currentUser?.uid;
      const db = getFirestore();
      const userRef = doc(db, 'users', userId);
      
      const userDoc = await getDoc(userRef);
      const userData = userDoc.data();
      const profiles = userData.profiles;
      const activeProfileIndex = profiles.findIndex(profile => profile.active);
      const currentProfile = profiles[activeProfileIndex];

      const updatedProfile = {
        ...currentProfile,
        nickname: profileData.nickname,
        bloodType: profileData.bloodType,
        favoriteColor: profileData.favoriteColor,
        gradeClass: profileData.gradeClass,
        schoolName: profileData.schoolName,
        schoolTeacher: profileData.schoolTeacher,
        schoolBusNumber: profileData.schoolBusNumber,
        music: profileData.music,
        soundEffects: profileData.soundEffects,
        profilePicture: profileData.profilePicture,
        active: true
      };

      profiles[activeProfileIndex] = updatedProfile;

      await updateDoc(userRef, {
        profiles: profiles
      });

      setIsEditing(false);
      setIsLoading(false);
    } catch (error) {
      console.error('Error saving settings:', error);
      setError('Failed to save settings: ' + error.message);
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleColorChange = (color) => {
    setProfileData(prev => ({
      ...prev,
      favoriteColor: color.hex
    }));
  };

  const handleAvatarSelect = (avatarNumber) => {
    setProfileData(prev => ({
      ...prev,
      profilePicture: avatarNumber
    }));
  };

  const handleAuthenticate = async (e) => {
    e.preventDefault();
    try {
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        authPassword
      );
      await reauthenticateWithCredential(auth.currentUser, credential);
      setIsAuthenticating(false);
      setIsEditing(true);
      setAuthPassword('');
      setAuthError(null);
    } catch (error) {
      setAuthError('Incorrect password');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  const handleEditClick = () => {
    if (!isEditing) {
      setIsAuthenticating(true);
    } else {
      setIsEditing(false);
    }
  };

  if (isLoading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  return (
    <div className="settings-page">
      <div className={`character-select-container ${isEditing ? 'editable' : ''}`}>
        <AvatarSelection 
          currentAvatar={profileData.profilePicture}
          onSelect={handleAvatarSelect}
          disabled={!isEditing}
        />
      </div>
      
      <div className="settings-container">
        <button onClick={() => navigate('/')} className="back-button">
          Back
        </button>
        
        {error && <div className="error-message">{error}</div>}
        
        <h1 className="settings-title">Profile Settings</h1>

        <div className="settings-section">
          <h2>Sound Settings</h2>
          <div className="toggle-container">
            <label className="toggle-label">
              Sound Effects
              <input
                type="checkbox"
                checked={profileData.soundEffects !== 'off'}
                onChange={(e) => handleInputChange({
                  target: {
                    name: 'soundEffects',
                    value: e.target.checked ? 'on' : 'off'
                  }
                })}
              />
            </label>
          </div>

          <div className="toggle-container">
            <label className="toggle-label">
              Music
              <input
                type="checkbox"
                checked={profileData.music !== 'off'}
                onChange={(e) => handleInputChange({
                  target: {
                    name: 'music',
                    value: e.target.checked ? 'on' : 'off'
                  }
                })}
              />
            </label>
          </div>
        </div>

        <div className="settings-section">
          <div className="personal-details-header">
            <h2>Profile Details</h2>
            <button
              onClick={handleEditClick}
              className={`edit-button ${isEditing ? 'save-button' : ''}`}
            >
              {isEditing ? 'Cancel' : 'Edit'}
            </button>
          </div>

          <div className="personal-details">
            {isAuthenticating ? (
              <div className={`auth-content ${isShaking ? 'shake' : ''}`}>
                <p className="auth-message">Please enter password to edit settings</p>
                {authError && <div className="error-message">{authError}</div>}
                <form onSubmit={handleAuthenticate} className="auth-form">
                  <div className="form-control">
                    <input
                      type="password"
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                    />
                  </div>
                  <div className="button-group">
                    <button type="submit" className="btn-secondary">
                      Continue
                    </button>
                    <button 
                      type="button" 
                      onClick={() => {
                        setIsAuthenticating(false);
                        setAuthPassword('');
                        setAuthError(null);
                      }}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            ) : isEditing ? (
              <form onSubmit={handleSave}>
                <div className="form-control">
                  <label>Nickname</label>
                  <input
                    type="text"
                    name="nickname"
                    value={profileData.nickname}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-control">
                  <label>Favorite Color</label>
                  <CirclePicker
                    color={profileData.favoriteColor}
                    onChangeComplete={handleColorChange}
                    colors={[
                      '#0000FF', // Blue
                      '#FF0000', // Red
                      '#FFFF00', // Yellow
                      '#008000', // Green
                      '#800080', // Purple
                      '#FFC0CB', // Pink
                    ]}
                  />
                </div>

                {!noPersonalData && (
                  <>
                    <div className="form-control">
                      <label>Blood Type</label>
                      <input
                        type="text"
                        name="bloodType"
                        value={profileData.bloodType}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="form-control">
                      <label>Grade/Class</label>
                      <input
                        type="text"
                        name="gradeClass"
                        value={profileData.gradeClass}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="form-control">
                      <label>School Name</label>
                      <input
                        type="text"
                        name="schoolName"
                        value={profileData.schoolName}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="form-control">
                      <label>School Teacher</label>
                      <input
                        type="text"
                        name="schoolTeacher"
                        value={profileData.schoolTeacher}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="form-control">
                      <label>School Bus Number</label>
                      <input
                        type="text"
                        name="schoolBusNumber"
                        value={profileData.schoolBusNumber}
                        onChange={handleInputChange}
                      />
                    </div>
                  </>
                )}

                <button type="submit" className="save-button">
                  Save Changes
                </button>
              </form>
            ) : (
              <div className="view-mode">
                <p><strong>Nickname:</strong> {profileData.nickname}</p>
                <div className="color-preview-container">
                  <strong>Favorite Color:</strong>
                  <div 
                    className="color-preview"
                    style={{ backgroundColor: profileData.favoriteColor }}
                  />
                </div>

                {!noPersonalData && (
                  <>
                    <p><strong>Blood Type:</strong> {profileData.bloodType}</p>
                    <p><strong>Grade/Class:</strong> {profileData.gradeClass}</p>
                    <p><strong>School Name:</strong> {profileData.schoolName}</p>
                    <p><strong>School Teacher:</strong> {profileData.schoolTeacher}</p>
                    <p><strong>School Bus Number:</strong> {profileData.schoolBusNumber}</p>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;