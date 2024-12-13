import React from 'react'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase/config'
import { useDispatch } from 'react-redux'
import { setUser } from '../store/usersSlice'
import { setActiveProfile, setProfiles } from '../store/profilesSlice'
import { persistor } from '../store/store'
import { useNavigate } from 'react-router-dom'

function Header() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  function handleSignOut() {
    if (window.confirm('Are you sure you want to sign out?')) {
      signOut(auth)
        .then(() => {
          dispatch(setUser(null))
          dispatch(setActiveProfile(null))
          dispatch(setProfiles([]))
          persistor.purge()
          console.log('Signed Out')
          navigate('/login')
        })
        .catch((error) => {
          console.error('Sign out error:', error)
        })
    }
  }
  

  function handleChangeProfile() {
    dispatch(setActiveProfile(null))
    dispatch(setProfiles([]))
    navigate('/profileselection')
  }

  return (
    <div className="header">
      <button onClick={handleChangeProfile} className="btn primary">
        Change Profile
      </button>
      <button onClick={handleSignOut} className="btn secondary">
        Logout
      </button>
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

        .header {
          position: absolute;
          top: 5px;
          right: 50px; /* adjust this */
          display: flex;
          gap: 10px;
        }

        .btn {
          font-family: 'Press Start 2P', cursive;
          font-size: 12px;
          padding: 10px 15px;
          border: 2px solid #f7d794;
          cursor: pointer;
          position: relative;
          transition: all 0.3s ease;
          text-transform: uppercase;
          overflow: hidden;
        }

        .btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: repeating-linear-gradient(
            to bottom,
            transparent 0%,
            rgba(255, 255, 255, 0.1) 1%,
            transparent 2%
          );
          pointer-events: none;
        }

        .btn.primary {
          background-color: #5BA58C;
          color: #F7D794;
          box-shadow: 
            inset 0 0 10px rgba(47, 42, 63, 0.5),
            0 4px 0 #3D7A68;
        }

        .btn.secondary {
          background-color: #A66E5A;
          color: #F7D794;
          box-shadow: 
            inset 0 0 10px rgba(247, 215, 148, 0.5),
            0 4px 0 #7A4E3D;
        }

        .btn:hover {
          transform: translateY(2px);
        }

        .btn:active {
          transform: translateY(4px);
          box-shadow: none;
        }

        @media (max-width: 768px) {
          .header {
            position: static;
            justify-content: center;
            padding: 10px;
          }

          .btn {
            font-size: 10px;
            padding: 8px 12px;
          }
        }
      `}</style>
    </div>
  )
}

export default Header;