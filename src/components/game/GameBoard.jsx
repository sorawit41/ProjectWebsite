import React, { useState, useEffect, useCallback } from 'react';
  import { supabase } from '../../pages/supabaseClient'; // << ตรวจสอบว่า đường dẫn ถูกต้อง

  // --- Global Styles ---
  const GlobalStyles = () => (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
      
      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        background: #ffffff;
      }

      @keyframes spawn {
        from { transform: scale(0.8) rotate(-10deg); opacity: 0; }
        to { transform: scale(1) rotate(0deg); opacity: 1; }
      }

      @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }

      @keyframes glow {
        0%, 100% { text-shadow: 0 0 5px #ffd700, 0 0 10px #ffd700; }
        50% { text-shadow: 0 0 15px #ffd700, 0 0 25px #ffd700; }
      }

      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
      }

      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-2px); }
        75% { transform: translateX(2px); }
      }

      @keyframes floatAndFade {
        from { transform: translateY(0); opacity: 1; }
        to { transform: translateY(-50px); opacity: 0; }
      }

      @keyframes levelUp {
        0% { transform: scale(1); }
        50% { transform: scale(1.5); }
        100% { transform: scale(1); }
      }

      @keyframes criticalHit {
        0% { transform: scale(1) rotate(0deg); }
        25% { transform: scale(1.2) rotate(-5deg); }
        50% { transform: scale(1.3) rotate(5deg); }
        75% { transform: scale(1.2) rotate(-5deg); }
        100% { transform: scale(1) rotate(0deg); }
      }

      @keyframes rage {
        0%, 100% { filter: hue-rotate(0deg); }
        50% { filter: hue-rotate(180deg); }
      }

      @keyframes combo {
        0% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.2); opacity: 0.8; }
        100% { transform: scale(1); opacity: 1; }
      }

      @keyframes freeze {
        0%, 100% { filter: brightness(1) hue-rotate(0deg); }
        50% { filter: brightness(1.5) hue-rotate(180deg); }
      }

      @keyframes poison {
        0%, 100% { filter: hue-rotate(0deg); }
        50% { filter: hue-rotate(120deg); }
      }

      @keyframes shockwave {
        0% { transform: scale(1); opacity: 1; }
        100% { transform: scale(3); opacity: 0; }
      }
    `}</style>
  );

  // --- Theme Configuration ---
  const theme = {
    colors: {
      primary: '#6366f1',
      primaryHover: '#4f46e5',
      secondary: '#14b8a6',
      success: '#10b981',
      warning: '#f59e0b',
      danger: '#ef4444',
      dark: '#1f2937',
      light: '#f8fafc',
      card: 'rgba(255, 255, 255, 0.95)',
      cardDark: 'rgba(31, 41, 55, 0.95)',
      glass: 'rgba(255, 255, 255, 0.1)',
      critical: '#ff1493',
      combo: '#ff6b35',
    },
    shadows: {
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    },
    gradients: {
      primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      card: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
      button: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    },
  };

  // --- Styled Components ---
  const gameContainerStyle = {
    width: '950px',
    height: '650px',
    background: theme.colors.card,
    borderRadius: '16px',
    boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.3), 0 20px 40px rgba(0, 0, 0, 0.15)',
    overflow: 'hidden',
    position: 'relative',
    backdropFilter: 'blur(20px)',
    border: '2px solid rgba(99, 102, 241, 0.5)',
    margin: '20px auto',
  };

  const styles = {
    // --- Layout ---
    gameContainer: gameContainerStyle,
    
    menuContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      textAlign: 'center',
      padding: '40px',
      background: theme.gradients.card,
    },

    // --- Typography ---
    title: {
      fontSize: '42px',
      fontWeight: '800',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      marginBottom: '8px',
      letterSpacing: '-0.02em',
    },

    subtitle: {
      fontSize: '16px',
      color: theme.colors.dark,
      opacity: 0.7,
      marginBottom: '32px',
      fontWeight: '500',
    },

    // --- Buttons ---
    button: {
      padding: '12px 24px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      background: theme.gradients.button,
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      transition: 'all 0.2s ease',
      boxShadow: theme.shadows.md,
      position: 'relative',
      overflow: 'hidden',
    },

    // --- Character Selection ---
    charactersGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '16px',
      width: '100%',
      maxWidth: '600px',
    },

    charCard: {
      background: 'rgba(255, 255, 255, 0.8)',
      padding: '20px',
      borderRadius: '16px',
      textAlign: 'center',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      border: '2px solid transparent',
      boxShadow: theme.shadows.sm,
    },

    charEmoji: {
      fontSize: '48px',
      marginBottom: '12px',
      display: 'block',
    },

    charName: {
      fontSize: '18px',
      fontWeight: '700',
      color: theme.colors.dark,
      marginBottom: '8px',
    },

    charStats: {
      fontSize: '14px',
      color: theme.colors.dark,
      opacity: 0.7,
      lineHeight: '1.4',
    },

    // --- Game Board ---
    gameBoard: {
      position: 'relative',
      width: '100%',
      height: '100%',
      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
      display: 'flex',
      flexDirection: 'column',
    },

    statsBar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px 24px',
      background: 'rgba(255, 255, 255, 0.9)',
      borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
      fontSize: '14px',
      fontWeight: '600',
      color: theme.colors.dark,
      flexWrap: 'wrap',
      gap: '8px',
    },

    statItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
    },

    buff: {
      color: theme.colors.warning,
      fontWeight: '700',
      animation: 'glow 1.5s infinite',
    },

    // --- Game Area ---
    gameArea: {
      flex: 1,
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0px',
      minHeight: '0',
    },

    catContainer: {
      position: 'relative',
      fontSize: '80px',
      cursor: 'pointer',
      userSelect: 'none',
      transition: 'all 0.1s ease',
      animation: 'float 3s ease-in-out infinite',
      filter: 'drop-shadow(0 8px 16px rgba(0, 0, 0, 0.15))',
      zIndex: 10,
    },

    catActive: {
      transform: 'scale(0.9)',
      animation: 'shake 0.5s ease-in-out',
    },

    catCritical: {
      animation: 'criticalHit 0.3s ease-in-out',
    },

    catCombo: {
      animation: 'combo 0.5s ease-in-out',
    },

    // --- Floating Score ---
    floatingScore: {
      position: 'absolute',
      fontSize: '24px',
      fontWeight: 'bold',
      color: theme.colors.primary,
      pointerEvents: 'none',
      userSelect: 'none',
      animation: 'floatAndFade 1s forwards',
      textShadow: '0px 2px 4px rgba(0,0,0,0.2)',
      zIndex: 100,
    },

    floatingCritical: {
      position: 'absolute',
      fontSize: '32px',
      fontWeight: 'bold',
      color: theme.colors.critical,
      pointerEvents: 'none',
      userSelect: 'none',
      animation: 'floatAndFade 1.2s forwards',
      textShadow: '0px 2px 4px rgba(0,0,0,0.2)',
      zIndex: 100,
    },

    floatingCombo: {
      position: 'absolute',
      fontSize: '28px',
      fontWeight: 'bold',
      color: theme.colors.combo,
      pointerEvents: 'none',
      userSelect: 'none',
      animation: 'floatAndFade 1.1s forwards',
      textShadow: '0px 2px 4px rgba(0,0,0,0.2)',
      zIndex: 100,
    },

    // --- Monsters ---
    monster: {
      position: 'absolute',
      fontSize: '40px',
      cursor: 'pointer',
      userSelect: 'none',
      animation: 'spawn 0.5s ease-out',
      filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))',
      transition: 'transform 0.1s ease',
    },

    monsterHover: {
      transform: 'scale(1.1)',
    },

    monsterFrozen: {
      animation: 'freeze 0.5s ease-in-out',
    },

    monsterPoisoned: {
      animation: 'poison 1s ease-in-out infinite',
    },

    healthBar: {
      position: 'absolute',
      bottom: '-12px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '50px',
      height: '6px',
      background: 'rgba(0, 0, 0, 0.2)',
      borderRadius: '3px',
      overflow: 'hidden',
    },

    healthFill: (percentage) => ({
      height: '100%',
      width: `${percentage}%`,
      background: 'linear-gradient(90deg, #ef4444 0%, #dc2626 100%)',
      borderRadius: '3px',
      transition: 'width 0.3s ease',
    }),

    // --- Boss ---
    boss: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      fontSize: '120px',
      cursor: 'pointer',
      textAlign: 'center',
      animation: 'spawn 0.8s ease-out',
      filter: 'drop-shadow(0 12px 24px rgba(0, 0, 0, 0.3))',
    },

    bossRage: {
      animation: 'rage 1s ease-in-out infinite',
    },

    bossHealthBar: {
      position: 'absolute',
      bottom: '-30px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '200px',
      height: '16px',
      background: 'rgba(0, 0, 0, 0.2)',
      borderRadius: '8px',
      overflow: 'hidden',
    },

    bossHealthText: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '12px',
      fontWeight: '600',
      color: 'white',
      zIndex: 2,
      textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)',
    },

    // --- Special Effects ---
    shockwave: {
      position: 'absolute',
      width: '50px',
      height: '50px',
      borderRadius: '50%',
      border: '3px solid rgba(99, 102, 241, 0.6)',
      animation: 'shockwave 0.8s ease-out',
      pointerEvents: 'none',
      zIndex: 50,
    },

    // --- Level Progress ---
    levelBar: {
      position: 'absolute',
      bottom: '0',
      left: '0',
      right: '0',
      height: '4px',
      background: 'rgba(0, 0, 0, 0.1)',
    },

    levelProgress: (percentage) => ({
      height: '100%',
      width: `${percentage}%`,
      background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)',
      transition: 'width 0.3s ease',
    }),

    // --- Skill Icons ---
    skillsContainer: {
      position: 'absolute',
      bottom: '20px',
      left: '20px',
      display: 'flex',
      gap: '8px',
      flexDirection: 'column',
    },

    skillIcon: {
      width: '40px',
      height: '40px',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '20px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      boxShadow: theme.shadows.sm,
    },

    skillReady: {
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      color: 'white',
    },

    skillCooldown: {
      background: 'rgba(0, 0, 0, 0.1)',
      color: 'rgba(0, 0, 0, 0.3)',
      cursor: 'not-allowed',
    },

    // --- Achievements ---
    achievementNotification: {
      position: 'absolute',
      top: '20px',
      right: '20px',
      background: 'linear-gradient(135deg, #ffd700 0%, #ffb700 100%)',
      color: 'white',
      padding: '12px 16px',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: '600',
      boxShadow: theme.shadows.lg,
      animation: 'spawn 0.5s ease-out',
      zIndex: 200,
    },

    // --- Game Over ---
    gameOverContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      padding: '40px',
      textAlign: 'center',
      background: theme.gradients.card,
    },

    scoreDisplay: {
      fontSize: '48px',
      fontWeight: '800',
      color: theme.colors.primary,
      marginBottom: '8px',
    },

    timeDisplay: {
      fontSize: '16px',
      color: theme.colors.dark,
      opacity: 0.7,
      marginBottom: '32px',
    },

    inputContainer: {
      display: 'flex',
      gap: '12px',
      marginBottom: '16px',
      width: '100%',
      maxWidth: '300px',
    },

    input: {
      flex: 1,
      padding: '12px 16px',
      fontSize: '16px',
      border: '2px solid rgba(0, 0, 0, 0.1)',
      borderRadius: '8px',
      background: 'rgba(255, 255, 255, 0.8)',
      color: theme.colors.dark,
      outline: 'none',
      transition: 'border-color 0.2s ease',
    },

    restartLink: {
      color: theme.colors.primary,
      textDecoration: 'none',
      cursor: 'pointer',
      fontSize: '14px',
      opacity: 0.8,
      transition: 'opacity 0.2s ease',
      marginTop: '16px',
    },
    
    // --- Leaderboard Styles (NEW) ---
    leaderboardContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        height: '100%',
        padding: '30px 40px',
        background: theme.gradients.card,
        overflowY: 'auto',
    },
    
    leaderboardList: {
        width: '100%',
        maxWidth: '500px',
        margin: '20px 0',
        padding: '0',
        listStyle: 'none',
    },
    
    leaderboardItem: {
        display: 'flex',
        alignItems: 'center',
        padding: '10px 15px',
        background: 'rgba(255, 255, 255, 0.7)',
        borderRadius: '12px',
        marginBottom: '10px',
        boxShadow: theme.shadows.sm,
        transition: 'all 0.2s ease',
    },
    
    leaderboardRank: {
        fontSize: '18px',
        fontWeight: '700',
        color: theme.colors.dark,
        opacity: 0.6,
        width: '40px',
        textAlign: 'center',
    },
    
    leaderboardName: {
        flex: 1,
        fontSize: '16px',
        fontWeight: '600',
        color: theme.colors.dark,
        marginLeft: '15px',
    },

    leaderboardScore: {
        fontSize: '18px',
        fontWeight: '700',
        color: theme.colors.primary,
    },
  };

  // --- Components ---
  const StyledButton = ({ onClick, children, style = {}, disabled = false }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isPressed, setIsPressed] = useState(false);

    const buttonStyle = {
      ...styles.button,
      ...style,
      ...(isHovered && !disabled ? { 
        transform: 'translateY(-2px)',
        boxShadow: theme.shadows.lg,
      } : {}),
      ...(isPressed && !disabled ? { 
        transform: 'translateY(0px)',
        boxShadow: theme.shadows.md,
      } : {}),
      ...(disabled ? { 
        opacity: 0.5,
        cursor: 'not-allowed',
      } : {}),
    };

    return (
      <button
        style={buttonStyle}
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        disabled={disabled}
      >
        {children}
      </button>
    );
  };

  const MainMenu = ({ onStartGame, onShowLeaderboard }) => (
    <div style={styles.menuContainer}>
      <h1 style={styles.title}>🐱 Cat Clicker Saga</h1>
      <p style={styles.subtitle}>สะสมแต้มและเอาชีวิตรอดจากเหล่ามอนสเตอร์ร้ายกาจ!</p>
      <div style={{display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center'}}>
        <StyledButton onClick={onStartGame}>
          🎮 เริ่มการผจญภัย
        </StyledButton>
        <a onClick={onShowLeaderboard} style={styles.restartLink}>
          🏆 ดูอันดับคะแนน
        </a>
      </div>
    </div>
  );

  const CharacterSelection = ({ onSelect }) => {
    const [hoveredChar, setHoveredChar] = useState(null);
    
    const characters = [
      { 
        id: 'A', 
        name: 'นินจา', 
        emoji: '🥷', 
        stats: ['⚔️ คลิก: 1.25 แต้ม', '❤️ เลือด: 5', '💥 คริติคัล: 15%'], 
        color: '#ef4444' 
      },
      { 
        id: 'B', 
        name: 'อัศวิน', 
        emoji: '🛡️', 
        stats: ['⚔️ คลิก: 1 แต้ม', '❤️ เลือด: 9', '🛡️ โล่: ลดดาเมจ 30%'], 
        color: '#3b82f6' 
      },
      { 
        id: 'C', 
        name: 'นักล่า', 
        emoji: '🏹', 
        stats: ['⚔️ คลิก: 1 แต้ม', '❤️ เลือด: 7', '🎁 โบนัสดรอป +40%', '🎯 สกิลพิเศษ'], 
        color: '#10b981' 
      },
    ];

    return (
      <div style={styles.menuContainer}>
        <h2 style={{...styles.title, fontSize: '32px'}}>เลือกนักสู้ของคุณ</h2>
        <div style={styles.charactersGrid}>
          {characters.map((char) => (
            <div
              key={char.id}
              style={{
                ...styles.charCard,
                ...(hoveredChar === char.id ? {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows.lg,
                  borderColor: char.color,
                } : {}),
              }}
              onClick={() => onSelect(char.id)}
              onMouseEnter={() => setHoveredChar(char.id)}
              onMouseLeave={() => setHoveredChar(null)}
            >
              <span style={styles.charEmoji}>{char.emoji}</span>
              <div style={styles.charName}>{char.name}</div>
              <div style={styles.charStats}>
                {char.stats.map((stat, index) => (
                  <div key={index}>{stat}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const Monster = ({ monster, onClick }) => {
    const [isHovered, setIsHovered] = useState(false);

    const monsterStyle = {
      ...styles.monster,
      top: monster.y,
      left: monster.x,
      ...(isHovered ? styles.monsterHover : {}),
      ...(monster.frozen ? styles.monsterFrozen : {}),
      ...(monster.poisoned ? styles.monsterPoisoned : {}),
    };

    return (
      <div
        style={monsterStyle}
        onClick={() => onClick(monster.id)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <span>{monster.type || '👾'}</span>
        <div style={styles.healthBar}>
          <div style={styles.healthFill((monster.health / monster.maxHealth) * 100)}></div>
        </div>
      </div>
    );
  };

  const Boss = ({ boss, onClick }) => {
    const bossStyle = {
      ...styles.boss,
      ...(boss.rage ? styles.bossRage : {}),
    };

    return (
      <div style={bossStyle} onClick={onClick}>
        <span>{boss.type || '👹'}</span>
        <div style={styles.bossHealthBar}>
          <div style={styles.bossHealthText}>
            BOSS {((boss.health / boss.maxHealth) * 100).toFixed(0)}%
          </div>
          <div style={styles.healthFill((boss.health / boss.maxHealth) * 100)}></div>
        </div>
      </div>
    );
  };

  const SkillIcon = ({ skill, onClick }) => {
    const skillStyle = {
      ...styles.skillIcon,
      ...(skill.ready ? styles.skillReady : styles.skillCooldown),
    };

    return (
      <div
        style={skillStyle}
        onClick={skill.ready ? onClick : undefined}
        title={skill.name}
      >
        <span>{skill.icon}</span>
      </div>
    );
  };

  const GameOverScreen = ({ score, time, level, achievements, onRestart, onViewLeaderboard }) => {
    const [name, setName] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (name.trim() === '' || submitting) return;
      setSubmitting(true);
      setError(null);
      try {
        const { error: insertError } = await supabase
          .from('leaderboard')
          .insert([{ 
              name: name.trim(), 
              score, 
              level, 
              played_at: new Date().toISOString() 
          }]);
        if (insertError) throw insertError;
        setSubmitted(true);
      } catch (error) {
        console.error('Error saving score to Supabase:', error.message);
        setError('ไม่สามารถบันทึกคะแนนได้ โปรดลองอีกครั้ง');
      } finally {
        setSubmitting(false);
      }
    };

    return (
      <div style={styles.gameOverContainer}>
        {submitted ? (
          <>
            <div style={styles.title}>🎉 บันทึกคะแนนแล้ว!</div>
            <p style={styles.subtitle}>ขอบคุณที่ร่วมสนุก ไว้เจอกันใหม่นะ!</p>
            <div style={{display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center'}}>
                <StyledButton onClick={onViewLeaderboard}>🏆 ดูอันดับคะแนน</StyledButton>
                <a onClick={onRestart} style={styles.restartLink}>🏠 กลับไปหน้าเมนู</a>
            </div>
          </>
        ) : (
          <>
            <div style={{...styles.title, fontSize: '28px'}}>💀 การผจญภัยสิ้นสุดลง</div>
            <div style={styles.scoreDisplay}>{score.toLocaleString()}</div>
            <div style={styles.timeDisplay}>
              เวลาที่ใช้: {time} วินาที | เลเวล: {level} | รางวัล: {achievements.length}
            </div>
            
            <form onSubmit={handleSubmit} style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
              <div style={styles.inputContainer}>
                <input
                  style={styles.input}
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="ใส่ชื่อของคุณ"
                  disabled={submitting}
                />
                <StyledButton type="submit" disabled={submitting || name.trim() === ''}>
                  {submitting ? 'กำลังส่ง...' : '📝 ส่งคะแนน'}
                </StyledButton>
              </div>
            </form>
            {error && <p style={{ color: theme.colors.danger, marginTop: '-8px', marginBottom: '16px' }}>{error}</p>}
            <a onClick={onRestart} style={styles.restartLink}>
              เล่นอีกครั้งโดยไม่ส่งคะแนน
            </a>
          </>
        )}
      </div>
    );
  };
  
  // --- Leaderboard Component (NEW) ---
  const LeaderboardScreen = ({ onBack }) => {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            setLoading(true);
            try {
                const { data, error: fetchError } = await supabase
                    .from('leaderboard')
                    .select('name, score, level')
                    .order('score', { ascending: false })
                    .limit(10);

                if (fetchError) throw fetchError;
                
                setLeaderboard(data);
            } catch (err) {
                console.error("Error fetching leaderboard: ", err.message);
                setError("ไม่สามารถโหลดข้อมูลอันดับได้");
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, []);

    return (
        <div style={styles.leaderboardContainer}>
            <h2 style={{...styles.title, fontSize: '32px'}}>🏆 อันดับผู้เล่นสูงสุด</h2>
            
            {loading && <p style={styles.subtitle}>กำลังโหลดข้อมูล...</p>}
            {error && <p style={{...styles.subtitle, color: theme.colors.danger}}>{error}</p>}
            
            {!loading && !error && (
                <ul style={styles.leaderboardList}>
                    {leaderboard.map((player, index) => (
                        <li key={index} style={styles.leaderboardItem}>
                            <span style={styles.leaderboardRank}>#{index + 1}</span>
                            <span style={styles.leaderboardName}>{player.name}</span>
                            <span style={styles.leaderboardScore}>{player.score.toLocaleString()} pts</span>
                        </li>
                    ))}
                </ul>
            )}
            
            <StyledButton onClick={onBack} style={{marginTop: 'auto'}}>
                ⬅️ กลับหน้าเมนู
            </StyledButton>
        </div>
    );
  };


  // --- Main Game Component ---
  const CatClickerGame = () => {
    const [character, setCharacter] = useState(null);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(0);
    const [gameTime, setGameTime] = useState(0);
    const [gameState, setGameState] = useState('menu'); // menu, selection, playing, gameover, leaderboard
    const [monsters, setMonsters] = useState([]);
    const [boss, setBoss] = useState(null);
    const [scoreMultiplier, setScoreMultiplier] = useState({ value: 1, text: '' });
    const [isCatClicked, setIsCatClicked] = useState(false);
    const [floatingScores, setFloatingScores] = useState([]);
    const [level, setLevel] = useState(1);
    const [experience, setExperience] = useState(0);
    const [comboCount, setComboCount] = useState(0);
    const [comboTimer, setComboTimer] = useState(0);
    const [skills, setSkills] = useState({
      freeze: { ready: true, cooldown: 0, icon: '❄️', name: 'Freeze' },
      poison: { ready: true, cooldown: 0, icon: '☠️', name: 'Poison' },
      heal: { ready: true, cooldown: 0, icon: '💚', name: 'Heal' },
      rage: { ready: true, cooldown: 0, icon: '😡', name: 'Rage' },
    });
    const [achievements, setAchievements] = useState([]);
    const [shockwaves, setShockwaves] = useState([]);
    const [catState, setCatState] = useState('normal');

    const CHAR_STATS = {
      A: { scorePerClick: 1.25, health: 5, itemChance: 0, criticalChance: 0.15, shield: 0 },
      B: { scorePerClick: 1, health: 9, itemChance: 0, criticalChance: 0.05, shield: 0.3 },
      C: { scorePerClick: 1, health: 7, itemChance: 0.40, criticalChance: 0.10, shield: 0 },
    };

    const EXP_PER_LEVEL = 100;
    const COMBO_TIME_LIMIT = 2000; // 2 seconds

    const handleStartGame = () => setGameState('selection');
    
    const handleSelectCharacter = (char) => {
      setCharacter(char);
      setLives(CHAR_STATS[char].health);
      setGameState('playing');
    };

    const restartGame = () => {
      setCharacter(null);
      setScore(0);
      setLives(0);
      setGameTime(0);
      setMonsters([]);
      setBoss(null);
      setScoreMultiplier({ value: 1, text: '' });
      setFloatingScores([]);
      setLevel(1);
      setExperience(0);
      setComboCount(0);
      setComboTimer(0);
      setSkills({
        freeze: { ready: true, cooldown: 0, icon: '❄️', name: 'Freeze' },
        poison: { ready: true, cooldown: 0, icon: '☠️', name: 'Poison' },
        heal: { ready: true, cooldown: 0, icon: '💚', name: 'Heal' },
        rage: { ready: true, cooldown: 0, icon: '😡', name: 'Rage' },
      });
      setAchievements([]);
      setShockwaves([]);
      setCatState('normal');
      setGameState('menu');
    };

    const createFloatingText = (text, x = '50%', y = '50%', type = 'normal') => {
      const id = Date.now() + Math.random();
      let style = styles.floatingScore;
      
      if (type === 'critical') {
        style = styles.floatingCritical;
      } else if (type === 'combo') {
        style = styles.floatingCombo;
      } else if (type === 'item') {
        style = { ...styles.floatingScore, color: theme.colors.warning, fontSize: '28px' };
      }
      
      setFloatingScores(current => [...current, { id, text, x, y, style }]);
      setTimeout(() => {
        setFloatingScores(current => current.filter(s => s.id !== id));
      }, 1200);
    };

    const createShockwave = (x = '50%', y = '50%') => {
      const id = Date.now() + Math.random();
      setShockwaves(current => [...current, { id, x, y }]);
      setTimeout(() => {
        setShockwaves(current => current.filter(s => s.id !== id));
      }, 800);
    };

    const addExperience = (amount) => {
      setExperience(prev => {
        const newExp = prev + amount;
        const expNeeded = level * EXP_PER_LEVEL;
        
        if (newExp >= expNeeded) {
          setLevel(l => l + 1);
          createFloatingText('LEVEL UP!', '50%', '30%', 'item');
          setCatState('levelUp');
          setTimeout(() => setCatState('normal'), 500);
          return newExp - expNeeded;
        }
        return newExp;
      });
    };

    const checkAchievements = (newScore) => {
      const achievementList = [
        { id: 'first_click', name: 'คลิกแรก!', condition: () => newScore >= 1 },
        { id: 'score_100', name: 'ร้อยแรก!', condition: () => newScore >= 100 },
        { id: 'score_1000', name: 'พันแรก!', condition: () => newScore >= 1000 },
        { id: 'combo_10', name: 'คอมโบ 10!', condition: () => comboCount >= 10 },
        { id: 'level_5', name: 'เลเวล 5!', condition: () => level >= 5 },
        { id: 'survive_5min', name: 'รอดครบ 5 นาที!', condition: () => gameTime >= 300 },
      ];

      achievementList.forEach(achievement => {
        if (!achievements.find(a => a.id === achievement.id) && achievement.condition()) {
          setAchievements(prev => [...prev, achievement]);
          createFloatingText(`🏆 ${achievement.name}`, '75%', '25%', 'item');
        }
      });
    };

    const handleCatClick = () => {
      const isCritical = Math.random() < CHAR_STATS[character].criticalChance;
      const basePoints = CHAR_STATS[character].scorePerClick;
      const comboMultiplier = Math.min(1 + (comboCount * 0.1), 3);
      const levelMultiplier = 1 + (level - 1) * 0.1;
      
      let earnedScore = basePoints * scoreMultiplier.value * comboMultiplier * levelMultiplier;
      
      if (isCritical) {
        earnedScore *= 2;
        createFloatingText(`CRITICAL! +${Math.floor(earnedScore)}`, '50%', '45%', 'critical');
        setCatState('critical');
        createShockwave();
      } else if (comboCount >= 5) {
        createFloatingText(`COMBO x${comboCount}! +${Math.floor(earnedScore)}`, '50%', '45%', 'combo');
        setCatState('combo');
      } else {
        createFloatingText(`+${Math.floor(earnedScore)}`);
      }

      const finalScore = Math.floor(earnedScore);
      setScore(prev => {
        const newScore = prev + finalScore;
        checkAchievements(newScore);
        return newScore;
      });

      // Combo system
      setComboCount(prev => prev + 1);
      setComboTimer(COMBO_TIME_LIMIT);

      // Experience gain
      addExperience(isCritical ? 3 : 1);

      setIsCatClicked(true);
      setTimeout(() => {
        setIsCatClicked(false);
        setCatState('normal');
      }, 200);
    };

    const handleMonsterClick = (id) => {
      setMonsters(mons => mons.map(m => {
        if (m.id === id) {
          const damage = level + (character === 'A' ? 2 : 1);
          const newHealth = m.health - damage;
          
          if (newHealth <= 0) {
            handleItemDrop(m.x, m.y);
            addExperience(5);
            setScore(s => s + m.scoreReward);
            createFloatingText(`+${m.scoreReward}`, m.x, m.y);
            return null;
          }
          return { ...m, health: newHealth };
        }
        return m;
      }).filter(Boolean));
    };

    const handleBossClick = () => {
      setBoss(b => {
        if (!b) return null;
        const damage = level * 2 + (character === 'A' ? 3 : 2);
        const newHealth = b.health - damage;
        
        if (newHealth <= 0) {
          const bossReward = 500 * level;
          setScore(s => s + bossReward);
          addExperience(50);
          
          const roll = Math.random();
          if (roll < 0.05) { 
            setScoreMultiplier({ value: 8, text: 'SCORE x8!' });
            createFloatingText('⚡ SCORE x8!', '50%', '40%', 'item');
            setTimeout(() => setScoreMultiplier({ value: 1, text: '' }), 8000);
          } else if (roll < 0.30) {
            setScoreMultiplier({ value: 2, text: 'SCORE x2!' });
            createFloatingText('⚡ SCORE x2!', '50%', '40%', 'item');
            setTimeout(() => setScoreMultiplier({ value: 1, text: '' }), 5000);
          } else if (roll < 0.70) { 
            const maxHealth = CHAR_STATS[character].health;
            if (lives < maxHealth) {
              setLives(l => Math.min(l + 2, maxHealth));
              createFloatingText('❤️❤️ +2', '50%', '40%', 'item');
            } else {
              // ถ้าเลือดเต็มแล้ว ให้คะแนนแทน
              setScore(s => s + 100);
              createFloatingText('+100 โบนัส!', '50%', '40%', 'item');
            }
          }
          
          createShockwave();
          return null;
        }
        
        // Boss becomes enraged at 30% health
        const rageThreshold = b.maxHealth * 0.3;
        return { 
          ...b, 
          health: newHealth,
          rage: newHealth <= rageThreshold
        };
      });
    };

    const handleItemDrop = (x, y) => {
      const roll = Math.random();
      const characterBonus = character === 'C' ? CHAR_STATS.C.itemChance : 0;
      
      if (roll <= 0.40 + characterBonus) {
        if (Math.random() < 0.5) {
          const maxHealth = CHAR_STATS[character].health;
          if (lives < maxHealth) {
            setLives(l => Math.min(l + 1, maxHealth));
            createFloatingText('❤️', x, y, 'item');
          } else {
            // ถ้าเลือดเต็มแล้ว ให้คะแนนแทน
            setScore(s => s + 20);
            createFloatingText('+20', x, y, 'item');
          }
        } else {
          setScoreMultiplier({ value: 3, text: 'SCORE x3!' });
          createFloatingText('⚡ x3', x, y, 'item');
          setTimeout(() => setScoreMultiplier({ value: 1, text: '' }), 4000);
        }
      }
    };

    const useSkill = (skillName) => {
      if (!skills[skillName].ready) return;

      switch (skillName) {
        case 'freeze':
          setMonsters(mons => mons.map(m => ({ ...m, frozen: true })));
          setTimeout(() => {
            setMonsters(mons => mons.map(m => ({ ...m, frozen: false })));
          }, 3000);
          setSkills(s => ({ ...s, freeze: { ...s.freeze, ready: false, cooldown: 15 } }));
          createFloatingText('❄️ FREEZE!', '20%', '80%', 'item');
          break;
          
        case 'poison':
          setMonsters(mons => mons.map(m => ({ 
            ...m, 
            poisoned: true,
            health: Math.max(1, m.health - 2)
          })));
          setTimeout(() => {
            setMonsters(mons => mons.map(m => ({ ...m, poisoned: false })));
          }, 5000);
          setSkills(s => ({ ...s, poison: { ...s.poison, ready: false, cooldown: 20 } }));
          createFloatingText('☠️ POISON!', '20%', '70%', 'item');
          break;
          
        case 'heal':
          const maxHealth = CHAR_STATS[character].health;
          const healAmount = Math.min(3, maxHealth - lives);
          if (healAmount > 0) {
            setLives(l => l + healAmount);
            setSkills(s => ({ ...s, heal: { ...s.heal, ready: false, cooldown: 25 } }));
            createFloatingText(`💚 HEAL +${healAmount}!`, '20%', '60%', 'item');
          } else {
            // ถ้าเลือดเต็มแล้ว ไม่ใช้สกิล
            createFloatingText('💚 เลือดเต็มแล้ว!', '20%', '60%', 'item');
          }
          break;
          
        case 'rage':
          setScoreMultiplier({ value: 5, text: 'RAGE MODE!' });
          setTimeout(() => setScoreMultiplier({ value: 1, text: '' }), 6000);
          setSkills(s => ({ ...s, rage: { ...s.rage, ready: false, cooldown: 30 } }));
          createFloatingText('😡 RAGE!', '20%', '50%', 'item');
          break;
      }
    };

    const monsterAttack = useCallback(() => {
      if (monsters.length > 0) {
        const frozenMonsters = monsters.filter(m => m.frozen).length;
        const activeMonsters = monsters.length - frozenMonsters;
        const damage = Math.max(1, activeMonsters);
        const shieldReduction = character === 'B' ? CHAR_STATS.B.shield : 0;
        const finalDamage = Math.max(1, Math.floor(damage * (1 - shieldReduction)));
        
        setLives(l => l - finalDamage);
        if (finalDamage < damage) {
          createFloatingText(`🛡️ -${finalDamage}`, '50%', '20%', 'item');
        }
      }
    }, [monsters, character]);

    // Game timer and combo timer
    useEffect(() => {
      if (gameState !== 'playing') return;
      const timer = setInterval(() => {
        setGameTime(t => t + 1);
        setComboTimer(prev => {
          if (prev <= 0) {
            setComboCount(0);
            return 0;
          }
          return prev - 100;
        });
      }, 100);
      return () => clearInterval(timer);
    }, [gameState]);

    // Skill cooldowns
    useEffect(() => {
      if (gameState !== 'playing') return;
      const cooldownTimer = setInterval(() => {
        setSkills(s => {
          const newSkills = { ...s };
          Object.keys(newSkills).forEach(skill => {
            if (newSkills[skill].cooldown > 0) {
              newSkills[skill].cooldown -= 1;
              if (newSkills[skill].cooldown <= 0) {
                newSkills[skill].ready = true;
              }
            }
          });
          return newSkills;
        });
      }, 1000);
      return () => clearInterval(cooldownTimer);
    }, [gameState]);

    // Monster spawning with variety
    useEffect(() => {
      if (gameState !== 'playing') return;
      const monsterInterval = setInterval(() => {
        if (boss) return;
        
        const spawnRate = Math.max(15000 - (level * 1000), 8000);
        const num = Math.floor(Math.random() * 2) + 1 + Math.floor(level / 3);
        
        const monsterTypes = ['👾', '🤖', '👻', '🧟', '👽'];
        
        const newMonsters = Array.from({ length: num }, (_, i) => {
          const baseHealth = Math.floor(Math.random() * 3) + 4 + level;
          const monsterType = monsterTypes[Math.floor(Math.random() * monsterTypes.length)];
          return {
            id: Date.now() + i,
            health: baseHealth,
            maxHealth: baseHealth,
            x: `${Math.random() * 70 + 15}%`,
            y: `${Math.random() * 50 + 25}%`,
            type: monsterType,
            scoreReward: Math.floor(10 + (level * 2)),
            frozen: false,
            poisoned: false,
          };
        });
        setMonsters(m => [...m, ...newMonsters]);
      }, Math.max(20000 - (level * 1500), 10000));

      // Boss spawning with variety
      const bossInterval = setInterval(() => {
        const bossTypes = ['👹', '🐉', '👺', '🦹', '👿'];
        const bossType = bossTypes[Math.floor(Math.random() * bossTypes.length)];
        const bossHealth = 150 + (level * 50);
        
        setBoss({ 
          health: bossHealth,
          maxHealth: bossHealth,
          type: bossType,
          rage: false
        });
        setMonsters([]);
      }, Math.max(90000 - (level * 5000), 60000));

      return () => {
        clearInterval(monsterInterval);
        clearInterval(bossInterval);
      };
    }, [gameState, boss, level]);

    // Monster attacks
    useEffect(() => {
      if (gameState !== 'playing' || monsters.length === 0) return;
      const attackInterval = setInterval(monsterAttack, Math.max(8000 - (level * 200), 5000));
      return () => clearInterval(attackInterval);
    }, [gameState, monsters, monsterAttack, level]);

    // Game over check
    useEffect(() => {
      if (lives <= 0 && gameState === 'playing') {
        setGameState('gameover');
      }
    }, [lives, gameState]);

    const renderContent = () => {
      switch (gameState) {
        case 'menu':
          return <MainMenu onStartGame={handleStartGame} onShowLeaderboard={() => setGameState('leaderboard')} />;
        case 'selection':
          return <CharacterSelection onSelect={handleSelectCharacter} />;
        case 'leaderboard':
          return <LeaderboardScreen onBack={() => setGameState('menu')} />;
        case 'gameover':
          return <GameOverScreen 
            score={score} 
            time={gameTime} 
            level={level}
            achievements={achievements}
            onRestart={restartGame}
            onViewLeaderboard={() => setGameState('leaderboard')}
          />;
        case 'playing':
        default:
          return (
            <div style={styles.gameBoard}>
              <div style={styles.statsBar}>
                <div style={styles.statItem}>
                  <span>📊</span>
                  <span>{score.toLocaleString()}</span>
                </div>
                <div style={styles.statItem}>
                  <span>{'❤️'.repeat(Math.max(0, Math.min(lives, 10)))}</span>
                  {lives > 10 && <span> +{lives - 10}</span>}
                </div>
                <div style={styles.statItem}>
                  <span>⏱️</span>
                  <span>{gameTime}s</span>
                </div>
                <div style={styles.statItem}>
                  <span>⭐</span>
                  <span>Lv.{level}</span>
                </div>
                {comboCount > 1 && (
                  <div style={{...styles.statItem, ...styles.buff}}>
                    <span>🔥</span>
                    <span>Combo x{comboCount}</span>
                  </div>
                )}
                {scoreMultiplier.value > 1 && (
                  <div style={{...styles.statItem, ...styles.buff}}>
                    <span>⚡</span>
                    <span>{scoreMultiplier.text}</span>
                  </div>
                )}
              </div>
              
              <div style={styles.gameArea}>
                {/* Achievement notifications */}
                {achievements.length > 0 && (
                  <div style={styles.achievementNotification}>
                    🏆 รางวัล: {achievements[achievements.length - 1]?.name}
                  </div>
                )}

                {/* Shockwave effects */}
                {shockwaves.map(wave => (
                  <div key={wave.id} style={{
                    ...styles.shockwave,
                    top: wave.y,
                    left: wave.x,
                  }}></div>
                ))}

                {/* Floating scores */}
                {floatingScores.map(s => (
                  <div key={s.id} style={{ ...s.style, top: s.y, left: s.x }}>
                    {s.text}
                  </div>
                ))}

                {/* Cat */}
                <div
                  style={{
                    ...styles.catContainer,
                    ...(isCatClicked ? styles.catActive : {}),
                    ...(catState === 'critical' ? styles.catCritical : {}),
                    ...(catState === 'combo' ? styles.catCombo : {}),
                    ...(catState === 'levelUp' ? { animation: 'levelUp 0.5s ease-in-out' } : {}),
                  }}
                  onClick={handleCatClick}
                >
                  <span>🐱</span>
                </div>
                
                {/* Monsters */}
                {monsters.map(m => (
                  <Monster key={m.id} monster={m} onClick={handleMonsterClick} />
                ))}
                
                {/* Boss */}
                {boss && <Boss boss={boss} onClick={handleBossClick} />}

                {/* Skills */}
                <div style={styles.skillsContainer}>
                  {Object.entries(skills).map(([skillName, skill]) => (
                    <SkillIcon 
                      key={skillName}
                      skill={skill}
                      onClick={() => useSkill(skillName)}
                    />
                  ))}
                </div>
              </div>

              {/* Level progress bar */}
              <div style={styles.levelBar}>
                <div style={styles.levelProgress(
                  (experience / (level * EXP_PER_LEVEL)) * 100
                )}></div>
              </div>
            </div>
          );
      }
    };

    return (
      <>
        <GlobalStyles />
        <div style={{ paddingTop: '20px', display: 'flex', justifyContent: 'center' }}>
          <div style={styles.gameContainer}>
            {renderContent()}
          </div>
        </div>
      </>
    );
  };

  export default CatClickerGame;