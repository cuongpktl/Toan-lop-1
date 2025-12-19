
import React from 'react';
import { MathProblem } from '../types';

interface Props {
  problem: MathProblem;
  onUpdate: (val: string) => void;
  showResult: boolean;
}

const WordProblemItem: React.FC<Props> = ({ problem, onUpdate, showResult }) => {
  const isCorrect = showResult && parseInt(problem.userAnswer || '') === problem.answer;
  const isWrong = showResult && !isCorrect;

  return (
    <div className={`p-6 sm:p-8 rounded-[32px] border-4 bg-white shadow-sm transition-all flex flex-col items-center gap-6 ${
      showResult ? (isCorrect ? 'border-green-400 bg-green-50' : 'border-red-400 bg-red-50') : 'border-yellow-100 hover:border-yellow-200'
    }`}>
      <p className="text-xl font-bold text-gray-700 leading-relaxed text-center italic">
        "{problem.question}"
      </p>
      
      <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 border-t border-gray-50 w-full justify-center">
        <span className="font-black text-gray-400 uppercase tracking-widest text-sm">Đáp án của bé:</span>
        <div className="relative">
          <input 
            type="number" 
            inputMode="numeric"
            value={problem.userAnswer || ''}
            onChange={(e) => onUpdate(e.target.value)}
            disabled={showResult}
            className={`w-28 text-center text-3xl font-black p-3 rounded-2xl border-4 outline-none transition-all ${
              showResult 
              ? (isCorrect ? 'text-green-600 border-green-300 bg-white' : 'text-red-500 border-red-300 bg-white') 
              : 'text-gray-800 border-gray-200 bg-gray-50 focus:border-yellow-400 focus:bg-white'
            }`}
            placeholder="?"
          />
          {isWrong && (
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-black shadow-lg whitespace-nowrap z-10 animate-bounce-short">
              Đúng là: {problem.answer}
            </div>
          )}
        </div>
      </div>
      
      {isCorrect && (
        <div className="text-green-600 font-black animate-fadeIn">
          🌟 Bé tuyệt vời quá! Đã giải đúng rồi!
        </div>
      )}
    </div>
  );
};

export default WordProblemItem;
