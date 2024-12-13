import React, { useState, useEffect } from 'react';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { CirclePicker } from 'react-color';
import './SignupFormProfile.css';

function SignupFormProfile({ onSubmit, onCancel, userId }) {
  const [infoProvided, setInfoProvided] = useState(true);
  const [profileInfo, setProfileInfo] = useState({
    nickname: '',
    profilePicture: 1,
    allergiesMedicalConditions: '',
    bloodType: '',
    doctorName: '',
    additionalInfo: [],
    birthday: '',
    gradeClass: '',
    schoolName: '',
    schoolTeacher: '',
    schoolBusNumber: '',
    cardBackPreference: '',
    soundEffects: '',
    music: '',
    favoriteColor: '#0000FF',
    badges: {
      EasyCardMatching: 0,
      EasyMissingLetters: 0,
      EasyRevealThePath: 0,
      EasySimonSays: 0,
      HardCardMatching: 0,
      HardMissingLetters: 0,
      HardRevealThePath: 0,
      HardSimonSays: 0,
      StreakBadge: 0,
    }
  });

  useEffect(() => {
    const fetchUserPreference = async () => {
      if (userId) {
        const db = getFirestore();
        const userRef = doc(db, 'users', userId);
        try {
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            setInfoProvided(userSnap.data().infoProvided);
          }
        } catch (error) {
          console.error('Error fetching user preference:', error);
        }
      }
    };

    fetchUserPreference();
  }, [userId]);

  const handleProfileInfo = (e) => {
    setProfileInfo({ ...profileInfo, [e.target.name]: e.target.value });
  };

  const handleColorChange = (color) => {
    setProfileInfo({ ...profileInfo, favoriteColor: color.hex });
  };

  const handleAdditionalInfoChange = (index, e) => {
    const newAdditionalInfo = [...profileInfo.additionalInfo];
    newAdditionalInfo[index] = e.target.value;
    setProfileInfo({ ...profileInfo, additionalInfo: newAdditionalInfo });
  };

  const handleAddField = () => {
    if (profileInfo.additionalInfo.length < 5) {
      setProfileInfo({
        ...profileInfo,
        additionalInfo: [...profileInfo.additionalInfo, ''],
      });
    }
  };

  const handleRemoveField = (index) => {
    const newAdditionalInfo = [...profileInfo.additionalInfo];
    newAdditionalInfo.splice(index, 1);
    setProfileInfo({ ...profileInfo, additionalInfo: newAdditionalInfo });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // no info provided
    if (!infoProvided) {
      const basicProfile = {
        nickname: profileInfo.nickname,
        favoriteColor: profileInfo.favoriteColor,
        profilePicture: 1,
        allergiesMedicalConditions: null,
        bloodType: null,
        doctorName: null,
        additionalInfo: [],
        birthday: null,
        gradeClass: null,
        schoolName: null,
        schoolTeacher: null,
        schoolBusNumber: null,
        cardBackPreference: null,
        soundEffects: '',
        music: '',
        badges: {
          EasyCardMatching: 0,
          EasyMissingLetters: 0,
          EasyRevealThePath: 0,
          EasySimonSays: 0,
          HardCardMatching: 0,
          HardMissingLetters: 0,
          HardRevealThePath: 0,
          HardSimonSays: 0,
          StreakBadge: 0,
        }
      };
      onSubmit(basicProfile);
    } else {
      onSubmit(profileInfo);
    }
  };

  return (
    <form className="profile-form" onSubmit={handleSubmit}>
      <h4>Create New Profile</h4>
      <div className="form-control">
        <label>Nickname</label>
        <input
          onChange={handleProfileInfo}
          type="text"
          name="nickname"
          placeholder="Enter your nickname"
          required
        />
      </div>

      <div className="form-control">
        <label>Favorite Color</label>
        <CirclePicker
          color={profileInfo.favoriteColor}
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

      {/* Below is dependent on info checkbox */}
      {infoProvided && (
        <>
          <div className="form-control">
            <label>Profile Picture (Number)</label>
            <input
              onChange={handleProfileInfo}
              type="number"
              name="profilePicture"
              placeholder="Enter profile picture number"
              min="1"
              max="10"
            />
          </div>

          <div className="form-control">
            <label>Allergies and Medical Conditions</label>
            <input
              onChange={handleProfileInfo}
              type="text"
              name="allergiesMedicalConditions"
              placeholder="Enter allergies and medical conditions"
            />
          </div>

          <div className="form-control">
            <label>Blood Type</label>
            <input
              onChange={handleProfileInfo}
              type="text"
              name="bloodType"
              placeholder="Enter blood type"
            />
          </div>

          <div className="form-control">
            <label>Doctor's Name</label>
            <input
              onChange={handleProfileInfo}
              type="text"
              name="doctorName"
              placeholder="Enter doctor's name"
            />
          </div>

          <div className="additional-info-section">
            <label>Additional Information (Optional):</label>
            {profileInfo.additionalInfo.map((info, index) => (
              <div key={index} className="additional-info">
                <input
                  type="text"
                  placeholder={`Additional Info ${index + 1}`}
                  value={info}
                  onChange={(e) => handleAdditionalInfoChange(index, e)}
                />
                <button type="button" onClick={() => handleRemoveField(index)}>
                  Remove
                </button>
              </div>
            ))}
            {profileInfo.additionalInfo.length < 5 && (
              <button type="button" onClick={handleAddField}>
                Add More
              </button>
            )}
          </div>

          <div className="form-row">
            <div className="form-control">
              <label>Birthday</label>
              <input
                onChange={handleProfileInfo}
                type="date"
                name="birthday"
              />
            </div>
            <div className="form-control">
              <label>Grade/Class</label>
              <input
                onChange={handleProfileInfo}
                type="text"
                name="gradeClass"
                placeholder="Enter grade or class"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-control">
              <label>School Name</label>
              <input
                onChange={handleProfileInfo}
                type="text"
                name="schoolName"
                placeholder="Enter school name"
              />
            </div>
            <div className="form-control">
              <label>School Teacher</label>
              <input
                onChange={handleProfileInfo}
                type="text"
                name="schoolTeacher"
                placeholder="Enter school teacher's name"
              />
            </div>
          </div>

          <div className="form-control">
            <label>School Bus Number</label>
            <input
              onChange={handleProfileInfo}
              type="text"
              name="schoolBusNumber"
              placeholder="Enter school bus number"
            />
          </div>
        </>
      )}

      <div className="button-group">
        <button type="submit" className="btn">Save Profile</button>
        <button type="button" className="btn cancel-btn" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

export default SignupFormProfile;