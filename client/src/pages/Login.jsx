import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import Toast from '../components/Toast';
import Loader from '../components/Loader';

const Login = ({ onAuthSuccess, playSound }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const { email, password } = formData;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const showToast = (message, type) => {
    setToast({ message, type });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    playSound('click');

    if (!email || !password) {
      showToast('Please enter both email and password', 'error');
      playSound('mismatch');
      return;
    }

    try {
      setLoading(true);
      const data = await authService.login(email, password);
      
      // Save Token & User to state/localStorage
      localStorage.setItem('token', data.token);
      onAuthSuccess(data);

      playSound('match');
      navigate('/');
    } catch (err) {
      playSound('mismatch');
      const errMsg = err.response?.data?.message || 'Authentication failed. Please try again.';
      showToast(errMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 'calc(100vh - 120px)',
        padding: '1rem'
      }}
    >
      <div 
        className="cyber-card cyan-glow"
        style={{
          width: '100%',
          maxWidth: '400px'
        }}
      >
        <h2 
          className="glitch-text"
          style={{
            textAlign: 'center',
            fontSize: '1.75rem',
            marginBottom: '0.25rem',
            color: 'var(--text-primary)'
          }}
        >
          LOG_IN
        </h2>
        <p 
          style={{
            textAlign: 'center',
            fontSize: '0.9rem',
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-title)',
            letterSpacing: '1px',
            marginBottom: '2rem'
          }}
        >
          SYNC NEURAL ACCESS KEY
        </p>

        {loading ? (
          <Loader message="AUTHENTICATING..." />
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={handleChange}
                className="form-input"
                placeholder="identity@cyberspace.net"
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: '2rem' }}>
              <label className="form-label" htmlFor="password">Security Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={handleChange}
                className="form-input"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              className="btn-cyber btn-cyber-primary"
              style={{
                width: '100%',
                marginBottom: '1.5rem'
              }}
            >
              INITIALIZE CONNECTION
            </button>
          </form>
        )}

        <div style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            New user?{' '}
            <Link
              to="/register"
              onClick={() => playSound('click')}
              style={{
                color: 'var(--neon-pink)',
                textDecoration: 'none',
                fontWeight: 'bold',
                fontFamily: 'var(--font-title)',
                letterSpacing: '0.5px'
              }}
              onMouseEnter={(e) => e.target.style.textShadow = '0 0 5px var(--neon-pink-glow)'}
              onMouseLeave={(e) => e.target.style.textShadow = 'none'}
            >
              REGISTER CREDENTIALS
            </Link>
          </p>
        </div>
      </div>

      {toast && (
        <div className="toast-container">
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        </div>
      )}
    </div>
  );
};

export default Login;
