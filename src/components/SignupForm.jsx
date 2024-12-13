import React, { useState } from 'react';
import { auth } from '../firebase/config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { setUser } from '../store/usersSlice';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { CirclePicker } from 'react-color';
import FullPageLoader from './FullPageLoader';
import './SignupForm.css';

function SignupForm() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [accountInfo, setAccountInfo] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    parentName: '',
    streetAddress: '',
    city: '',
    state: '',
    zipCode: '',
    phoneNumber: '',
    emergencyContact: '',
    secondaryEmergencyContacts: [],
  });

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
  });

  const [noPersonalData, setNoPersonalData] = useState(false);
  const [error, setError] = useState('');

  function handleAccountInfo(e) {
    setAccountInfo({ ...accountInfo, [e.target.name]: e.target.value });
  }

  function handleProfileInfo(e) {
    setProfileInfo({ ...profileInfo, [e.target.name]: e.target.value });
  }

  function handleNoPersonalDataChange(e) {
    const checked = e.target.checked;
    setNoPersonalData(checked);

    if (checked) {
      // Set additional fields to null
      setAccountInfo({
        ...accountInfo,
        parentName: null,
        streetAddress: null,
        city: null,
        state: null,
        zipCode: null,
        phoneNumber: null,
        emergencyContact: null,
        secondaryEmergencyContacts: [],
      });
      setProfileInfo({
        ...profileInfo,
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
        favoriteColor: '#0000FF',
      });
    } else {
      // Reset fields to empty strings
      setAccountInfo({
        ...accountInfo,
        parentName: '',
        streetAddress: '',
        city: '',
        state: '',
        zipCode: '',
        phoneNumber: '',
        emergencyContact: '',
        secondaryEmergencyContacts: [],
      });
      setProfileInfo({
        ...profileInfo,
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
      });
    }
  }

  function handleAdditionalInfoChange(index, e) {
    const newAdditionalInfo = [...profileInfo.additionalInfo];
    newAdditionalInfo[index] = e.target.value;
    setProfileInfo({ ...profileInfo, additionalInfo: newAdditionalInfo });
  }

  function handleAddField() {
    if (profileInfo.additionalInfo.length < 5) {
      setProfileInfo({
        ...profileInfo,
        additionalInfo: [...profileInfo.additionalInfo, ''],
      });
    }
  }

  function handleRemoveField(index) {
    const newAdditionalInfo = [...profileInfo.additionalInfo];
    newAdditionalInfo.splice(index, 1);
    setProfileInfo({ ...profileInfo, additionalInfo: newAdditionalInfo });
  }

  function handleSecondaryEmergencyContactChange(index, e) {
    const newContacts = [...accountInfo.secondaryEmergencyContacts];
    newContacts[index] = e.target.value;
    setAccountInfo({ ...accountInfo, secondaryEmergencyContacts: newContacts });
  }

  function handleAddSecondaryEmergencyContact() {
    if (accountInfo.secondaryEmergencyContacts.length < 5) {
      setAccountInfo({
        ...accountInfo,
        secondaryEmergencyContacts: [...accountInfo.secondaryEmergencyContacts, ''],
      });
    }
  }

  function handleRemoveSecondaryEmergencyContact(index) {
    const newContacts = [...accountInfo.secondaryEmergencyContacts];
    newContacts.splice(index, 1);
    setAccountInfo({ ...accountInfo, secondaryEmergencyContacts: newContacts });
  }

  // Handler for Favorite Color
  function handleColorChange(color) {
    setProfileInfo({ ...profileInfo, favoriteColor: color.hex });
  }

  async function setupUserInFirestore(userId, email) {
    const db = getFirestore();
    const userRef = doc(db, 'users', userId);

    const initialUserData = {
      email: email,
      infoProvided: !noPersonalData,
      parentName: accountInfo.parentName || null,
      streetAddress: accountInfo.streetAddress || null,
      city: accountInfo.city || null,
      state: accountInfo.state || null,
      zipCode: accountInfo.zipCode || null,
      phoneNumber: accountInfo.phoneNumber || null,
      emergencyContact: accountInfo.emergencyContact || null,
      secondaryEmergencyContacts: accountInfo.secondaryEmergencyContacts || [],
      profiles: [
        {
          id: 1,
          active: true,
          nickname: profileInfo.nickname || 'New Player',
          profilePicture: 1,
          
          favoriteColor: profileInfo.favoriteColor || '#0000FF',
          allergiesMedicalConditions: profileInfo.allergiesMedicalConditions || null,
          bloodType: profileInfo.bloodType || null,
          doctorName: profileInfo.doctorName || null,
          additionalInfo: profileInfo.additionalInfo || [],
          birthday: profileInfo.birthday || null,
          gradeClass: profileInfo.gradeClass || null,
          schoolName: profileInfo.schoolName || null,
          schoolTeacher: profileInfo.schoolTeacher || null,
          schoolBusNumber: profileInfo.schoolBusNumber || null,
          cardBackPreference: profileInfo.cardBackPreference || null,
          soundEffects: profileInfo.soundEffects || '',
          music: profileInfo.music || '',
          games: {
            CardMatching: {
              easy: { level: 1, score: 0 },
              hard: { level: 1, score: 0 },
            },
            MissingLetters: {
              easy: { level: 1, score: 0 },
              hard: { level: 1, score: 0 },
            },
            RevealThePath: {
              easy: { level: 1, score: 0 },
              hard: { level: 1, score: 0 },
            },
            SimonSays: {
              easy: { level: 1, score: 0 },
              hard: { level: 1, score: 0 },
            },
          },
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
          },
          lastLogin: new Date(),
          totalPlaytime: {
            CardMatching: 0,
            MissingLetters: 0,
            RevealThePath: 0,
            SimonSays: 0,
          },
          streakTracking: 0,
          averageSessionDuration: 0,
        },
      ],
    };

    try {
      await setDoc(userRef, initialUserData);
      console.log('User document created successfully');
    } catch (error) {
      console.error('Error creating user document:', error);
      throw error;
    }
  }

  async function handleSignup(e) {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (accountInfo.password !== accountInfo.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (!profileInfo.nickname.trim()) {
      setError('Nickname is required');
      setIsLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        accountInfo.email,
        accountInfo.password
      );

      await setupUserInFirestore(userCredential.user.uid, userCredential.user.email);

      dispatch(setUser({ id: userCredential.user.uid, email: userCredential.user.email }));
    } catch (error) {
      console.error('Signup error:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      {isLoading && <FullPageLoader />}
      <form className="signup-form" onSubmit={handleSignup}>
        <h2>Sign Up</h2>
        {error && <div className="error">{error}</div>}

        {/* Account Information */}
        <h3>Account Information</h3>

        {/* Email */}
        <div className="form-row">
          <div className="form-control">
            <label>Email</label>
            <input
              onChange={handleAccountInfo}
              type="email"
              name="email"
              placeholder="Enter your email"
              required
              autoFocus
            />
          </div>

          {/* Password */}
          <div className="form-control">
            <label>Password</label>
            <input
              onChange={handleAccountInfo}
              type="password"
              name="password"
              placeholder="Enter your password"
              required
            />
          </div>
        </div>

        {/* Confirm Password */}
        <div className="form-control">
          <label>Confirm Password</label>
          <input
            onChange={handleAccountInfo}
            type="password"
            name="confirmPassword"
            placeholder="Confirm your password"
            required
          />
        </div>

        {/* No Personal Data Checkbox */}
        <div className="form-control checkbox-control">
          <label>
            <input
              type="checkbox"
              checked={noPersonalData}
              onChange={handleNoPersonalDataChange}
            />{' '}
            I prefer not to provide additional personal data.
          </label>
        </div>

        {!noPersonalData && (
          <>
            {/* Parent's Name */}
            <div className="form-control">
              <label>Parent's Name</label>
              <input
                onChange={handleAccountInfo}
                type="text"
                name="parentName"
                placeholder="Enter parent's name"
              />
            </div>

            {/* Address Fields */}
            <div className="form-control">
              <label>Street Address</label>
              <input
                onChange={handleAccountInfo}
                type="text"
                name="streetAddress"
                placeholder="Enter street address"
              />
            </div>

            <div className="form-row">
              <div className="form-control">
                <label>City</label>
                <input
                  onChange={handleAccountInfo}
                  type="text"
                  name="city"
                  placeholder="City"
                />
              </div>
              <div className="form-control">
                <label>State</label>
                <input
                  onChange={handleAccountInfo}
                  type="text"
                  name="state"
                  placeholder="State"
                />
              </div>
              <div className="form-control">
                <label>Zip Code</label>
                <input
                  onChange={handleAccountInfo}
                  type="text"
                  name="zipCode"
                  placeholder="Zip Code"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="form-control">
              <label>Phone Number</label>
              <input
                onChange={handleAccountInfo}
                type="text"
                name="phoneNumber"
                placeholder="Enter your phone number"
              />
            </div>

            {/* Emergency Contact */}
            <div className="form-control">
              <label>Emergency Contact</label>
              <input
                onChange={handleAccountInfo}
                type="text"
                name="emergencyContact"
                placeholder="Enter emergency contact"
              />
            </div>

            {/* Secondary Emergency Contacts */}
            <div className="additional-info-section">
              <label>Secondary Emergency Contacts (Optional):</label>
              {accountInfo.secondaryEmergencyContacts.map((contact, index) => (
                <div key={index} className="additional-info">
                  <input
                    type="text"
                    placeholder={`Secondary Emergency Contact ${index + 1}`}
                    value={contact}
                    onChange={(e) => handleSecondaryEmergencyContactChange(index, e)}
                  />
                  <button type="button" onClick={() => handleRemoveSecondaryEmergencyContact(index)}>
                    Remove
                  </button>
                </div>
              ))}
              {accountInfo.secondaryEmergencyContacts.length < 5 && (
                <button type="button" onClick={handleAddSecondaryEmergencyContact}>
                  Add More
                </button>
              )}
            </div>
          </>
        )}

        {/* Profile Information */}
        <div className="profile-section">
          <h4>Profile Information</h4>

          {/* Nickname */}
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

          {/* Favorite Color */}
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

          {!noPersonalData && (
            <>
              {/* Allergies and Medical Conditions */}
              <div className="form-control">
                <label>Allergies and Medical Conditions</label>
                <input
                  onChange={handleProfileInfo}
                  type="text"
                  name="allergiesMedicalConditions"
                  placeholder="Enter allergies and medical conditions"
                />
              </div>

              {/* Blood Type */}
              <div className="form-control">
                <label>Blood Type</label>
                <input
                  onChange={handleProfileInfo}
                  type="text"
                  name="bloodType"
                  placeholder="Enter blood type"
                />
              </div>

              {/* Doctor's Name */}
              <div className="form-control">
                <label>Doctor's Name</label>
                <input
                  onChange={handleProfileInfo}
                  type="text"
                  name="doctorName"
                  placeholder="Enter doctor's name"
                />
              </div>

              {/* Additional Information */}
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

              {/* Birthday and Grade/Class */}
              <div className="form-row">
                <div className="form-control">
                  <label>Birthday</label>
                  <input
                    onChange={handleProfileInfo}
                    type="date"
                    name="birthday"
                    placeholder="Enter birthday"
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

              {/* School Name */}
              <div className="form-control">
                <label>School Name</label>
                <input
                  onChange={handleProfileInfo}
                  type="text"
                  name="schoolName"
                  placeholder="Enter school name"
                />
              </div>

              {/* School Teacher and Bus Number */}
              <div className="form-row">
                <div className="form-control">
                  <label>School Teacher</label>
                  <input
                    onChange={handleProfileInfo}
                    type="text"
                    name="schoolTeacher"
                    placeholder="Enter school teacher"
                  />
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
              </div>
            </>
          )}
        </div>

        {/* Submit Button */}
        <button type="submit" className="btn btn-block">
          Sign Up
        </button>
      </form>
    </>
  );
}

export default SignupForm;
