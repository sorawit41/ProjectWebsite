// --- File: src/components/game/GameBoard.js ---

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Card from './Card';
import { supabase } from '../../pages/supabaseClient'; // << ตรวจสอบ path ให้ถูกต้อง

// --- รูปภาพและโลโก้ ---
import logoImage from "../../assets/imgs/blackneko-icon.png";
import card_A_img from "../../assets/game/blightpink.png";
import card_B_img from "../../assets/game/blue.png";
import card_C_img from "../../assets/game/yellow.png";
import card_D_img from "../../assets/game/yellow_low.png";
import card_E_img from "../../assets/game/green.png";
import card_F_img from "../../assets/game/mintgreen.png";
import card_G_img from "../../assets/game/mint.png";
import card_H_img from "../../assets/game/orange.png";
import card_I_img from "../../assets/game/purple.png";
import card_J_img from "../../assets/game/pink.png";

const initialImagePool = [
  { type: 'A', image: card_A_img }, { type: 'B', image: card_B_img },
  { type: 'C', image: card_C_img }, { type: 'D', image: card_D_img },
  { type: 'E', image: card_E_img }, { type: 'F', image: card_F_img },
  { type: 'G', image: card_G_img }, { type: 'H', image: card_H_img },
  { type: 'I', image: card_I_img }, { type: 'J', image: card_J_img },
];
// --- สิ้นสุดส่วนรูปภาพ ---

const shuffleArray = (array) => {
  const newArray = array.slice();
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};
const MAX_SCORES = 5;

const formatTime = (totalSeconds) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const IconPlay = () => <span role="img" aria-label="play" className="mr-2 text-xl">🎮</span>;
const IconRules = () => <span role="img" aria-label="rules" className="mr-2 text-xl">❓</span>;
const IconScoreboard = () => <span role="img" aria-label="scoreboard" className="mr-2 text-xl">🏆</span>;

function GameBoard() {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameState, setGameState] = useState('menu');
  const [showRules, setShowRules] = useState(false);
  const [showScoreboard, setShowScoreboard] = useState(false);
  const [scores, setScores] = useState([]);
  const [playerName, setPlayerName] = useState('');
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingScores, setLoadingScores] = useState(false);
  const [hasSavedThisGame, setHasSavedThisGame] = useState(false);

  const timerRef = useRef(null);
  const numberOfPairs = 10;

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (session?.user) {
        setCurrentUser(session.user);
      }
      if (error) {
        console.error("[Auth] Error getting session:", error);
      }
    };
    fetchCurrentUser();
  }, []);

  const loadDbScores = useCallback(async () => {
    setLoadingScores(true);
    try {
      const { data, error, status } = await supabase
        .from('game_scores')
        .select('player_name, score, time_seconds, achieved_at, user_id')
        .order('score', { ascending: true })
        .order('time_seconds', { ascending: true })
        .limit(MAX_SCORES);

      if (error && status !== 406) throw error;

      if (data) {
        const formattedScores = data.map(s => {
          let nameToDisplay = s.player_name || `User (${s.user_id?.substring(0, 6)})` || "ผู้เล่นนิรนาม";
          return {
            name: nameToDisplay,
            score: s.score,
            time: formatTime(s.time_seconds),
            date: s.achieved_at ? new Date(s.achieved_at).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric'}) : 'N/A',
          };
        });
        setScores(formattedScores);
      }
    } catch (err) {
      console.error("[loadDbScores] Error:", err);
      setScores([]);
    } finally {
      setLoadingScores(false);
    }
  }, []);


  useEffect(() => {
    if (gameState === 'playing') {
      setTimeElapsed(0);
      timerRef.current = setInterval(() => {
        setTimeElapsed(prevTime => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [gameState]);

  const initializeGame = useCallback(() => {
    setHasSavedThisGame(false);
    const availableImages = initialImagePool.length >= numberOfPairs ?
                            shuffleArray([...initialImagePool]).slice(0, numberOfPairs) :
                            shuffleArray([...initialImagePool]);
    const gameCards = availableImages.flatMap((img, index) => [
      { ...img, cardId: `card-${img.type}-${index}-a`, isFlipped: false, isMatched: false },
      { ...img, cardId: `card-${img.type}-${index}-b`, isFlipped: false, isMatched: false }
    ]);
    setCards(shuffleArray(gameCards));
    setFlippedCards([]);
    setMatchedPairs([]);
    setMoves(0);
    setGameState('playing');
    setShowRules(false);
    setShowScoreboard(false);
  }, [numberOfPairs]);

  const saveScoreToDb = useCallback(async (currentMoves, currentTime) => {
    if (hasSavedThisGame) return;
    setHasSavedThisGame(true);

    if (!currentUser) {
      console.warn("User not logged in. Score will not be saved.");
      return;
    }

    const scorePlayerName = playerName.trim() || currentUser.email?.split('@')[0] || "ผู้เล่นนิรนาม";
    const newScoreEntry = {
      user_id: currentUser.id,
      score: currentMoves,
      time_seconds: currentTime,
      player_name: scorePlayerName,
    };

    try {
      const { error } = await supabase.from('game_scores').insert([newScoreEntry]);
      if (error) throw error;
      alert(`บันทึกคะแนนของคุณ (${scorePlayerName}) เรียบร้อยแล้ว!`);
    } catch (error) {
      alert(`เกิดข้อผิดพลาดในการบันทึกคะแนน: ${error.message}`);
    }
  }, [currentUser, playerName, hasSavedThisGame]);


  const checkForMatch = useCallback((currentFlipped) => {
    const [card1, card2] = currentFlipped;
    if (card1.type === card2.type) {
      setMatchedPairs(prev => {
        const newMatched = [...prev, card1.type];
        if (newMatched.length === numberOfPairs) {
            setGameState('gameOver');
            setTimeout(() => saveScoreToDb(moves + 1, timeElapsed), 500);
        }
        return newMatched;
      });
      const updatedCards = cards.map(card =>
        card.type === card1.type ? { ...card, isMatched: true, isFlipped: true } : card
      );
      setCards(updatedCards);
      setFlippedCards([]);
    } else {
      setTimeout(() => {
        const resetCards = cards.map(card =>
          (card.cardId === card1.cardId || card.cardId === card2.cardId) && !card.isMatched
            ? { ...card, isFlipped: false }
            : card
        );
        setCards(resetCards);
        setFlippedCards([]);
      }, 1200);
    }
  }, [cards, moves, timeElapsed, numberOfPairs, saveScoreToDb]);

  const handleCardClick = (clickedCardId) => {
    if (flippedCards.length === 2 || gameState !== 'playing') return;
    const cardToFlip = cards.find(card => card.cardId === clickedCardId);
    if (!cardToFlip || cardToFlip.isFlipped || cardToFlip.isMatched) return;

    const newCards = cards.map(card =>
      card.cardId === clickedCardId ? { ...card, isFlipped: true } : card
    );
    setCards(newCards);

    const newFlippedCards = [...flippedCards, cardToFlip];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setMoves(prevMoves => prevMoves + 1);
      checkForMatch(newFlippedCards);
    }
  };

  const handleReturnToMenu = () => {setGameState('menu');};

  const handleMenuAction = (action) => {
    setShowRules(false);
    setShowScoreboard(false);
    if (action === 'start') initializeGame();
    else if (action === 'rules') setShowRules(true);
    else if (action === 'scoreboard') {
      loadDbScores();
      setShowScoreboard(true);
    }
  };

  // ----- Render ส่วนต่างๆ (ปรับปรุงให้ Responsive) -----
  const renderMenu = () => (
    // ลด padding บนจอมือถือ (p-4) และเพิ่มเมื่อจอใหญ่ขึ้น (sm:p-8)
    <div className="w-full max-w-md mx-auto text-center p-4 sm:p-12 bg-white shadow-2xl rounded-xl border border-gray-200">
      {/* ปรับขนาดโลโก้ตามหน้าจอ */}
      <img src={logoImage} alt="Memory Game Logo" className="mx-auto mb-6 sm:mb-10 h-20 sm:h-28 drop-shadow-md"/>
      {/* ปรับขนาดฟอนต์หัวข้อตามหน้าจอ */}
      <h1 className="text-3xl sm:text-5xl font-bold mb-4 sm:mb-6 text-gray-800 tracking-tight">
        เกมจับคู่<span className="text-black">ท้าความจำ</span>
      </h1>
      {currentUser ? (
        <p className="text-sm text-gray-600 mb-6">
          ยินดีต้อนรับ, <span className="font-semibold">{currentUser.email?.split('@')[0] || currentUser.id.substring(0,8)}</span>!
        </p>
      ) : (
        <p className="text-sm text-red-500 mb-6">
          คุณยังไม่ได้เข้าสู่ระบบ (คะแนนจะไม่ถูกบันทึกออนไลน์)
        </p>
      )}
      {/* ปรับขนาดปุ่มและฟอนต์ */}
      <div className="space-y-4 sm:space-y-6">
        <button onClick={() => handleMenuAction('start')} className="group w-full flex items-center justify-center px-5 py-3 sm:px-6 sm:py-4 bg-black text-white text-lg sm:text-2xl rounded-lg hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-400 shadow-md"><IconPlay />เริ่มเกม</button>
        <button onClick={() => handleMenuAction('rules')} className="group w-full flex items-center justify-center px-5 py-2.5 sm:px-6 sm:py-3 bg-gray-100 text-gray-700 text-base sm:text-xl rounded-lg hover:bg-gray-200 hover:text-black transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-300 border border-gray-300 shadow-sm"><IconRules />วิธีเล่น</button>
        <button onClick={() => handleMenuAction('scoreboard')} className="group w-full flex items-center justify-center px-5 py-2.5 sm:px-6 sm:py-3 bg-gray-100 text-gray-700 text-base sm:text-xl rounded-lg hover:bg-gray-200 hover:text-black transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-300 border border-gray-300 shadow-sm"><IconScoreboard />Scoreboard</button>
      </div>
      <p className="mt-8 sm:mt-10 text-xs text-gray-400">&copy; {new Date().getFullYear()} Memory Game Deluxe</p>
    </div>
  );

  const renderRulesModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 animate-fadeIn">
      {/* ปรับ padding และขนาดฟอนต์ */}
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-2xl max-w-lg w-full">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-4 sm:mb-6 text-black">วิธีเล่น</h2>
        <ul className="list-disc list-inside space-y-2 text-left text-sm sm:text-base text-gray-700 mb-6">
          <li>คลิกการ์ดเพื่อเปิดดูรูปภาพ</li>
          <li>พยายามจดจำตำแหน่งของรูปภาพต่างๆ</li>
          <li>เปิดการ์ดให้ได้ 2 ใบที่มีรูปภาพเหมือนกันเพื่อจับคู่</li>
          <li>เมื่อจับคู่ได้ การ์ดคู่นั้นจะยังคงเปิดอยู่</li>
          <li>หากเปิดการ์ด 2 ใบแล้วรูปไม่เหมือนกัน การ์ดจะพลิกกลับ</li>
          <li>พยายามจับคู่การ์ดทั้งหมดโดยใช้จำนวนครั้งการเปิดและเวลาน้อยที่สุด!</li>
        </ul>
        <button onClick={() => setShowRules(false)} className="w-full sm:w-auto px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors">ปิด</button>
      </div>
    </div>
  );

  const renderScoreboardModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 animate-fadeIn">
      {/* ปรับ padding และขนาดฟอนต์ */}
      <div className="bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-2xl max-w-lg w-full min-h-[400px] flex flex-col">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-4 sm:mb-6 text-black text-center">Scoreboard (Top {MAX_SCORES})</h2>
        <div className="flex-grow overflow-y-auto pr-2">
            {loadingScores ? (
            <p className="text-gray-600 text-center">กำลังโหลดคะแนน...</p>
            ) : scores.length > 0 ? (
            <ol className="list-none space-y-3 text-gray-700">
                {scores.map((score, index) => (
                <li key={index} className="text-base sm:text-lg border-b border-gray-200 pb-3">
                    <div className="flex justify-between items-start mb-1 gap-2">
                        <span className="font-semibold text-gray-800 truncate flex-shrink">{index + 1}. {score.name}</span>
                        <span className="text-xs sm:text-sm text-gray-500 whitespace-nowrap flex-shrink-0">{score.date}</span>
                    </div>
                    <div className="text-xs sm:text-sm flex flex-wrap sm:flex-nowrap gap-x-3 gap-y-1">
                        <span>Moves: <span className="font-medium">{score.score}</span></span>
                        {score.time && <span>Time: <span className="font-medium">{score.time}</span></span>}
                    </div>
                </li>
                ))}
            </ol>
            ) : (
            <p className="text-gray-600 text-center">ยังไม่มีคะแนนบันทึกไว้</p>
            )}
        </div>
        <button onClick={() => setShowScoreboard(false)} className="w-full mt-4 sm:w-auto px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors self-center">ปิด</button>
      </div>
    </div>
  );

  const renderPlayingGame = () => (
    <div className="flex flex-col items-center w-full">
      {/* ปรับ Layout ของแถบ Status (Moves, Time) */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-4 sm:mb-6 p-3 sm:p-4 bg-white shadow rounded-lg">
        <div className="text-center">
            <p className="text-sm sm:text-lg font-semibold text-black">MOVES</p>
            <p className="text-2xl sm:text-3xl text-gray-800 font-mono">{moves}</p>
        </div>
        <div className="text-center">
            <p className="text-sm sm:text-lg font-semibold text-black">TIME</p>
            <p className="text-2xl sm:text-3xl text-gray-800 font-mono">{formatTime(timeElapsed)}</p>
        </div>
      </div>
      {/* ปรับ Grid ของการ์ดให้เปลี่ยนจำนวนคอลัมน์ตามขนาดจอ */}
      {/* For 10 pairs (20 cards) -> 4x5 on mobile, 5x4 on larger screens */}
      <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 sm:gap-3 w-full max-w-4xl">
        {cards.map((card) => ( <Card key={card.cardId} id={card.cardId} image={card.image} isFlipped={card.isFlipped} isMatched={card.isMatched} onClick={handleCardClick}/>))}
      </div>
      {/* ปรับ Layout ปุ่มให้เป็นแนวตั้งบนมือถือและแนวนอนบนจอใหญ่ */}
      <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 w-full max-w-xs sm:max-w-sm">
        <button onClick={initializeGame} className="w-full px-6 py-3 bg-gray-800 text-white text-lg rounded-lg hover:bg-gray-700 transition-colors shadow-md">เริ่มเกมใหม่</button>
        <button onClick={handleReturnToMenu} className="w-full px-6 py-3 bg-yellow-500 text-black text-lg rounded-lg hover:bg-yellow-600 transition-colors shadow-md">กลับไปเมนูหลัก</button>
      </div>
    </div>
  );

  const renderGameOver = () => (
    // ปรับ padding, font size และ layout ปุ่ม
    <div className="text-center p-6 sm:p-8 bg-white shadow-xl rounded-lg animate-fadeIn w-full max-w-lg mx-auto">
      <h2 className="text-3xl sm:text-4xl font-bold text-black mb-3 sm:mb-4">ยินดีด้วย!</h2>
      <p className="text-xl sm:text-2xl text-gray-700 mb-1">คุณใช้ไปทั้งหมด <span className="font-bold text-gray-900">{moves}</span> ครั้ง</p>
      <p className="text-xl sm:text-2xl text-gray-700 mb-4 sm:mb-6">ใช้เวลา: <span className="font-bold text-gray-900">{formatTime(timeElapsed)}</span></p>
      {currentUser && (
        <div className="my-6 max-w-sm mx-auto">
            <label htmlFor="playerName" className="block text-lg text-gray-600 mb-2">ป้อนชื่อสำหรับ Scoreboard:</label>
            <input type="text" id="playerName" value={playerName} onChange={(e) => setPlayerName(e.target.value)} placeholder={currentUser.email?.split('@')[0] || "ชื่อผู้เล่น"} className="px-4 py-3 border border-gray-400 rounded-lg shadow-sm focus:ring-black focus:border-black w-full text-lg"/>
        </div>
      )}
      {!currentUser && (
        <p className="text-red-500 my-4">คุณต้องเข้าสู่ระบบเพื่อบันทึกคะแนนนี้</p>
      )}
      <div className="space-y-3 sm:space-y-0 sm:flex sm:justify-center sm:space-x-4">
        <button onClick={initializeGame} className="w-full sm:w-auto px-8 py-3 bg-black text-white text-lg rounded-lg hover:bg-gray-800 transition-colors shadow-md">เล่นอีกครั้ง</button>
        <button onClick={() => { setGameState('menu'); setPlayerName('');}} className="w-full sm:w-auto px-8 py-3 bg-gray-600 text-white text-lg rounded-lg hover:bg-gray-500 transition-colors shadow-md">กลับไปเมนูหลัก</button>
      </div>
    </div>
  );


  return (
    // ปรับ Padding หลักของ container
    <div className="w-full max-w-5xl mx-auto pt-4 sm:pt-8 md:pt-12 px-4 flex justify-center items-start min-h-screen">
      {showRules && renderRulesModal()}
      {showScoreboard && renderScoreboardModal()}

      {gameState === 'menu' && !showRules && !showScoreboard && renderMenu()}
      {gameState === 'playing' && renderPlayingGame()}
      {gameState === 'gameOver' && renderGameOver()}
    </div>
  );
}

export default GameBoard;