import React, { useState, useEffect } from 'react';
import { supabase } from '../../pages/supabaseClient';
import Confetti from 'react-confetti';
import Ami from './assets/ami.png';
import Ayumi from './assets/ayumi.png';
import marin from './assets/marin.png';
import moolek from './assets/mooklek.png';
import poka from './assets/poka.png';
import Rosalyn from './assets/Rosalyn.png';
import yuki from './assets/yuki.png';
import Logo from './assets/logo.png';
import backcard from './assets/backcard.png';

// --- Card Images ---
const initialImages = [
  { src: Ami },
  { src: Ayumi },
  { src: marin },
  { src: moolek },
  { src: poka },
  { src: Rosalyn },
  { src: yuki },
  { src: Logo},
];

/* --- CSS Styles (Mobile-Responsive & Enhanced Animations) --- */
const GameStyles = () => (
  <style>{`
    .py-20 {
      padding-top: 120px;
      padding-bottom: 5rem;
    }

    .card-game-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-family: 'Kanit', sans-serif; /* ✅ Font Changed */
      background: linear-gradient(to top, #e6e9f0 0%, #eef1f5 100%);
      color: #333;
      min-height: 100vh;
      width: 100%;
      padding: 2rem;
      box-sizing: border-box;
      text-align: center;
      border: 4px solid #333;
      border-radius: 15px;      
    }

    .game-logo {
      width: 130px;
      height: auto;
      margin-bottom: 1.5rem;
      object-fit: contain;
    }

    .game-title {
      font-size: 2.2rem;
      color: #764ba2;
      text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
      margin-bottom: 1rem;
    }

    .game-stats {
      font-size: 1.1rem;
      margin-bottom: 2rem;
      background-color: #ffffff;
      padding: 0.5rem 1.5rem;
      border-radius: 20px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.07);
      border: 1px solid #e0e0e0;
      color: #000;
    }

    .game-stats span {
      font-weight: bold;
      font-size: 1.4rem;
      color: #667eea;
    }

    .card-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;
      width: 100%;
      max-width: 500px;
      perspective: 1000px;
      justify-content: center;
    }

    .card {
      aspect-ratio: 4 / 5;
      cursor: pointer;
      position: relative;
      transform-style: preserve-3d;
      transition: transform 0.6s;
    }
    
    .card:not(.flipped):not(.matched):hover {
        transform: translateY(-8px);
        transition: transform 0.3s ease;
    }

    .card.shake {
      animation: shake 0.5s ease-in-out;
    }

    .card.flipped {
      transform: rotateY(180deg);
    }

    .card.matched {
      transform: scale(0.9);
      opacity: 0.5;
      cursor: default;
      transition: opacity 0.5s ease, transform 0.5s ease;
    }

    .card-inner {
      position: absolute;
      width: 100%;
      height: 100%;
      transition: transform 0.6s, box-shadow 0.3s;
      transform-style: preserve-3d;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
      border-radius: 15px; 
    }
    
    .card:hover .card-inner {
       box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
    }

    .card-front,
    .card-back {
      position: absolute;
      width: 100%;
      height: 100%;
      backface-visibility: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 15px;
      overflow: hidden;
      border: 3px solid #e0e0e0;
      transition: border-color 0.3s;
    }

    .card-front {
      background: #fff;
    }

    .card-back {
      background: #f9f9f9;
      transform: rotateY(180deg);
    }
    
    .card.correct .card-back,
    .card.correct .card-front {
       animation: border-pulse-green 0.8s forwards;
    }
    
    .card.incorrect .card-back,
    .card.incorrect .card-front {
       animation: border-pulse-red 0.8s forwards;
    }

    .card-front img,
    .card-back img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .win-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(5px);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
      padding: 1rem;
      animation: fadeIn 0.5s ease;
    }
    
    .win-modal {
      background: linear-gradient(145deg, #ffffff, #f9f9ff);
      color: #333;
      padding: 2rem;
      border-radius: 20px;
      text-align: center;
      box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
      transform: scale(0.7);
      animation: popIn 0.5s 0.1s ease-out forwards;
      width: 100%;
      max-width: 450px;
      border-top: 5px solid #764ba2;
    }
    
    .win-modal h2 {
      color: #764ba2;
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }
    
    .win-modal p {
      margin-bottom: 1.5rem;
      font-size: 1.1rem;
      color: #000;
    }

    .score-summary {
      background-color: #f4f0ff;
      border-radius: 10px;
      padding: 1rem;
      margin: 1.5rem auto;
      display: inline-block;
      text-align: left;
      border-left: 4px solid #667eea;
    }
    
    .score-summary p {
      margin: 0.5rem 0;
      font-size: 1rem;
      color: #000;
    }
    
    .win-modal input[type="text"] {
      padding: 0.8rem 1rem;
      border-radius: 25px;
      border: 2px solid #ddd;
      width: 90%;
      font-family: 'Kanit', sans-serif; /* ✅ Font Changed */
      font-size: 1rem;
      transition: border-color 0.3s, box-shadow 0.3s;
    }
    
    .win-modal input[type="text"]:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
    }

    .button-group {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-top: 1.5rem;
        align-items: center;
    }

    .menu-button,
    .restart-button {
      background-color: #667eea;
      color: white;
      border: none;
      padding: 0.8rem 1.5rem;
      border-radius: 25px;
      font-size: 1rem;
      font-family: 'Kanit', sans-serif; /* ✅ Font Changed */
      cursor: pointer;
      transition: background-color 0.3s, transform 0.2s;
      width: 100%;
      max-width: 250px;
      box-shadow: 0 4px 10px rgba(102, 126, 234, 0.3);
    }

    .menu-button:hover,
    .restart-button:hover {
      background-color: #764ba2;
      transform: translateY(-3px);
    }
    
    .start-button {
      background-color: #ffd700;
      color: #764ba2;
      border: none;
      padding: 0.9rem 2.8rem;
      border-radius: 50px;
      font-size: 1.4rem;
      font-family: 'Kanit', sans-serif; /* ✅ Font Changed */
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 5px 15px rgba(0,0,0,0.1);
      max-width: 300px;
      width: 100%;
    }
    .start-button:hover {
        transform: scale(1.05);
        box-shadow: 0 8px 20px rgba(0,0,0,0.2);
    }

    .leaderboard-container {
      background-color: #ffffff;
      padding: 2rem;
      border-radius: 15px;
      width: 90%;
      max-width: 500px;
      box-shadow: 0 8px 16px rgba(0,0,0,0.1);
      text-align: center;
    }
    .leaderboard-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 1rem;
      color: #333;
    }
    .leaderboard-table th, .leaderboard-table td {
      padding: 0.75rem;
      text-align: left;
      border-bottom: 1px solid #eee;
    }
    .leaderboard-table th {
      background-color: #f9f9f9;
      color: #764ba2;
    }
    .leaderboard-table tr:hover {
      background-color: #f4f0ff;
    }

    .loading-screen {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 1.5rem;
        color: #764ba2;
    }
    .loading-logo {
        animation: pulse 1.5s infinite ease-in-out;
    }
    .animated-item {
        opacity: 0;
        animation: fadeInUp 0.5s ease-out forwards;
    }
    .delay-1 { animation-delay: 0.1s; }
    .delay-2 { animation-delay: 0.2s; }
    .delay-3 { animation-delay: 0.3s; }
    .delay-4 { animation-delay: 0.4s; }

    @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes popIn {
      from { transform: scale(0.7); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
    @keyframes shake {
        0%, 100% { transform: rotateY(0) translateX(0); }
        25% { transform: rotateY(0) translateX(-5px); }
        50% { transform: rotateY(0) translateX(5px); }
        75% { transform: rotateY(0) translateX(-5px); }
    }
    @keyframes border-pulse-green {
      0% { border-color: #4ade80; box-shadow: 0 0 10px #4ade80; }
      50% { border-color: #22c55e; box-shadow: 0 0 20px #22c55e; }
      100% { border-color: #e0e0e0; box-shadow: none; }
    }
    @keyframes border-pulse-red {
      0% { border-color: #f87171; box-shadow: 0 0 10px #f87171; }
      50% { border-color: #ef4444; box-shadow: 0 0 20px #ef4444; }
      100% { border-color: #e0e0e0; box-shadow: none; }
    }

    @media (max-width: 600px) {
      .py-20 {
        padding-top: 100px; 
        padding-bottom: 2rem;
      }
      .card-game-container {
        padding-left: 1rem;
        padding-right: 1rem;
        border-width: 3px; 
      }
      .game-logo {
        width: 100px;
        margin-bottom: 1rem;
      }
      .game-title { 
        font-size: 1.8rem;
      }
      .game-stats { 
        font-size: 1rem; 
        padding: 0.5rem 1rem;
      }
      .game-stats span { 
        font-size: 1.25rem; 
      }
      .card-grid {
        max-width: 100%;
        gap: 0.5rem;
      }
      .card {
        aspect-ratio: 4 / 5;
      }
      .win-modal { 
        padding: 1.5rem;
        padding-top: 2rem;
      }
       .win-modal h2 {
        font-size: 1.5rem;
      }
      .leaderboard-container { 
        padding: 1rem; 
      }
      .leaderboard-table th, .leaderboard-table td { 
        padding: 0.5rem; 
        font-size: 0.8rem;
      }
    }
  `}</style>
);

// ===================================================================
// --- 🃏 Component: CardGame ---
// ===================================================================
const CardGame = ({ onBackToMenu }) => {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [moves, setMoves] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGameWon, setIsGameWon] = useState(false);
  const [userId, setUserId] = useState(null);
  const [mismatchedCards, setMismatchedCards] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [gameTime, setGameTime] = useState(0);
  const [playerName, setPlayerName] = useState('');
  const [isScoreSaved, setIsScoreSaved] = useState(false);
  const [feedbackCards, setFeedbackCards] = useState({ correct: [], incorrect: [] });

  // ✅ NEW State for live timer
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
    };
    fetchUser();
    shuffleAndDealCards();
  }, []);
  
  // ✅ NEW Effect for running the timer
  useEffect(() => {
    if (startTime && !isGameWon) {
      const timer = setInterval(() => {
        setElapsedTime(Math.round((Date.now() - startTime) / 1000));
      }, 1000);
      return () => clearInterval(timer); // Cleanup timer on component unmount or win
    }
  }, [startTime, isGameWon]);


  useEffect(() => {
    if (initialImages.length > 0 && matchedPairs.length === initialImages.length) {
      const endTime = Date.now();
      const duration = Math.round((endTime - startTime) / 1000);
      setGameTime(duration);
      setIsGameWon(true);
    }
  }, [matchedPairs, startTime]);

  const shuffleAndDealCards = () => {
    setCards([]);
    setFlippedCards([]);
    setMatchedPairs([]);
    setMoves(0);
    setIsGameWon(false);
    setIsProcessing(false);
    setPlayerName('');
    setIsScoreSaved(false);
    setFeedbackCards({ correct: [], incorrect: [] });
    setElapsedTime(0); // Reset timer display

    const gameImages = [...initialImages, ...initialImages];
    for (let i = gameImages.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [gameImages[i], gameImages[j]] = [gameImages[j], gameImages[i]];
    }
    const initialCards = gameImages.map((imageObj, index) => ({
      id: index,
      image: imageObj.src,
      isFlipped: false,
      isMatched: false,
    }));
    setCards(initialCards);
    setStartTime(Date.now());
  };

  const handleCardClick = (clickedCard) => {
    if (isProcessing || clickedCard.isFlipped || clickedCard.isMatched || mismatchedCards.length > 0) return;

    const newCards = cards.map(card =>
      card.id === clickedCard.id ? { ...card, isFlipped: true } : card
    );
    setCards(newCards);

    const newFlippedCards = [...flippedCards, clickedCard];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setIsProcessing(true);
      setMoves(prev => prev + 1);
      checkForMatch(newFlippedCards);
    }
  };

  const checkForMatch = (flippedPair) => {
    const [firstCard, secondCard] = flippedPair;
    if (firstCard.image === secondCard.image) {
      setMatchedPairs(prev => [...prev, firstCard.image]);
      setFeedbackCards(prev => ({ ...prev, correct: [firstCard.id, secondCard.id] }));
      setTimeout(() => {
        setCards(prevCards => prevCards.map(card =>
            card.image === firstCard.image ? { ...card, isMatched: true } : card
        ));
        resetTurn();
      }, 800);
    } else {
      setMismatchedCards([firstCard.id, secondCard.id]);
      setFeedbackCards(prev => ({ ...prev, incorrect: [firstCard.id, secondCard.id] }));
      setTimeout(() => {
        const resetCards = cards.map(card =>
          (card.id === firstCard.id || card.id === secondCard.id)
            ? { ...card, isFlipped: false }
            : card
        );
        setCards(resetCards);
        setMismatchedCards([]);
        resetTurn();
      }, 1200);
    }
  };
  
  const resetTurn = () => {
    setFlippedCards([]);
    setIsProcessing(false);
    setFeedbackCards({ correct: [], incorrect: [] });
  };

  const restartGame = () => {
    setTimeout(shuffleAndDealCards, 300);
  };

  const handleSaveScore = async () => {
    if (!playerName.trim()) {
      alert('กรุณากรอกชื่อของคุณ');
      return;
    }
    
    const scoreData = {
      user_id: userId,
      player_name: playerName.trim(),
      score: moves,
      time_taken: gameTime,
      game_name: 'CardMatching',
      played_at: new Date().toISOString(),
    };

    const { data, error } = await supabase.from('scores').insert([scoreData]);
    
    if (error) {
      console.error('Error saving score:', error);
      alert('เกิดข้อผิดพลาดในการบันทึกคะแนน');
    } else {
      console.log('Score saved successfully:', data);
      setIsScoreSaved(true);
    }
  };

  return (
    <>
      {isGameWon && <Confetti />}

      <h1 className="game-title">✨ เกมจับคู่ภาพ ✨</h1>
      <div className="game-stats">
        <p>จำนวนครั้งที่เปิด: <span>{moves}</span></p>
        <p>เวลา: <span>{elapsedTime}</span> วินาที</p>
      </div>
      <div className="card-grid">
        {cards.map(card => {
          const isCorrect = feedbackCards.correct.includes(card.id);
          const isIncorrect = feedbackCards.incorrect.includes(card.id);
          const feedbackClass = isCorrect ? 'correct' : isIncorrect ? 'incorrect' : '';

          return (
            <div
              key={card.id}
              className={`card ${card.isFlipped || card.isMatched ? 'flipped' : ''} ${card.isMatched ? 'matched' : ''} ${mismatchedCards.includes(card.id) ? 'shake' : ''} ${feedbackClass}`}
              onClick={() => handleCardClick(card)}
            >
              <div className="card-inner">
                <div className="card-front">
                  <img src={backcard} alt="Card Cover" />
                </div>
                <div className="card-back">
                  <img src={card.image} alt="Card Face" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="button-group" style={{ marginTop: '2.5rem' }}>
        <button onClick={onBackToMenu} className="menu-button">
          กลับเมนูหลัก
        </button>
      </div>

      {isGameWon && (
        <div className="win-overlay">
          <div className="win-modal">
            {!isScoreSaved ? (
              <>
                <h2>🎉 ยินดีด้วย! 🎉</h2>
                <p>คุณชนะเกมนี้!</p>
                <div className="score-summary">
                    <p><strong>คะแนน:</strong> {moves} ครั้ง</p>
                    <p><strong>เวลาที่ใช้:</strong> {gameTime} วินาที</p>
                </div>
                <div>
                    <input
                        type="text"
                        placeholder="กรอกชื่อของคุณ"
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                    />
                </div>
                <div className="button-group">
                    <button onClick={handleSaveScore} className="restart-button">บันทึกคะแนน</button>
                </div>
              </>
            ) : (
              <>
                <h2>✅ บันทึกคะแนนแล้ว!</h2>
                <p>คุณสามารถดูอันดับของคุณได้ที่หน้า Leaderboard</p>
                <div className="button-group">
                    <button onClick={restartGame} className="restart-button">เล่นอีกครั้ง</button>
                    <button onClick={onBackToMenu} className="menu-button">กลับเมนูหลัก</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

// ===================================================================
// --- 🏆 Component: Leaderboard ---
// ===================================================================
const Leaderboard = ({ onBackToMenu }) => {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScores = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('scores')
        .select('player_name, score, time_taken, played_at')
        .eq('game_name', 'CardMatching')
        .order('score', { ascending: true })
        .order('time_taken', { ascending: true })
        .limit(10);

      if (error) {
        console.error("Error fetching scores:", error);
      } else {
        setScores(data);
      }
      setLoading(false);
    };

    fetchScores();
  }, []);

  return (
    <div className="leaderboard-container">
      <h1 className="game-title">🏆 อันดับผู้เล่น 🏆</h1>
      {loading ? (
        <p>กำลังโหลดข้อมูล...</p>
      ) : (
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>อันดับ</th>
              <th>ชื่อผู้เล่น</th>
              <th>คะแนน (ครั้ง)</th>
              <th>เวลา (วินาที)</th>
              <th>วันที่</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((score, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{score.player_name}</td>
                <td style={{ textAlign: 'center' }}>{score.score}</td>
                <td style={{ textAlign: 'center' }}>{score.time_taken}</td>
                <td style={{ textAlign: 'center' }}>
                  {new Date(score.played_at).toLocaleDateString("th-TH")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="button-group" style={{marginTop: '2rem'}}>
        <button onClick={onBackToMenu} className="menu-button">กลับเมนูหลัก</button>
      </div>
    </div>
  );
};

// ===================================================================
// --- Loading Screen Component ---
// ===================================================================
const LoadingScreen = () => {
    return (
        <div className="loading-screen">
            <img src={Logo} alt="Loading Logo" className="game-logo loading-logo" />
            <h2 className="game-title" style={{fontSize: '1.5rem'}}>กำลังสับไพ่...</h2>
        </div>
    );
};


// ===================================================================
// --- MenuScreen Component (with animations) ---
// ===================================================================
const MenuScreen = ({ onStartGame, onShowLeaderboard }) => {
    const [showHowToPlay, setShowHowToPlay] = useState(false);

    return (
        <>
           <img src={Logo} alt="Game Logo" className="game-logo animated-item delay-1" />
           <h1 className="game-title animated-item delay-2">ยินดีต้อนรับสู่เกมจับคู่</h1>
            <p style={{marginBottom: '2rem', fontSize: '1.2rem', color: '#555'}} className="animated-item delay-3">
                ทดสอบความจำของคุณ!
            </p>
            
            <div className="button-group animated-item delay-4">
                <button onClick={onStartGame} className="start-button">
                    🚀 เริ่มเกม!
                </button>
                <button onClick={onShowLeaderboard} className="menu-button">
                    🏆 ดูอันดับ
                </button>
                <button onClick={() => setShowHowToPlay(true)} className="menu-button">
                    📜 วิธีเล่น
                </button>
            </div>

            {showHowToPlay && (
                <div className="win-overlay" onClick={() => setShowHowToPlay(false)}>
                    <div className="win-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-content-left">
                           <h3>📜 วิธีเล่น</h3>
                           <p>
                               <strong>เป้าหมาย:</strong> เปิดการ์ดเพื่อหาคู่ภาพที่เหมือนกันทั้งหมด โดยใช้จำนวนครั้งในการเปิดให้น้อยที่สุด
                           </p>
                        </div>
                        <div className="button-group">
                            <button onClick={() => setShowHowToPlay(false)} className="restart-button">
                                เข้าใจแล้ว
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};


// ===================================================================
// --- Game (Main Controller with Loading State) ---
// ===================================================================
const Game = () => {
  const [gameState, setGameState] = useState('menu');

  const handleStartGame = () => {
    setGameState('loading');
    setTimeout(() => {
        setGameState('playing');
    }, 2000); // Show loading screen for 2 seconds
  };
  const handleBackToMenu = () => setGameState('menu');
  const handleShowLeaderboard = () => setGameState('leaderboard');

  const renderGameState = () => {
    switch (gameState) {
      case 'playing':
        return <CardGame onBackToMenu={handleBackToMenu} />;
      case 'leaderboard':
        return <Leaderboard onBackToMenu={handleBackToMenu} />;
      case 'loading':
        return <LoadingScreen />;
      case 'menu':
      default:
        return <MenuScreen onStartGame={handleStartGame} onShowLeaderboard={handleShowLeaderboard} />;
    }
  };

  return (
    <div className="card-game-container py-20">
      <GameStyles />
      {renderGameState()}
    </div>
  );
};

export default Game;