import React, { useState, useEffect, useRef } from 'react';
import { userService } from '../services/api';
import Toast from '../components/Toast';
import { 
  Cpu, Eye, Shield, Zap, Database, Terminal, 
  Disc, Bot, Radio, Wifi, HardDrive, Compass,
  Key, Layers, Binary, Gamepad2, Activity, Atom,
  Play, RotateCcw, AlertCircle, Clock, Award, BarChart2
} from 'lucide-react';

// Card list containing the icon mapping functions
const CARD_ICONS = [
  { name: 'Cpu', component: Cpu, color: '#00f3ff' },
  { name: 'Eye', component: Eye, color: '#ff0055' },
  { name: 'Shield', component: Shield, color: '#39ff14' },
  { name: 'Zap', component: Zap, color: '#b026ff' },
  { name: 'Database', component: Database, color: '#ff9900' },
  { name: 'Terminal', component: Terminal, color: '#ff00aa' },
  { name: 'Disc', component: Disc, color: '#00ffff' },
  { name: 'Bot', component: Bot, color: '#ffff00' },
  { name: 'Radio', component: Radio, color: '#39ff14' },
  { name: 'Wifi', component: Wifi, color: '#00f3ff' },
  { name: 'HardDrive', component: HardDrive, color: '#ff0055' },
  { name: 'Compass', component: Compass, color: '#b026ff' },
  { name: 'Key', component: Key, color: '#ff9900' },
  { name: 'Layers', component: Layers, color: '#00ffff' },
  { name: 'Binary', component: Binary, color: '#ffff00' },
  { name: 'Gamepad2', component: Gamepad2, color: '#39ff14' },
  { name: 'Activity', component: Activity, color: '#ff00aa' },
  { name: 'Atom', component: Atom, color: '#00f3ff' }
];

const Game = ({ user, onUpdateUser, playSound }) => {
  const [difficulty, setDifficulty] = useState('easy'); // easy (4x4 = 8 pairs) or hard (6x6 = 18 pairs)
  const [gameState, setGameState] = useState('idle'); // idle, playing, won, lost
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [savingScore, setSavingScore] = useState(false);
  const [toast, setToast] = useState(null);

  const timerRef = useRef(null);

  const showToast = (message, type) => {
    setToast({ message, type });
  };

  // Setup the game layout
  const initializeGame = () => {
    clearInterval(timerRef.current);
    playSound('click');

    const numPairs = difficulty === 'easy' ? 8 : 18;
    const initialTime = difficulty === 'easy' ? 60 : 120;

    // Slice required icon set
    const selectedIcons = CARD_ICONS.slice(0, numPairs);
    
    // Duplicate icons to create matching pairs
    const duplicatedIcons = [...selectedIcons, ...selectedIcons].map((icon, index) => ({
      ...icon,
      uniqueId: index,
      isFlipped: false,
      isMatched: false
    }));

    // Shuffle the deck (Fisher-Yates)
    for (let i = duplicatedIcons.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [duplicatedIcons[i], duplicatedIcons[j]] = [duplicatedIcons[j], duplicatedIcons[i]];
    }

    setCards(duplicatedIcons);
    setFlippedCards([]);
    setMoves(0);
    setScore(0);
    setTimeLeft(initialTime);
    setGameState('playing');

    // Run Timer loop
    startTimer();
  };

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleGameOver(false);
          return 0;
        }
        
        // Sound cue warning for low time
        if (prev <= 11) {
          playSound('click');
        }

        return prev - 1;
      });
    }, 1000);
  };

  // Clear timer on component exit
  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  const handleCardClick = (index) => {
    // Blocks interaction if two cards are already flipped,
    // card is matched, or clicked card is already flipped
    if (
      flippedCards.length === 2 || 
      cards[index].isMatched || 
      cards[index].isFlipped ||
      gameState !== 'playing'
    ) {
      return;
    }

    playSound('flip');

    // Flip the target card
    const updatedCards = [...cards];
    updatedCards[index].isFlipped = true;
    setCards(updatedCards);

    const newFlipped = [...flippedCards, index];
    setFlippedCards(newFlipped);

    // If two cards are flipped, check for match
    if (newFlipped.length === 2) {
      setMoves((prev) => prev + 1);
      checkForMatch(newFlipped);
    }
  };

  const checkForMatch = (indices) => {
    const [first, second] = indices;
    const card1 = cards[first];
    const card2 = cards[second];

    if (card1.name === card2.name) {
      // It is a Match!
      setTimeout(() => {
        playSound('match');
        const updatedCards = [...cards];
        updatedCards[first].isMatched = true;
        updatedCards[second].isMatched = true;
        setCards(updatedCards);
        setFlippedCards([]);

        // Award points based on speed
        setScore((prev) => prev + (difficulty === 'easy' ? 100 : 250));

        // Check if all cards matched
        if (updatedCards.every((card) => card.isMatched)) {
          handleGameOver(true);
        }
      }, 500);
    } else {
      // Mismatch
      setTimeout(() => {
        playSound('mismatch');
        const updatedCards = [...cards];
        updatedCards[first].isFlipped = false;
        updatedCards[second].isFlipped = false;
        setCards(updatedCards);
        setFlippedCards([]);
      }, 1000);
    }
  };

  const calculateFinalScore = () => {
    // Score calculation algorithm
    // Easy base: 800 pts. Hard base: 4500 pts.
    // Bonus for time remaining, penalty for extra moves.
    const baseScore = score;
    const timeBonus = timeLeft * (difficulty === 'easy' ? 15 : 30);
    const movesPenalty = Math.max(0, moves - (difficulty === 'easy' ? 12 : 30)) * 10;
    
    return Math.max(100, baseScore + timeBonus - movesPenalty);
  };

  const handleGameOver = async (isVictory) => {
    clearInterval(timerRef.current);
    
    const finalScore = isVictory ? calculateFinalScore() : 0;
    setScore(finalScore);
    
    setGameState(isVictory ? 'won' : 'lost');
    playSound(isVictory ? 'win' : 'mismatch');

    // Save score to database
    try {
      setSavingScore(true);
      const outcome = isVictory ? 'win' : 'lose';
      const updatedUser = await userService.saveScore(finalScore, outcome);
      
      // Update global user state (high scores, etc.)
      onUpdateUser(updatedUser);
      
      if (isVictory) {
        showToast('Neural Connection established! Score uploaded.', 'success');
      } else {
        showToast('Connection terminated! Score reset.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Database synchronization error. Score not saved.', 'error');
    } finally {
      setSavingScore(false);
    }
  };

  return (
    <div className="game-layout">
      {/* Settings Selector (Idle state) */}
      {gameState === 'idle' && (
        <div className="cyber-card cyan-glow" style={{ maxWidth: '500px', width: '100%', textAlign: 'center', padding: '3rem 2rem' }}>
          <h2 className="glitch-text" style={{ fontSize: '2.2rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
            NEON_MEMORY
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-title)', letterSpacing: '1px', marginBottom: '2rem' }}>
            DECRYPT THE COGNITIVE MATRIX
          </p>

          <div style={{ margin: '2rem 0' }}>
            <label className="form-label" style={{ marginBottom: '0.75rem' }}>Select Grid Difficulty</label>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                onClick={() => { playSound('click'); setDifficulty('easy'); }}
                className="btn-cyber"
                style={{
                  flex: 1,
                  background: difficulty === 'easy' ? 'var(--neon-cyan)' : 'transparent',
                  color: difficulty === 'easy' ? '#000' : 'var(--neon-cyan)',
                  borderColor: 'var(--neon-cyan)',
                  boxShadow: difficulty === 'easy' ? '0 0 10px var(--neon-cyan-glow)' : 'none'
                }}
              >
                EASY (4x4)
              </button>
              <button
                onClick={() => { playSound('click'); setDifficulty('hard'); }}
                className="btn-cyber"
                style={{
                  flex: 1,
                  background: difficulty === 'hard' ? 'var(--neon-pink)' : 'transparent',
                  color: difficulty === 'hard' ? '#fff' : 'var(--neon-pink)',
                  borderColor: 'var(--neon-pink)',
                  boxShadow: difficulty === 'hard' ? '0 0 10px var(--neon-pink-glow)' : 'none'
                }}
              >
                HARD (6x6)
              </button>
            </div>
          </div>

          <div style={{ background: 'rgba(0, 0, 0, 0.4)', padding: '1rem', borderRadius: '4px', border: '1px solid var(--panel-border)', marginBottom: '2rem', textAlign: 'left', fontSize: '0.95rem' }}>
            <p style={{ color: 'var(--text-primary)', fontWeight: 'bold', marginBottom: '0.5rem' }}>RULESET:</p>
            <ul style={{ listStyleType: 'square', paddingLeft: '1.25rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <li>Find all matching icons before the timer reaches zero.</li>
              <li>Easy mode has 8 matching pairs with a 60 second timer limit.</li>
              <li>Hard mode has 18 matching pairs with a 120 second timer limit.</li>
              <li>High scores are calculated based on remaining time and moves penalty.</li>
            </ul>
          </div>

          <button className="btn-cyber btn-cyber-primary" style={{ width: '100%', padding: '1rem' }} onClick={initializeGame}>
            <Play size={18} style={{ marginRight: '0.5rem', display: 'inline', verticalAlign: 'middle' }} />
            INITIALIZE NEURAL LINK
          </button>
        </div>
      )}

      {/* Game Board HUD & Grid */}
      {gameState === 'playing' && (
        <>
          {/* HUD statistics display */}
          <div className="game-controls">
            <div className="stat-box">
              <span className="stat-label">
                <Clock size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                TIMER
              </span>
              <span 
                className="stat-value" 
                style={{ 
                  color: timeLeft <= 10 ? 'var(--neon-pink)' : 'var(--neon-cyan)',
                  textShadow: timeLeft <= 10 ? '0 0 8px var(--neon-pink-glow)' : '0 0 8px var(--neon-cyan-glow)'
                }}
              >
                {timeLeft}s
              </span>
            </div>

            <div className="stat-box">
              <span className="stat-label">MOVES</span>
              <span className="stat-value" style={{ color: 'var(--neon-purple)', textShadow: '0 0 8px var(--neon-purple-glow)' }}>
                {moves}
              </span>
            </div>

            <div className="stat-box">
              <span className="stat-label">SCORE</span>
              <span className="stat-value" style={{ color: 'var(--neon-green)', textShadow: '0 0 8px var(--neon-green-glow)' }}>
                {score}
              </span>
            </div>
            
            <div className="stat-box" style={{ borderLeft: '1px solid var(--panel-border)', paddingLeft: '1rem' }}>
              <span className="stat-label">BEST</span>
              <span className="stat-value" style={{ color: 'var(--text-primary)' }}>
                {user?.highestScore || 0}
              </span>
            </div>
          </div>

          {/* Core Grid */}
          <div className={`grid-board ${difficulty === 'easy' ? 'grid-4x4' : 'grid-6x6'}`}>
            {cards.map((card, index) => {
              const IconComponent = card.component;
              const isFlipped = card.isFlipped || card.isMatched;

              return (
                <div
                  key={card.uniqueId}
                  onClick={() => handleCardClick(index)}
                  className={`memory-card ${isFlipped ? 'flipped' : ''} ${card.isMatched ? 'matched' : ''}`}
                >
                  <div className="card-inner">
                    {/* Front of Card (Revealed) */}
                    <div className="card-front" style={{ color: card.color }}>
                      <IconComponent className="card-icon" />
                    </div>
                    {/* Back of Card (Hidden) */}
                    <div className="card-back">
                      <Cpu size={24} style={{ opacity: 0.15 }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Abort Button */}
          <button 
            className="btn-cyber btn-cyber-secondary" 
            onClick={() => { playSound('click'); clearInterval(timerRef.current); setGameState('idle'); }}
            style={{ width: '100%', maxWidth: '600px', marginTop: '0.5rem' }}
          >
            <RotateCcw size={14} style={{ marginRight: '0.5rem', display: 'inline', verticalAlign: 'middle' }} />
            ABORT DECRYPTION
          </button>
        </>
      )}

      {/* Victory Overlay Screen */}
      {gameState === 'won' && (
        <div className="victory-overlay">
          <div className="cyber-card victory-panel cyan-glow">
            <h2 className="victory-title glitch-text">DECRYPTION SUCCESS</h2>
            <p style={{ color: 'var(--neon-green)', fontFamily: 'var(--font-title)', letterSpacing: '2px', fontWeight: 'bold' }}>
              NEURAL CONNECTIVITY SECURED
            </p>

            <div className="victory-stats">
              <div style={{ background: 'rgba(0, 0, 0, 0.4)', padding: '0.75rem', borderRadius: '4px', border: '1px solid rgba(0, 243, 255, 0.1)' }}>
                <div className="stat-label" style={{ fontSize: '0.65rem' }}>FINAL SCORE</div>
                <div className="stat-value">{score}</div>
              </div>
              <div style={{ background: 'rgba(0, 0, 0, 0.4)', padding: '0.75rem', borderRadius: '4px', border: '1px solid rgba(0, 243, 255, 0.1)' }}>
                <div className="stat-label" style={{ fontSize: '0.65rem' }}>TOTAL MOVES</div>
                <div className="stat-value" style={{ color: 'var(--neon-purple)' }}>{moves}</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '2rem' }}>
              <button className="btn-cyber btn-cyber-primary" onClick={initializeGame} disabled={savingScore}>
                <RotateCcw size={16} style={{ marginRight: '0.5rem', display: 'inline', verticalAlign: 'middle' }} />
                RE-RUN SIMULATION
              </button>
              <button 
                className="btn-cyber btn-cyber-outline" 
                onClick={() => { playSound('click'); setGameState('idle'); }}
                disabled={savingScore}
              >
                ABORT TO ROOT MENU
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Defeat Screen */}
      {gameState === 'lost' && (
        <div className="victory-overlay">
          <div className="cyber-card victory-panel pink-glow" style={{ borderColor: 'var(--neon-pink)' }}>
            <h2 className="victory-title glitch-text" style={{ color: 'var(--neon-pink)', textShadow: '0 0 10px var(--neon-pink-glow)' }}>
              LINK TERMINATED
            </h2>
            <p style={{ color: 'var(--neon-pink)', fontFamily: 'var(--font-title)', letterSpacing: '2px', fontWeight: 'bold' }}>
              COGNITIVE DECRYPTION FAILED
            </p>

            <div 
              style={{ 
                margin: '1.5rem 0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                color: 'var(--text-secondary)'
              }}
            >
              <AlertCircle size={16} color="var(--neon-pink)" />
              <span>Buffer overflow: Timer reached zero.</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '2rem' }}>
              <button className="btn-cyber btn-cyber-secondary" onClick={initializeGame} disabled={savingScore}>
                <RotateCcw size={16} style={{ marginRight: '0.5rem', display: 'inline', verticalAlign: 'middle' }} />
                RE-RUN SIMULATION
              </button>
              <button 
                className="btn-cyber btn-cyber-outline" 
                onClick={() => { playSound('click'); setGameState('idle'); }}
                disabled={savingScore}
              >
                ABORT TO ROOT MENU
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alerts notification toast container */}
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

export default Game;
