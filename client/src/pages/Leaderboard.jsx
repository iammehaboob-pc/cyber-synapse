import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../services/api';
import Loader from '../components/Loader';
import Toast from '../components/Toast';
import { Trophy, Play, RefreshCw } from 'lucide-react';

const Leaderboard = ({ playSound }) => {
  const navigate = useNavigate();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const data = await userService.getLeaderboard();
      setLeaderboard(data);
    } catch (err) {
      console.error(err);
      setToast({
        message: err.response?.data?.message || 'Failed to sync leaderboard database.',
        type: 'error'
      });
      playSound('mismatch');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const handlePlayClick = () => {
    playSound('click');
    navigate('/');
  };

  const handleRefreshClick = () => {
    playSound('click');
    fetchLeaderboard();
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
      <div className="cyber-card cyan-glow" style={{ padding: '2rem 1.5rem' }}>
        
        {/* Header */}
        <div 
          style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            borderBottom: '1px solid var(--panel-border)',
            paddingBottom: '1rem',
            marginBottom: '1.5rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Trophy size={24} color="var(--neon-cyan)" />
            <h2 className="glitch-text" style={{ fontSize: '1.6rem', color: 'var(--text-primary)' }}>
              GLOBAL_LEADERBOARD
            </h2>
          </div>
          <button
            onClick={handleRefreshClick}
            disabled={loading}
            style={{
              background: 'none',
              color: 'var(--neon-cyan)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '6px',
              borderRadius: '4px',
              border: '1px solid var(--panel-border)',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.borderColor = 'var(--neon-cyan)'}
            onMouseLeave={(e) => e.target.style.borderColor = 'var(--panel-border)'}
            title="Refresh Leaderboard"
          >
            <RefreshCw size={16} className={loading ? 'spin' : ''} style={{ animation: loading ? 'spin 1s infinite linear' : 'none' }} />
          </button>
        </div>

        {loading ? (
          <Loader message="RETRIEVING LEADERBOARD DATA..." />
        ) : leaderboard.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 0' }}>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              No scores recorded yet. Be the first to establish a high score!
            </p>
            <button className="btn-cyber btn-cyber-primary" onClick={handlePlayClick}>
              <Play size={16} style={{ marginRight: '0.5rem', display: 'inline', verticalAlign: 'middle' }} />
              PLAY NOW
            </button>
          </div>
        ) : (
          <>
            <div style={{ overflowX: 'auto' }}>
              <table className="leaderboard-table">
                <thead>
                  <tr>
                    <th style={{ width: '80px' }}>RANK</th>
                    <th>ALIAS</th>
                    <th style={{ textAlign: 'right' }}>HIGH_SCORE</th>
                    <th style={{ textAlign: 'right' }}>WINS</th>
                    <th style={{ textAlign: 'right' }}>TOTAL_GAMES</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((player, index) => {
                    const rank = index + 1;
                    let rankClass = 'leaderboard-rank';
                    if (rank === 1) rankClass += ' rank-1';
                    if (rank === 2) rankClass += ' rank-2';
                    if (rank === 3) rankClass += ' rank-3';

                    return (
                      <tr key={player._id}>
                        <td>
                          <span className={rankClass}>
                            {rank === 1 ? '🥇 ' : rank === 2 ? '🥈 ' : rank === 3 ? '🥉 ' : `#${rank}`}
                          </span>
                        </td>
                        <td style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                          {player.username.toUpperCase()}
                        </td>
                        <td style={{ textAlign: 'right', fontWeight: 'bold', color: 'var(--neon-cyan)', textShadow: '0 0 4px var(--neon-cyan-glow)' }}>
                          {player.highestScore.toLocaleString()}
                        </td>
                        <td style={{ textAlign: 'right', color: 'var(--neon-green)' }}>
                          {player.wins}
                        </td>
                        <td style={{ textAlign: 'right', color: 'var(--text-secondary)' }}>
                          {player.totalGames}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2.5rem' }}>
              <button className="btn-cyber btn-cyber-primary" onClick={handlePlayClick}>
                <Play size={16} style={{ marginRight: '0.5rem', display: 'inline', verticalAlign: 'middle' }} />
                CHALLENGE SCOREBOARD
              </button>
            </div>
          </>
        )}
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

export default Leaderboard;
