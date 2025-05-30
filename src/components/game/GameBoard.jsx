import React, { useState, useEffect, useCallback, useRef } from 'react';
import Card from './Card';
import { supabase } from '../../pages/supabaseClient'; // << ตรวจสอบ path ให้ถูกต้อง

// --- รูปภาพและโลโก้ ---
import logoImage from "../../assets/imgs/blackneko-icon.png";
import card_A_img from "../../assets/game/1.png";
import card_B_img from "../../assets/game/2.png";
import card_C_img from "../../assets/game/3.png";
import card_D_img from "../../assets/game/4.png";
import card_E_img from "../../assets/game/5.png";
import card_F_img from "../../assets/game/6.png";
import card_G_img from "../../assets/game/7.png";
import card_H_img from "../../assets/game/8.png";
import card_I_img from "../../assets/game/9.png";
import card_J_img from "../../assets/game/10.png";

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
  const [hasSavedThisGame, setHasSavedThisGame] = useState(false); // << **เพิ่ม State นี้**

  const timerRef = useRef(null);
  const numberOfPairs = 10;

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (session?.user) {
        setCurrentUser(session.user);
        console.log("[Auth] Current user session found:", session.user);
      } else {
        console.log("[Auth] No active session or user.");
        if (error) {
          console.error("[Auth] Error getting session:", error);
        }
      }
    };
    fetchCurrentUser();
  }, []);

  const loadDbScores = useCallback(async () => {
    setLoadingScores(true);
    console.log("[loadDbScores] Initiating score loading (No profiles join)...");
    try {
      console.log("[loadDbScores] Querying 'game_scores' table (No profiles join)...");
      const { data, error, status, count } = await supabase
        .from('game_scores')
        .select('player_name, score, time_seconds, achieved_at, user_id', { count: 'exact' })
        .order('score', { ascending: true })
        .order('time_seconds', { ascending: true })
        .limit(MAX_SCORES);

      console.log(`[loadDbScores - No Join] Supabase Response --- Status: ${status}, Count (matched rows before limit): ${count}`);
      console.log("[loadDbScores - No Join] Supabase Data (raw):", JSON.stringify(data, null, 2));
      console.log("[loadDbScores - No Join] Supabase Error (if any):", JSON.stringify(error, null, 2));

      if (error && status !== 406 && status !== 200 && status !== 206) {
        console.error('[loadDbScores - No Join] Throwing error due to Supabase error object:', error);
        throw error;
      }

      if (!data || data.length === 0) {
        console.log('[loadDbScores - No Join] No data returned or data array is empty. Setting scores to empty array.');
        setScores([]);
      } else {
        const formattedScores = data.map(s => {
          let nameToDisplay = s.player_name;
          if (!nameToDisplay && s.user_id) {
            nameToDisplay = `User (${s.user_id.substring(0, 6)})`;
          }
          if (!nameToDisplay) {
            nameToDisplay = "ผู้เล่นนิรนาม";
          }
          return {
            name: nameToDisplay,
            score: s.score,
            time: formatTime(s.time_seconds),
            date: s.achieved_at ? new Date(s.achieved_at).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric'}) : 'N/A',
          };
        });
        console.log("[loadDbScores - No Join] Formatted scores:", formattedScores);
        setScores(formattedScores);
      }
    } catch (err) {
      console.error("[loadDbScores - No Join] Error caught in try-catch block:", err);
      setScores([]);
    } finally {
      setLoadingScores(false);
      console.log("[loadDbScores - No Join] Score loading attempt finished.");
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
    setHasSavedThisGame(false); // << **รีเซ็ต Flag เมื่อเริ่มเกมใหม่**
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

  // --- ฟังก์ชันบันทึกคะแนนลง Supabase (ปรับปรุง) ---
  const saveScoreToDb = useCallback(async (currentMoves, currentTime) => {
    if (hasSavedThisGame) { // << **ตรวจสอบ Flag ก่อน**
      console.warn("[saveScoreToDb] Score has already been saved for this game. Aborting.");
      return;
    }
    setHasSavedThisGame(true); // << **ตั้ง Flag ทันทีว่ากำลังจะบันทึก (หรือบันทึกแล้ว)**

    if (!currentUser) {
      console.warn("[saveScoreToDb] User not logged in. Score will not be saved to DB.");
      alert("คุณต้องเข้าสู่ระบบเพื่อบันทึกคะแนน!");
      // พิจารณาว่าจะ setHasSavedThisGame(false) หรือไม่ถ้า user ไม่ได้ login
      // ในกรณีนี้ ให้ถือว่าจบเกมแล้ว และความพยายามบันทึกได้เกิดขึ้นแล้ว แม้จะไม่สำเร็จ
      return;
    }

    const scorePlayerName = playerName.trim() || currentUser.email?.split('@')[0] || "ผู้เล่นนิรนาม";
    const newScoreEntry = {
      user_id: currentUser.id,
      score: currentMoves, // ใช้ currentMoves ที่ส่งเข้ามา
      time_seconds: currentTime, // ใช้ currentTime ที่ส่งเข้ามา
      player_name: scorePlayerName,
    };

    console.log("[saveScoreToDb] Attempting to save score:", newScoreEntry);
    try {
      const { error } = await supabase.from('game_scores').insert([newScoreEntry]);
      if (error) {
        console.error("[saveScoreToDb] Error saving score to database:", error);
        setHasSavedThisGame(false); // << **ถ้าเกิด Error ในการบันทึก อาจจะอนุญาตให้ลองอีกครั้ง? (พิจารณาตาม Flow เกม)**
                                   // หรือปล่อยให้เป็น true เพื่อไม่ให้บันทึกซ้ำอัตโนมัติ
        throw error;
      }
      alert(`บันทึกคะแนนของคุณ (${scorePlayerName}) เรียบร้อยแล้ว!`);
      console.log("[saveScoreToDb] Score saved successfully.");
    } catch (error) {
      alert(`เกิดข้อผิดพลาดในการบันทึกคะแนน: ${error.message}`);
      // ถ้า Error และต้องการให้ผู้ใช้ลองบันทึกอีก อาจจะต้องมี UI ให้ผู้ใช้กด หรือ setHasSavedThisGame(false)
    }
  }, [currentUser, playerName, supabase, hasSavedThisGame, setHasSavedThisGame]); // เพิ่ม dependency ที่เกี่ยวข้อง


  const checkForMatch = useCallback((currentFlipped) => {
    const [card1, card2] = currentFlipped;
    if (card1.type === card2.type) {
      const currentTotalMoves = moves + 1; // คำนวณ moves สำหรับการบันทึก ณ จุดนี้
      const currentTimeElapsed = timeElapsed; // เก็บเวลา ณ จุดนี้

      setMatchedPairs(prev => {
        const newMatched = [...prev, card1.type];
        // เพิ่มการตรวจสอบ gameState !== 'gameOver' เพื่อป้องกันการเรียกซ้ำซ้อน
        if (newMatched.length === numberOfPairs && gameState !== 'gameOver') {
            console.log("[checkForMatch] Game over condition met. Current moves for saving:", currentTotalMoves);
            setGameState('gameOver');
            // ส่ง currentTotalMoves และ currentTimeElapsed ที่คำนวณไว้
            setTimeout(() => saveScoreToDb(currentTotalMoves, currentTimeElapsed), 500);
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
  }, [cards, moves, timeElapsed, numberOfPairs, gameState, saveScoreToDb]); // เพิ่ม gameState และ saveScoreToDb ใน dependencies

  const handleCardClick = (clickedCardId) => {
    if (flippedCards.length === 2 || gameState !== 'playing') return; // Guard ป้องกันการคลิกเมื่อไม่ใช่ตาเล่น หรือเปิดครบแล้ว
    const cardToFlip = cards.find(card => card.cardId === clickedCardId);
    if (!cardToFlip || cardToFlip.isFlipped || cardToFlip.isMatched) return;

    const newCards = cards.map(card =>
      card.cardId === clickedCardId ? { ...card, isFlipped: true } : card
    );
    setCards(newCards);

    const newFlippedCards = [...flippedCards, cardToFlip];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setMoves(prevMoves => prevMoves + 1); // อัปเดต moves ทันที
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
      console.log("[MenuAction] Scoreboard button clicked. Calling loadDbScores...");
      loadDbScores();
      setShowScoreboard(true);
    }
  };

  // ----- Render ส่วนต่างๆ (ส่วน renderMenu, renderRulesModal, renderScoreboardModal, renderPlayingGame, renderGameOver จะเหมือนเดิม) -----
  const renderMenu = () => (
    <div className="w-full max-w-md sm:max-w-lg mx-auto text-center p-8 sm:p-12 bg-white shadow-2xl rounded-xl border border-gray-200">
      <img src={logoImage} alt="Memory Game Logo" className="mx-auto mb-8 sm:mb-10 h-24 sm:h-28 drop-shadow-md"/>
      <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-gray-800 tracking-tight">
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
      <div className="space-y-5 sm:space-y-6">
        <button onClick={() => handleMenuAction('start')} className="group w-full flex items-center justify-center px-6 py-4 bg-black text-white text-xl sm:text-2xl rounded-lg hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-400 shadow-md"><IconPlay />เริ่มเกม</button>
        <button onClick={() => handleMenuAction('rules')} className="group w-full flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-700 text-lg sm:text-xl rounded-lg hover:bg-gray-200 hover:text-black transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-300 border border-gray-300 shadow-sm"><IconRules />วิธีเล่น</button>
        <button onClick={() => handleMenuAction('scoreboard')} className="group w-full flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-700 text-lg sm:text-xl rounded-lg hover:bg-gray-200 hover:text-black transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-300 border border-gray-300 shadow-sm"><IconScoreboard />Scoreboard</button>
      </div>
      <p className="mt-10 text-xs text-gray-400">&copy; {new Date().getFullYear()} Memory Game Deluxe</p>
    </div>
  );

  const renderRulesModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-2xl max-w-lg w-full">
        <h2 className="text-3xl font-semibold mb-6 text-black">วิธีเล่น</h2>
        <ul className="list-disc list-inside space-y-2 text-left text-gray-700 mb-6">
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
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-2xl max-w-lg w-full min-h-[300px]">
        <h2 className="text-3xl font-semibold mb-6 text-black">Scoreboard (Top {MAX_SCORES})</h2>
        {loadingScores ? (
          <p className="text-gray-600 text-center">กำลังโหลดคะแนน...</p>
        ) : scores.length > 0 ? (
          <ol className="list-none space-y-3 text-gray-700 mb-6">
            {scores.map((score, index) => (
              <li key={index} className="text-lg border-b border-gray-200 pb-3">
                <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-gray-800 truncate max-w-[60%]">{index + 1}. {score.name || "ผู้เล่นนิรนาม"}</span>
                    <span className="text-sm text-gray-500 whitespace-nowrap">{score.date}</span>
                </div>
                <div className="text-sm flex flex-col sm:flex-row sm:justify-start sm:items-center">
                    <span className="mr-3">Moves: <span className="font-medium">{score.score}</span></span>
                    {score.time && <span>Time: <span className="font-medium">{score.time}</span></span>}
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-gray-600 mb-6 text-center">ยังไม่มีคะแนนบันทึกไว้ หรือไม่สามารถโหลดได้</p>
        )}
        <button onClick={() => setShowScoreboard(false)} className="w-full mt-auto sm:w-auto px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors">ปิด</button>
      </div>
    </div>
  );

  const renderPlayingGame = () => (
    <div className="flex flex-col items-center w-full">
      <div className="w-full max-w-xl flex flex-col sm:flex-row justify-between items-center mb-6 p-4 bg-white shadow rounded-lg space-y-3 sm:space-y-0">
        <div className="text-center sm:text-left"><p className="text-lg font-semibold text-black">จำนวนครั้งที่เปิด:</p><p className="text-3xl text-gray-800 font-mono">{moves}</p></div>
        <div className="text-center sm:text-right"><p className="text-lg font-semibold text-black">เวลา:</p><p className="text-3xl text-gray-800 font-mono">{formatTime(timeElapsed)}</p></div>
      </div>
      <div className={`grid gap-3 justify-center ${ numberOfPairs <= 6 ? 'grid-cols-3' : numberOfPairs <= 8 ? 'grid-cols-4' : numberOfPairs <= 12 ? 'grid-cols-4 sm:grid-cols-5' : 'grid-cols-5 md:grid-cols-6' }`}>
        {cards.map((card) => ( <Card key={card.cardId} id={card.cardId} image={card.image} isFlipped={card.isFlipped} isMatched={card.isMatched} onClick={handleCardClick}/>))}
      </div>
      <div className="mt-8 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 w-full max-w-xs sm:max-w-sm">
        <button onClick={initializeGame} className="w-full px-6 py-3 bg-gray-800 text-white text-lg rounded-lg hover:bg-gray-700 transition-colors shadow-md">เริ่มเกมใหม่</button>
        <button onClick={handleReturnToMenu} className="w-full px-6 py-3 bg-yellow-500 text-black text-lg rounded-lg hover:bg-yellow-600 transition-colors shadow-md">กลับไปเมนูหลัก</button>
      </div>
    </div>
  );

  const renderGameOver = () => (
    <div className="text-center p-8 bg-white shadow-xl rounded-lg animate-fadeIn">
      <h2 className="text-4xl font-bold text-black mb-4">ยินดีด้วย! คุณชนะแล้ว!</h2>
      <p className="text-2xl text-gray-700 mb-1">คุณใช้ไปทั้งหมด <span className="font-bold text-gray-900">{moves}</span> ครั้ง</p>
      <p className="text-2xl text-gray-700 mb-6">ใช้เวลา: <span className="font-bold text-gray-900">{formatTime(timeElapsed)}</span></p>
      {currentUser && (
        <div className="my-6 max-w-sm mx-auto">
            <label htmlFor="playerName" className="block text-lg text-gray-600 mb-2">ป้อนชื่อสำหรับ Scoreboard (ถ้าไม่ใส่จะใช้ชื่อจาก Email):</label>
            <input type="text" id="playerName" value={playerName} onChange={(e) => setPlayerName(e.target.value)} placeholder="ชื่อผู้เล่น" className="px-4 py-3 border border-gray-400 rounded-lg shadow-sm focus:ring-black focus:border-black w-full text-lg"/>
        </div>
      )}
      {!currentUser && (
        <p className="text-red-500 my-4">คุณต้องเข้าสู่ระบบเพื่อบันทึกคะแนนนี้</p>
      )}
      <div className="space-y-3 md:space-y-0 md:flex md:justify-center md:space-x-4">
        <button onClick={initializeGame} className="w-full md:w-auto px-8 py-3 bg-black text-white text-lg rounded-lg hover:bg-gray-800 transition-colors shadow-md">เล่นอีกครั้ง</button>
        <button onClick={() => { setGameState('menu'); setPlayerName('');}} className="w-full md:w-auto px-8 py-3 bg-gray-600 text-white text-lg rounded-lg hover:bg-gray-500 transition-colors shadow-md">กลับไปเมนูหลัก</button>
      </div>
    </div>
  );


  return (
    <div className="w-full max-w-5xl mx-auto pt-8 sm:pt-12 px-2">
      {showRules && renderRulesModal()}
      {showScoreboard && renderScoreboardModal()}

      {gameState === 'menu' && !showRules && !showScoreboard && renderMenu()}
      {gameState === 'playing' && renderPlayingGame()}
      {gameState === 'gameOver' && renderGameOver()}
    </div>
  );
}

export default GameBoard;