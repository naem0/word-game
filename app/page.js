'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [word, setWord] = useState('');
  const [lastWord, setLastWord] = useState('hello');
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [timeLeft, setTimeLeft] = useState(10);
  const [scores, setScores] = useState({ player1: 0, player2: 0 });
  const [wordHistory, setWordHistory] = useState([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === 1) {
          switchTurn();
          return 10;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [currentPlayer]);

  const switchTurn = () => {
    setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
    setWord('');
  };

  const handleGame = async () => {
    try {
      const response = await fetch('https://word-game-server-fawn.vercel.app/game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word: word, lastWord: lastWord }),
      });
      const data = await response.json();

      if (data.error) {
        alert(data.message);
        setScores((prev) => ({
          ...prev,
          [currentPlayer === 1 ? 'player1' : 'player2']: prev[currentPlayer === 1 ? 'player1' : 'player2'] - 1,
        }));
      } else {
        setLastWord(data.word);
        setWordHistory([...wordHistory, data.word]);
        setScores((prev) => ({
          ...prev,
          [currentPlayer === 1 ? 'player1' : 'player2']: prev[currentPlayer === 1 ? 'player1' : 'player2'] + 1,
        }));
      }
      switchTurn();
      setTimeLeft(10);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Shiritori Game</h1>
      <div className="flex gap-6">
        {/* Player 1 Card */}
        <div className={`max-w-sm p-6 bg-white border rounded-lg shadow ${currentPlayer === 1 ? 'border-blue-500' : 'opacity-50'}`}>
          <h5 className="text-2xl font-bold mb-2">Player 1</h5>
          <p className="mb-2 text-sm">Your Word (Start with: {lastWord.charAt(lastWord.length - 1)})</p>
          <input
            type="text"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            disabled={currentPlayer !== 1}
            className="w-full p-2 border rounded-lg mb-3"
          />
          <button
            onClick={handleGame}
            disabled={currentPlayer !== 1}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
          >
            Submit
          </button>
          <p className="mt-2 text-sm">Score: {scores.player1}</p>
          <p className="mt-2 text-sm">Time Left: {currentPlayer === 1 ? timeLeft : '-'}</p>
        </div>
        
        {/* Player 2 Card */}
        <div className={`max-w-sm p-6 bg-white border rounded-lg shadow ${currentPlayer === 2 ? 'border-green-500' : 'opacity-50'}`}>
          <h5 className="text-2xl font-bold mb-2">Player 2</h5>
          <p className="mb-2 text-sm">Your Word (Start with: {lastWord.charAt(lastWord.length - 1)})</p>
          <input
            type="text"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            disabled={currentPlayer !== 2}
            className="w-full p-2 border rounded-lg mb-3"
          />
          <button
            onClick={handleGame}
            disabled={currentPlayer !== 2}
            className="px-4 py-2 bg-green-500 text-white rounded-lg disabled:opacity-50"
          >
            Submit
          </button>
          <p className="mt-2 text-sm">Score: {scores.player2}</p>
          <p className="mt-2 text-sm">Time Left: {currentPlayer === 2 ? timeLeft : '-'}</p>
        </div>
      </div>
      
      {/* Word History */}
      <div className="mt-6 w-full max-w-lg">
        <h2 className="text-xl font-bold mb-3">Word History</h2>
        <div className="p-4 bg-white border rounded-lg shadow">
          {wordHistory.length > 0 ? (
            <ul className="list-disc pl-5">
              {wordHistory.map((word, index) => (
                <li key={index} className="text-gray-700">{word}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No words entered yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
