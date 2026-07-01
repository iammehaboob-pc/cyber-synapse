import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { userService } from './services/api';
import { useAudio } from './hooks/useAudio';
import Navbar from './components/Navbar';
import Loader from './components/Loader';

// Pages
import Game from './pages/Game';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isMuted, toggleMute, playSound } = useAudio();

  // On mount, verify existing token and fetch profile
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const profileData = await userService.getProfile();
          setUser(profileData);
        } catch (error) {
          if (error.response?.status !== 401 && error.response?.status !== 403) {
            console.error('[AUTH VERIFY FAILED]', error.message);
          }
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const handleAuthSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const handleUpdateUser = (updatedData) => {
    setUser(updatedData);
  };

  if (loading) {
    return (
      <div 
        style={{ 
          height: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          background: 'var(--bg-dark)'
        }}
      >
        <Loader message="ESTABLISHING CYBER LINK..." />
      </div>
    );
  }

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="app-container">
        <Navbar
          user={user}
          onLogout={handleLogout}
          isMuted={isMuted}
          toggleMute={toggleMute}
          playSound={playSound}
        />
        
        <main className="container">
          <Routes>
            {/* Game Screen (Protected) */}
            <Route
              path="/"
              element={
                user ? (
                  <Game user={user} onUpdateUser={handleUpdateUser} playSound={playSound} />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            {/* Profile Screen (Protected) */}
            <Route
              path="/profile"
              element={
                user ? (
                  <Profile
                    user={user}
                    onUpdateUser={handleUpdateUser}
                    onLogout={handleLogout}
                    playSound={playSound}
                  />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            {/* Leaderboard Screen (Public) */}
            <Route path="/leaderboard" element={<Leaderboard playSound={playSound} />} />

            {/* Auth Screens (Public, redirects to game if logged in) */}
            <Route
              path="/login"
              element={
                !user ? (
                  <Login onAuthSuccess={handleAuthSuccess} playSound={playSound} />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="/register"
              element={
                !user ? (
                  <Register onAuthSuccess={handleAuthSuccess} playSound={playSound} />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />

            {/* Fallback redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
