import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFirestore, doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { auth } from '../firebase/config';
import { 
  updatePassword, 
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider 
} from 'firebase/auth';
import './AccountSettings.css';

function AccountSettings() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('account');
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false); 
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [noPersonalData, setNoPersonalData] = useState(false);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState(null);
  const [isShaking, setIsShaking] = useState(false);
  
  const [email, setEmail] = useState('');
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  
  const [accountData, setAccountData] = useState({
    parentName: '',
    streetAddress: '',
    city: '',
    state: '',
    zipCode: '',
    phoneNumber: '',
    emergencyContact: '',
    secondaryEmergencyContacts: [],
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

      setEmail(auth.currentUser.email);

      const db = getFirestore();
      const userDoc = await getDoc(doc(db, 'users', userId));
      
      if (!userDoc.exists()) {
        setError('User data not found');
        setIsLoading(false);
        return;
      }

      const userData = userDoc.data();
      setNoPersonalData(!userData.infoProvided);
      
      setAccountData({
        parentName: userData.parentName || '',
        streetAddress: userData.streetAddress || '',
        city: userData.city || '',
        state: userData.state || '',
        zipCode: userData.zipCode || '',
        phoneNumber: userData.phoneNumber || '',
        emergencyContact: userData.emergencyContact || '',
        secondaryEmergencyContacts: userData.secondaryEmergencyContacts || [],
      });

      setIsLoading(false);
    } catch (error) {
      console.error('Error loading user data:', error);
      setError('Failed to load settings: ' + error.message);
      setIsLoading(false);
    }
  };

  const handleReauthenticate = async (password) => {
    const credential = EmailAuthProvider.credential(
      auth.currentUser.email,
      password
    );
    await reauthenticateWithCredential(auth.currentUser, credential);
  };

  const handleAuthenticate = async (e) => {
    e.preventDefault();
    try {
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        authPassword
      );
      await reauthenticateWithCredential(auth.currentUser, credential);
      setIsAuthenticated(true);
      setAuthError(null);
    } catch (error) {
      setAuthError('Incorrect password');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      setError('New passwords do not match');
      return;
    }

    try {
      setError(null);
      setSuccess(null);
      
      await handleReauthenticate(currentPassword);
      
      await updatePassword(auth.currentUser, newPassword);
      
      setSuccess('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setIsChangingPassword(false);
    } catch (error) {
      console.error('Error updating password:', error);
      setError('Failed to update password: ' + error.message);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        setError(null);
        setSuccess(null);
        
        const password = prompt('Please enter your current password to confirm account deletion:');
        if (!password) {
          setError('Account deletion canceled.');
          return;
        }

        await handleReauthenticate(password);
        
        const userId = auth.currentUser.uid;
        const db = getFirestore();
        
        await deleteDoc(doc(db, 'users', userId));
        
        await deleteUser(auth.currentUser);
        
        navigate('/');
      } catch (error) {
        console.error('Error deleting account:', error);
        setError('Failed to delete account: ' + error.message);
      }
    }
  };

  const handleSavePersonalInfo = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const userId = auth.currentUser?.uid;
      const db = getFirestore();
      const userRef = doc(db, 'users', userId);
      
      const updateData = noPersonalData ? {
        infoProvided: false,
        parentName: null,
        streetAddress: null,
        city: null,
        state: null,
        zipCode: null,
        phoneNumber: null,
        emergencyContact: null,
        secondaryEmergencyContacts: [],
      } : {
        infoProvided: true,
        parentName: accountData.parentName,
        streetAddress: accountData.streetAddress,
        city: accountData.city,
        state: accountData.state,
        zipCode: accountData.zipCode,
        phoneNumber: accountData.phoneNumber,
        emergencyContact: accountData.emergencyContact,
        secondaryEmergencyContacts: accountData.secondaryEmergencyContacts,
      };

      await updateDoc(userRef, updateData);
      setSuccess('Personal information updated successfully');
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
    setAccountData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSecondaryContactChange = (index, value) => {
    const newContacts = [...accountData.secondaryEmergencyContacts];
    newContacts[index] = value;
    setAccountData(prev => ({
      ...prev,
      secondaryEmergencyContacts: newContacts
    }));
  };

  const handleAddSecondaryContact = () => {
    if (accountData.secondaryEmergencyContacts.length < 5) {
      setAccountData(prev => ({
        ...prev,
        secondaryEmergencyContacts: [...prev.secondaryEmergencyContacts, '']
      }));
    }
  };

  const handleRemoveSecondaryContact = (index) => {
    setAccountData(prev => ({
      ...prev,
      secondaryEmergencyContacts: prev.secondaryEmergencyContacts.filter((_, i) => i !== index)
    }));
  };

  if (isLoading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="account-settings">
        <div className="account-settings-container">
          <button onClick={() => navigate('/profileselection')} className="back-button">
            Back
          </button>
          
          <h1 className="settings-title">Settings</h1>

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
              <button type="submit" className="btn-secondary">
                Continue
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="account-settings">
      <div className="account-settings-container">
        <button onClick={() => navigate('/profileselection')} className="back-button">
          Back
        </button>
        
        <h1 className="settings-title">Settings</h1>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <div className="tabs-container">
          <div className="tabs">
            <button 
              className={`tab ${activeTab === 'account' ? 'active' : ''}`}
              onClick={() => setActiveTab('account')}
            >
              Account Management
            </button>
            <button 
              className={`tab ${activeTab === 'personal' ? 'active' : ''}`}
              onClick={() => setActiveTab('personal')}
            >
              Personal Information
            </button>
          </div>
        </div>

        {activeTab === 'account' && (
          <div className="settings-section">
            <h2>Account Management</h2>
            
            {!isChangingPassword ? (
              <div className="account-section">
                <h3>Email</h3>
                <div className="email-display">
                  <input type="email" value={email} disabled />
                </div>
              
                <div className="account-actions">
                  <button 
                    onClick={() => setIsChangingPassword(true)} 
                    className="btn-change-password"
                  >
                    Change Password
                  </button>
                  <button 
                    onClick={handleDeleteAccount} 
                    className="btn-delete-account"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            ) : (
              <div className="change-password-form">
                <h3>Change Password</h3>
                <form onSubmit={handlePasswordChange}>
                  <div className="form-control">
                    <label>Current Password</label>
                    <input 
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                      required
                    />
                  </div>
                  <div className="form-control">
                    <label>New Password</label>
                    <input 
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      required
                    />
                  </div>
                  <div className="form-control">
                    <label>Confirm New Password</label>
                    <input 
                      type="password"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      placeholder="Confirm new password"
                      required
                    />
                  </div>
                  <div className="button-group">
                    <button type="submit" className="btn-secondary confirm-button">
                      Confirm
                    </button>
                    <button 
                      type="button" 
                      onClick={() => {
                        setIsChangingPassword(false);
                        setError(null);
                        setSuccess(null);
                        setCurrentPassword('');
                        setNewPassword('');
                        setConfirmNewPassword('');
                      }} 
                      className="btn-secondary cancel-button"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {activeTab === 'personal' && (
          <div className="settings-section">
            <div className="personal-details-header">
              <h2>Personal Information</h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`btn-secondary ${isEditing ? 'save-button' : 'edit-button'}`}
              >
                {isEditing ? 'Cancel' : 'Edit'}
              </button>
            </div>

            <div className="personal-details">
              {isEditing ? (
                <form onSubmit={handleSavePersonalInfo}>
                  <div className="form-control checkbox-control">
                    <label>
                      <input
                        type="checkbox"
                        checked={noPersonalData}
                        onChange={(e) => setNoPersonalData(e.target.checked)}
                      />{' '}
                      I prefer not to provide additional personal data.
                    </label>
                  </div>

                  {!noPersonalData && (
                    <>
                      <div className="form-control">
                        <label>Parent's Name</label>
                        <input
                          type="text"
                          name="parentName"
                          value={accountData.parentName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div className="form-control">
                        <label>Street Address</label>
                        <input
                          type="text"
                          name="streetAddress"
                          value={accountData.streetAddress}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div className="form-row">
                        <div className="form-control">
                          <label>City</label>
                          <input
                            type="text"
                            name="city"
                            value={accountData.city}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="form-control">
                          <label>State</label>
                          <input
                            type="text"
                            name="state"
                            value={accountData.state}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="form-control">
                          <label>Zip Code</label>
                          <input
                            type="text"
                            name="zipCode"
                            value={accountData.zipCode}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="form-control">
                        <label>Phone Number</label>
                        <input
                          type="tel"
                          name="phoneNumber"
                          value={accountData.phoneNumber}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div className="form-control">
                        <label>Emergency Contact</label>
                        <input
                          type="text"
                          name="emergencyContact"
                          value={accountData.emergencyContact}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div className="additional-info-section">
                        <label>Secondary Emergency Contacts:</label>
                        {accountData.secondaryEmergencyContacts.map((contact, index) => (
                          <div key={index} className="additional-info">
                            <input
                              type="text"
                              value={contact}
                              onChange={(e) => handleSecondaryContactChange(index, e.target.value)}
                              placeholder={`Secondary Emergency Contact ${index + 1}`}
                              required
                            />
                            <button 
                              type="button" 
                              onClick={() => handleRemoveSecondaryContact(index)}
                              className="btn-secondary remove-contact-button"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                        {accountData.secondaryEmergencyContacts.length < 5 && (
                          <button type="button" onClick={handleAddSecondaryContact} className="btn-secondary add-contact-button">
                            Add More
                          </button>
                        )}
                      </div>
                    </>
                  )}

                  <button type="submit" className="btn-secondary save-button">
                    Save Changes
                  </button>
                </form>
              ) : (
                <div className="view-mode">
                  <p><strong>Personal Data Preference:</strong> {noPersonalData ? 'Not provided' : 'Provided'}</p>
                  
                  {!noPersonalData && (
                    <>
                      <p><strong>Parent's Name:</strong> {accountData.parentName}</p>
                      <p><strong>Address:</strong> {accountData.streetAddress}</p>
                      <p><strong>City:</strong> {accountData.city}</p>
                      <p><strong>State:</strong> {accountData.state}</p>
                      <p><strong>Zip Code:</strong> {accountData.zipCode}</p>
                      <p><strong>Phone Number:</strong> {accountData.phoneNumber}</p>
                      <p><strong>Emergency Contact:</strong> {accountData.emergencyContact}</p>
                      {accountData.secondaryEmergencyContacts.length > 0 && (
                        <div className="secondary-contacts">
                          <strong>Secondary Emergency Contacts:</strong>
                          <ul>
                            {accountData.secondaryEmergencyContacts.map((contact, index) => (
                              <li key={index}>{contact}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AccountSettings;
