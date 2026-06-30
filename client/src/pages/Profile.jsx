import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../services/api';
import Loader from '../components/Loader';
import Toast from '../components/Toast';
import { User, ShieldAlert, Award, Hash, CheckSquare, Target } from 'lucide-react';

const Profile = ({ user, onUpdateUser, onLogout, playSound }) => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [toast, setToast] = useState(null);

  // Update profile form state
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const { username, email, password, confirmPassword } = formData;

  // Account deletion confirm state
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await userService.getProfile();
        setProfile(data);
        setFormData({
          username: data.username,
          email: data.email,
          password: '',
          confirmPassword: ''
        });
      } catch (err) {
        console.error(err);
        setToast({
          message: err.response?.data?.message || 'Failed to sync player data.',
          type: 'error'
        });
        playSound('mismatch');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const showToast = (message, type) => {
    setToast({ message, type });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    playSound('click');

    if (!username || !email) {
      showToast('Username and Email cannot be empty', 'error');
      playSound('mismatch');
      return;
    }

    if (password && password.length < 6) {
      showToast('New password must be at least 6 characters long', 'error');
      playSound('mismatch');
      return;
    }

    if (password && password !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      playSound('mismatch');
      return;
    }

    try {
      setUpdating(true);
      const updatedData = { username, email };
      if (password) updatedData.password = password;

      const data = await userService.updateProfile(updatedData);
      setProfile(data);
      onUpdateUser(data); // Sync main App user state
      
      setFormData({
        ...formData,
        password: '',
        confirmPassword: ''
      });
      
      showToast('Profile credentials synced successfully!', 'success');
      playSound('match');
    } catch (err) {
      console.error(err);
      playSound('mismatch');
      showToast(err.response?.data?.message || 'Failed to update credentials.', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteAccount = async () => {
    playSound('click');
    if (!confirmDelete) {
      setConfirmDelete(true);
      playSound('mismatch');
      return;
    }

    try {
      setUpdating(true);
      await userService.deleteAccount();
      playSound('win');
      onLogout();
      navigate('/register');
    } catch (err) {
      console.error(err);
      playSound('mismatch');
      showToast(err.response?.data?.message || 'Failed to delete account.', 'error');
      setConfirmDelete(false);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <Loader message="ACCESSING DECRYPTED PLAYER METRICS..." />;
  }

  // Calculate Win Rate
  const winRate = profile && profile.totalGames > 0
    ? ((profile.wins / profile.totalGames) * 100).toFixed(1)
    : 0;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', width: '100%' }}>
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '1.5rem', 
          alignItems: 'start' 
        }}
      >
        
        {/* Profile Stats Overview */}
        <div className="cyber-card cyan-glow">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--panel-border)', paddingBottom: '0.75rem' }}>
            <User size={20} color="var(--neon-cyan)" />
            <h3 style={{ fontFamily: 'var(--font-title)', color: 'var(--text-primary)' }}>PLAYER_METRICS</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            
            <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '1rem', borderRadius: '4px', border: '1px solid rgba(255, 255, 255, 0.02)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                <Award size={14} color="var(--neon-cyan)" /> HIGH_SCORE
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 'bold', color: 'var(--neon-cyan)' }}>{profile.highestScore}</div>
            </div>

            <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '1rem', borderRadius: '4px', border: '1px solid rgba(255, 255, 255, 0.02)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                <Target size={14} color="var(--neon-purple)" /> WIN_RATE
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 'bold', color: 'var(--neon-purple)' }}>{winRate}%</div>
            </div>

            <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '1rem', borderRadius: '4px', border: '1px solid rgba(255, 255, 255, 0.02)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                <Hash size={14} color="var(--text-muted)" /> TOTAL_RUNS
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{profile.totalGames}</div>
            </div>

            <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '1rem', borderRadius: '4px', border: '1px solid rgba(255, 255, 255, 0.02)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                <CheckSquare size={14} color="var(--neon-green)" /> WINS
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 'bold', color: 'var(--neon-green)' }}>{profile.wins}</div>
            </div>

          </div>

          <div style={{ borderTop: '1px solid var(--panel-border)', paddingTop: '1.5rem', marginTop: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'between', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              <span>SYSTEM ACCOUNT AGE:</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>
                {new Date(profile.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'between', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              <span>OUTCOMES LOSSES:</span>
              <span style={{ color: 'var(--neon-pink)', fontWeight: 'bold' }}>{profile.losses}</span>
            </div>
          </div>
        </div>

        {/* Update Profile Form */}
        <div className="cyber-card pink-glow">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--panel-border)', paddingBottom: '0.75rem' }}>
            <User size={20} color="var(--neon-pink)" />
            <h3 style={{ fontFamily: 'var(--font-title)', color: 'var(--text-primary)' }}>CREDENTIAL_UPDATE</h3>
          </div>

          {updating ? (
            <Loader message="SYNCING CREDENTIALS..." />
          ) : (
            <form onSubmit={handleUpdate}>
              <div className="form-group">
                <label className="form-label" htmlFor="username">Alias</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={username}
                  onChange={handleChange}
                  className="form-input"
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
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="password">New Password (Optional)</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Leave empty to keep current"
                />
              </div>

              {password && (
                <div className="form-group">
                  <label className="form-label" htmlFor="confirmPassword">Confirm New Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Repeat new password"
                    required
                  />
                </div>
              )}

              <button
                type="submit"
                className="btn-cyber btn-cyber-secondary"
                style={{ width: '100%', marginTop: '1rem', marginBottom: '1.5rem' }}
              >
                COMMIT CREDENTIAL CHANGES
              </button>
            </form>
          )}

          {/* Account Deletion Area */}
          <div 
            style={{ 
              borderTop: '1px solid var(--panel-border)', 
              paddingTop: '1.5rem', 
              marginTop: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--neon-pink)', fontSize: '0.9rem', fontWeight: 'bold' }}>
              <ShieldAlert size={16} />
              <span>DANGER_ZONE</span>
            </div>
            
            {confirmDelete && (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                WARNING: Deleting account will wipe all credentials, highest score, wins, and losses permanently. This action cannot be undone.
              </p>
            )}

            <button
              onClick={handleDeleteAccount}
              disabled={updating}
              className="btn-cyber"
              style={{
                background: confirmDelete ? 'var(--neon-pink)' : 'transparent',
                color: confirmDelete ? '#fff' : 'var(--neon-pink)',
                borderColor: 'var(--neon-pink)',
                width: '100%',
                boxShadow: confirmDelete ? '0 0 10px var(--neon-pink)' : 'none'
              }}
            >
              {confirmDelete ? 'CONFIRM PERMANENT WIPE' : 'DELETE PLAYER CONNECTION'}
            </button>

            {confirmDelete && (
              <button
                onClick={() => {
                  playSound('click');
                  setConfirmDelete(false);
                }}
                className="btn-cyber btn-cyber-outline"
                style={{ width: '100%' }}
              >
                CANCEL ABORT
              </button>
            )}
          </div>
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

export default Profile;
