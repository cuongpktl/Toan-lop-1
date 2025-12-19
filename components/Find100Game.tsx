
import React, { useState, useEffect } from 'react';
import { MathProblem } from '../types';
import { generateFind10Problems } from '../services/mathUtils';
import { audioService } from '../services/audioService';
import { RefreshIcon, StarIcon } from './icons';

const Find100Game: React.FC = () => {
  const [problems, setProblems] = useState<MathProblem[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const initGame = () => {
    audioService.play('click');
    setProblems(generateFind10Problems(8));
    setSelectedIds([]);
    setScore(0);
    setRevealed(false);
  };

  useEffect(() => {
    initGame();
  }, []);

  const toggleSelect = (id: string) => {
    if (revealed) return;
    audioService.play('click');
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
    );
  };

  const checkGame = () => {
    let correctCount = 0;
    const targets = problems.filter(p => p.isCorrect);
    
    selectedIds.forEach(id => {
      const p = problems.find(prob => prob.id === id);
      if (p && p.isCorrect) {
        correctCount++;
      } else if (p && !p.isCorrect) {
        // Option: subtract for wrong choices? User didn't specify, 
        // usually in kids apps we just count correct targets identified.
      }
    });

    const isGood = correctCount === targets.length && selectedIds.length === targets.length;
    
    if (isGood) {
        audioService.play('success');
    } else {
        audioService.play(correctCount > 0 ? 'correct' : 'wrong');
    }

    setScore(correctCount);
    setRevealed(true);
  };

  const totalTargets = problems.filter(p => p.isCorrect).length;
  const calculatedScore10 = totalTargets > 0 ? (10 / totalTargets) * score : 0;
  // Ensure score doesn't go negative if we add penalty (not currently added)
  const finalScore = Math.max(0, calculatedScore10);
  const displayScore = finalScore % 1 === 0 ? finalScore : finalScore.toFixed(1);

  return (
    <div className="max-w-4xl mx-auto px-2 no-select relative">
      {revealed && (
        <div className="fixed top-2 left-1/2 -translate-x-1/2 sm:static sm:translate-x-0 sm:mb-4 z-[100] animate-bounce-short">
          <div className="w-20 h-20 sm:w-28 sm:h-28 bg-white border-4 border-green-500 rounded-full shadow-2xl flex flex-col items-center justify-center mx-auto">
            <span className="text-[10px] font-black text-gray-400 uppercase leading-none">Điểm</span>
            <span className="text-xl sm:text-3xl font-black text-red-600">{displayScore}</span>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 bg-white p-5 rounded-3xl shadow-sm border border-gray-100 gap-4">
        <div className="text-center sm:text-left">
            <h2 className="text-xl font-extrabold text-gray-800">Tìm Phép Tính = 10</h2>
            <p className="text-gray-500 text-sm">Chỉ chọn những thẻ có tổng bằng 10</p>
        </div>
        <div className="flex items-center gap-4">
            <button onClick={initGame} className="p-3 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-100">
                <RefreshIcon className="w-5 h-5" />
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {problems.map(p => {
            const isSelected = selectedIds.includes(p.id);
            const isCorrectTarget = p.isCorrect;
            
            let cardStyle = "bg-white border-gray-100 hover:border-indigo-300";
            if (revealed) {
                if (isCorrectTarget) {
                    cardStyle = isSelected ? "bg-green-100 border-green-500 ring-4 ring-green-100" : "bg-white border-green-200 border-dashed opacity-70"; 
                } else {
                    cardStyle = isSelected ? "bg-red-100 border-red-500" : "bg-gray-50 border-transparent opacity-40";
                }
            } else {
                if (isSelected) cardStyle = "bg-indigo-50 border-indigo-500 ring-4 ring-indigo-100 scale-105 z-10";
            }

            return (
                <button
                    key={p.id}
                    onClick={() => toggleSelect(p.id)}
                    className={`h-24 sm:h-28 rounded-2xl border-2 flex items-center justify-center text-2xl font-black transition-all shadow-md active:scale-95 ${cardStyle}`}
                >
                    {p.numbers?.[0]} + {p.numbers?.[1]}
                </button>
            )
        })}
      </div>

      <div className="mt-12 text-center pb-10">
          {!revealed ? (
            <button 
                onClick={checkGame}
                disabled={selectedIds.length === 0}
                className="w-full sm:w-auto px-12 py-4 bg-indigo-600 text-white text-lg font-black rounded-2xl shadow-xl hover:bg-indigo-700 disabled:opacity-50 disabled:shadow-none transition-all active:scale-95"
            >
                Kiểm Tra Kết Quả
            </button>
          ) : (
            <div className="text-gray-600 font-bold text-lg animate-fadeIn">
                {score === totalTargets ? "Bé giỏi quá! 🥳" : "Cố gắng hơn lần sau nhé! 💪"}
                <button onClick={initGame} className="block mx-auto mt-4 text-indigo-600 underline">Chơi lại ván mới</button>
            </div>
          )}
      </div>
    </div>
  );
};

export default Find100Game;
