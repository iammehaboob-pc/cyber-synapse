import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import Toast from '../components/Toast';
import Loader from '../components/Loader';

const Register = ({ onAuthSuccess, playSound }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const { username, email, password, confirmPassword } = formData;

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

    if (!username || !email || !password || !confirmPassword) {
      showToast('Please fill in all security fields', 'error');
      playSound('mismatch');
      return;
    }

    if (username.length < 3) {
      showToast('Username must be at least 3 characters long', 'error');
      playSound('mismatch');
      return;
    }

    if (password.length < 6) {
      showToast('Password must be at least 6 characters long', 'error');
      playSound('mismatch');
      return;
    }

    if (password !== confirmPassword) {
      showToast('Security keys (passwords) do not match', 'error');
      playSound('mismatch');
      return;
    }

    try {
      setLoading(true);
      const data = await authService.register(username, email, password);
      
      // Save Token & User to state/localStorage
      localStorage.setItem('token', data.token);
      onAuthSuccess(data);

      playSound('match');
      navigate('/');
    } catch (err) {
      playSound('mismatch');
      const errMsg = err.response?.data?.message || 'Registration failed. Try again later.';
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
        className="cyber-card pink-glow"
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
          SYS_REGISTER
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
          ESTABLISH NEURAL PROFILE
        </p>

        {loading ? (
          <Loader message="CREATING NEURAL PROFILE..." />
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="username">Alias (Username)</label>
              <input
                type="text"
                id="username"
                name="username"
                value={username}
                onChange={handleChange}
                className="form-input"
                placeholder="Cyber_Runner"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="email">Comms Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={handleChange}
                className="form-input"
                placeholder="runner@net.com"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">Security Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={handleChange}
                className="form-input"
                placeholder="Min 6 characters"
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: '2rem' }}>
              <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={handleChange}
                className="form-input"
                placeholder="Repeat password"
                required
              />
            </div>

            <button
              type="submit"
              className="btn-cyber btn-cyber-secondary"
              style={{
                width: '100%',
                marginBottom: '1.5rem'
              }}
            >
              CREATE NEW CONNECTION
            </button>
          </form>
        )}

        <div style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Already registered?{' '}
            <Link
              to="/login"
              onClick={() => playSound('click')}
              style={{
                color: 'var(--neon-cyan)',
                textDecoration: 'none',
                fontWeight: 'bold',
                fontFamily: 'var(--font-title)',
                letterSpacing: '0.5px'
              }}
              onMouseEnter={(e) => e.target.style.textShadow = '0 0 5px var(--neon-cyan-glow)'}
              onMouseLeave={(e) => e.target.style.textShadow = 'none'}
            >
              INITIALIZE CONNECTION
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

export default Register;
