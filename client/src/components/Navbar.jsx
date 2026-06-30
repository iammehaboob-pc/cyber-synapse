import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Volume2, VolumeX, LogOut, Trophy, User, Gamepad2 } from 'lucide-react';

const Navbar = ({ user, onLogout, isMuted, toggleMute, playSound }) => {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    playSound('click');
    onLogout();
    navigate('/login');
  };

  return (
    <nav
      style={{
        background: 'var(--panel-bg)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderBottom: '1px solid var(--panel-border)',
        padding: '1rem 1.5rem',
        position: 'sticky',
        top: 0,
        zIndex: 999,
        display: 'flex',
        justifyContent: 'between',
        alignItems: 'center'
      }}
    >
      <div 
        style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          width: '100%',
          maxWidth: '1200px',
          margin: '0 auto'
        }}
      >
        {/* Brand Logo */}
        <Link
          to="/"
          onClick={() => playSound('click')}
          style={{
            textDecoration: 'none',
            fontFamily: 'var(--font-title)',
            fontWeight: 900,
            fontSize: '1.4rem',
            color: 'var(--text-primary)',
            letterSpacing: '1.5px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <span style={{ color: 'var(--neon-cyan)', textShadow: '0 0 5px var(--neon-cyan-glow)' }}>NEON</span>
          <span style={{ color: 'var(--neon-pink)', textShadow: '0 0 5px var(--neon-pink-glow)' }}>//</span>
          <span>MEMORY</span>
        </Link>

        {/* Action Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          {user ? (
            <>
              <Link
                to="/"
                onClick={() => playSound('click')}
                style={{
                  color: 'var(--text-primary)',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.95rem',
                  fontFamily: 'var(--font-title)',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.color = 'var(--neon-cyan)'}
                onMouseLeave={(e) => e.target.style.color = 'var(--text-primary)'}
              >
                <Gamepad2 size={16} />
                <span className="nav-text" style={{ display: 'inline' }}>PLAY</span>
              </Link>

              <Link
                to="/leaderboard"
                onClick={() => playSound('click')}
                style={{
                  color: 'var(--text-primary)',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.95rem',
                  fontFamily: 'var(--font-title)',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.color = 'var(--neon-cyan)'}
                onMouseLeave={(e) => e.target.style.color = 'var(--text-primary)'}
              >
                <Trophy size={16} />
                <span className="nav-text" style={{ display: 'inline' }}>LEADERBOARD</span>
              </Link>

              <Link
                to="/profile"
                onClick={() => playSound('click')}
                style={{
                  color: 'var(--text-primary)',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.95rem',
                  fontFamily: 'var(--font-title)',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.color = 'var(--neon-cyan)'}
                onMouseLeave={(e) => e.target.style.color = 'var(--text-primary)'}
              >
                <User size={16} />
                <span className="nav-text" style={{ display: 'inline' }}>{user.username.toUpperCase()}</span>
              </Link>

              <button
                onClick={handleLogoutClick}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--neon-pink)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontFamily: 'var(--font-title)',
                  fontSize: '0.95rem',
                  fontWeight: 'bold',
                  padding: 0,
                  transition: 'text-shadow 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.textShadow = '0 0 8px var(--neon-pink-glow)'}
                onMouseLeave={(e) => e.target.style.textShadow = 'none'}
              >
                <LogOut size={16} />
                <span className="nav-text" style={{ display: 'inline' }}>LOGOUT</span>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => playSound('click')}
                style={{
                  color: 'var(--text-primary)',
                  textDecoration: 'none',
                  fontSize: '0.95rem',
                  fontFamily: 'var(--font-title)',
                  fontWeight: '700',
                  letterSpacing: '1px'
                }}
              >
                LOGIN
              </Link>
              <Link
                to="/register"
                onClick={() => playSound('click')}
                style={{
                  background: 'transparent',
                  color: 'var(--neon-cyan)',
                  border: '1px solid var(--neon-cyan)',
                  padding: '0.4rem 1rem',
                  borderRadius: '4px',
                  textDecoration: 'none',
                  fontSize: '0.95rem',
                  fontFamily: 'var(--font-title)',
                  fontWeight: '700',
                  letterSpacing: '1px',
                  boxShadow: '0 0 5px rgba(0, 243, 255, 0.2)',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'var(--neon-cyan)';
                  e.target.style.color = '#000';
                  e.target.style.boxShadow = '0 0 10px var(--neon-cyan)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'transparent';
                  e.target.style.color = 'var(--neon-cyan)';
                  e.target.style.boxShadow = '0 0 5px rgba(0, 243, 255, 0.2)';
                }}
              >
                REGISTER
              </Link>
            </>
          )}

          {/* Sound Controls */}
          <button
            onClick={() => {
              toggleMute();
              if (isMuted) {
                // If it is currently muted, it will become unmuted, so we play tick sound
                const ctxClass = window.AudioContext || window.webkitAudioContext;
                if (ctxClass) {
                  const ctx = new ctxClass();
                  const osc = ctx.createOscillator();
                  const gain = ctx.createGain();
                  osc.connect(gain);
                  gain.connect(ctx.destination);
                  osc.frequency.setValueAtTime(800, ctx.currentTime);
                  gain.gain.setValueAtTime(0.05, ctx.currentTime);
                  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
                  osc.start();
                  osc.stop(ctx.currentTime + 0.05);
                }
              }
            }}
            style={{
              background: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '6px',
              borderRadius: '50%',
              border: '1px solid var(--panel-border)',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = 'var(--neon-cyan)';
              e.target.style.color = 'var(--neon-cyan)';
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = 'var(--panel-border)';
              e.target.style.color = 'var(--text-secondary)';
            }}
            title={isMuted ? 'Unmute SFX' : 'Mute SFX'}
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
