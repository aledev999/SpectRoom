import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getFirestore, doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { selectUsers } from '../store/usersSlice';
import { setActiveProfile, setProfiles } from '../store/profilesSlice';
import { useNavigate, Link } from 'react-router-dom';
import SignupFormProfile from '../components/SignupFormProfile';
import ProfileCard from '../components/ProfileCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCog } from '@fortawesome/free-solid-svg-icons';
import './ProfileSelection.css';


function ProfileSelection() {
  const [localProfiles, setLocalProfiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSignupFormOpen, setIsSignupFormOpen] = useState(false);
  const user = useSelector(selectUsers);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProfiles = async () => {
      if (user.currentUser) {
        const db = getFirestore();
        const userRef = doc(db, 'users', user.currentUser.id);
        try {
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const profiles = userSnap.data().profiles || [];
            setLocalProfiles(profiles);
            dispatch(setProfiles(profiles));
          }
        } catch (error) {
          console.error("Error fetching profiles:", error);
          alert("Failed to load profiles. Please try again.");
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchProfiles();
  }, [user.currentUser, dispatch]);

  const handleAddProfile = () => {
    if (localProfiles.length < 4) {
      setIsSignupFormOpen(true);
    } else {
      alert('Maximum number of profiles reached');
    }
  };

  const handleAccountSettings = () => {
    navigate('/accountsettings');
  };

  const handleNewProfileSubmit = async (profileInfo) => {
    setIsLoading(true);
    const db = getFirestore();
    const userRef = doc(db, 'users', user.currentUser.id);

    const newProfile = {
      id: localProfiles.length + 1,
      active: false,
      ...profileInfo,

      additionalInfo: [],
      allergiesMedicalConditions: null,
      bloodType: null,
      cardBackPreference: null,
      doctorName: null,
      gradeClass: null,
      schoolBusNumber: null,
      schoolName: null,
      schoolTeacher: null,
      soundEffects: '',
      music: '',
      averageSessionDuration: 0,
      streakTracking: 0,
      lastLogin: new Date(),

      games: {
        CardMatching: {
          easy: { level: 1, score: 0 },
          hard: { level: 1, score: 0 }
        },
        MissingLetters: {
          easy: { level: 1, score: 0 },
          hard: { level: 1, score: 0 }
        },
        RevealThePath: {
          easy: { level: 1, score: 0 },
          hard: { level: 1, score: 0 }
        },
        SimonSays: {
          easy: { level: 1, score: 0 },
          hard: { level: 1, score: 0 }
        }
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

      totalPlaytime: {
        CardMatching: 0,
        MissingLetters: 0,
        RevealThePath: 0,
        SimonSays: 0
      }
    };

    try {
      await updateDoc(userRef, {
        profiles: arrayUnion(newProfile)
      });
      const updatedProfiles = [...localProfiles, newProfile];
      setLocalProfiles(updatedProfiles);
      dispatch(setProfiles(updatedProfiles));
      setIsSignupFormOpen(false);
    } catch (error) {
      console.error("Error adding new profile:", error);
      alert("Failed to add new profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectProfile = async (profileId) => {
    setIsLoading(true);
    const db = getFirestore();
    const userRef = doc(db, 'users', user.currentUser.id);

    try {
      const updatedProfiles = localProfiles.map(profile => ({
        ...profile,
        active: profile.id === profileId,
        lastLogin: profile.id === profileId ? new Date() : profile.lastLogin
      }));
      
      await updateDoc(userRef, { profiles: updatedProfiles });
      
      setLocalProfiles(updatedProfiles);
      dispatch(setProfiles(updatedProfiles));
      
      const activeProfile = updatedProfiles.find(profile => profile.id === profileId);
      dispatch(setActiveProfile(activeProfile));
      
      navigate('/');
    } catch (error) {
      console.error("Error selecting profile:", error);
      alert("Failed to select profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="loading-container">Loading...</div>;
  }

  return (
    <div className="profile-selection">
      <div className="header-actions">
        <Link to="/accountsettings" className="account-settings-link">
          <FontAwesomeIcon icon={faUserCog} />
          <span className="settings-text">Account Settings</span>
        </Link>
      </div>
      <div className="profiles-container">
        <div className="profiles-grid">
        {Array(4).fill(null).map((_, index) => {
              const profile = localProfiles[index];
              if (profile) {
                return (
                  <ProfileCard
                    key={profile.id}
                    profile={profile}
                    onClick={() => handleSelectProfile(profile.id)}
                  />
                );
              } else if (index === localProfiles.length && localProfiles.length < 4) {
                return (
                  <div key="add-profile" className="add-profile-card" onClick={handleAddProfile}>
                    <span>+</span>
                    <p>Add Profile</p>
                  </div>
                );
              } else {
                return <div key={`empty-${index}`} className="empty-profile-slot" />;
              }
            })}
        </div>
      </div>

      {isSignupFormOpen && (
        <div className="profile-form-overlay">
          <div className="profile-form-container">
            <button className="close-btn" onClick={() => setIsSignupFormOpen(false)}>
              ×
            </button>
            <SignupFormProfile
              onSubmit={handleNewProfileSubmit}
              onCancel={() => setIsSignupFormOpen(false)}
              userId={user.currentUser?.id}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfileSelection;