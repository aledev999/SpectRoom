import React, { useState } from 'react';
import { auth } from '../firebase/config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { setUser } from '../store/usersSlice';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import FullPageLoader from './FullPageLoader';
import './LoginForm.css';

function LoginForm() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [userCredentials, setUserCredentials] = useState({});
  const [error, setError] = useState('');

  function handleCredentials(e) {
    setUserCredentials({ ...userCredentials, [e.target.name]: e.target.value });
  }

  async function handleLogin(e) {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        userCredentials.email,
        userCredentials.password
      );

      const db = getFirestore();
      const userDocRef = doc(db, 'users', userCredential.user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
      }

      dispatch(setUser({ id: userCredential.user.uid, email: userCredential.user.email }));
    } catch (error) {
      console.error('Login error:', error);
      setError('Invalid email or password.');
    } finally {
      setIsLoading(false);
    }
  }

  function handlePasswordReset() {
    const email = prompt('Please enter your email');
    if (email) {
      sendPasswordResetEmail(auth, email)
        .then(() => {
          alert('Password reset email sent');
        })
        .catch((error) => {
          console.error('Password reset error:', error);
          alert('Error sending password reset email');
        });
    }
  }

  return (
    <>
      {isLoading && <FullPageLoader />}
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Login</h2>
        {error && <div className="error">{error}</div>}
        <div className="form-control">
          <label>Email</label>
          <input
            onChange={handleCredentials}
            type="email"
            name="email"
            placeholder="Enter your email"
            required
            autoFocus
          />
        </div>
        <div className="form-control">
          <label>Password</label>
          <input
            onChange={handleCredentials}
            type="password"
            name="password"
            placeholder="Enter your password"
            required
          />
        </div>
        <button type="submit" className="btn btn-block">
          Login
        </button>
        <p onClick={handlePasswordReset} className="forgot-password">
          Forgot Password?
        </p>
      </form>
    </>
  );
}

export default LoginForm;
