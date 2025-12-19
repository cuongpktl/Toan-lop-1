
import React from 'react';
import { MathProblem } from '../types';

interface Props {
  problem: MathProblem;
  onUpdate: (val: string) => void;
  showResult: boolean;
}

const DmMath: React.FC<Props> = ({ problem, onUpdate, showResult }) => {
  const isCorrect = showResult && parseInt(problem.userAnswer || '') === problem.answer;
  const isWrong = showResult && !isCorrect;

  // Xử lý chuỗi câu hỏi để bôi màu các đơn vị
  const formatQuestion = (q: string) => {
    const parts = q.split(' ');
    return parts.map((p, i) => {
      if (p === 'dm') return <span key={i} className="text-green-600 font-black ml-1">dm</span>;
      if (p === 'cm') return <span key={i} className="text-blue-600 font-black ml-1">cm</span>;
      if (p === '?' || p === '=') return <span key={i} className="mx-2 text-gray-400 font-black">{p}</span>;
      return <span key={i} className="font-mono text-2xl">{p}</span>;
    });
  };

  return (
    <div className={`p-6 rounded-3xl border-2 flex flex-col items-center justify-center bg-white shadow-sm transition-all duration-300 relative ${
        showResult ? (isCorrect ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50') : 'border-green-100 hover:border-green-300'
    }`}>
      <div className="text-2xl font-black text-gray-700 flex flex-wrap justify-center items-center mb-4">
        {formatQuestion(problem.question || '')}
      </div>

      <div className="relative flex items-center gap-2">
        <input 
          type="number" 
          inputMode="numeric"
          value={problem.userAnswer || ''}
          onChange={(e) => onUpdate(e.target.value)}
          disabled={showResult}
          className={`w-28 text-center text-3xl font-black p-3 rounded-2xl border-4 outline-none focus:ring-4 focus:ring-green-100 transition-all ${
              showResult 
              ? (isCorrect ? 'text-green-600 border-green-300 bg-white' : 'text-red-500 border-red-300 bg-white') 
              : 'text-gray-800 border-gray-200 bg-gray-50'
          }`}
          placeholder="..."
        />
        <div className="text-xl font-black text-gray-400">?</div>
      </div>
      
      {isWrong && (
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-red-500 text-white px-4 py-1 rounded-full text-xs font-black shadow-lg z-10 whitespace-nowrap">
              Kết quả: {problem.answer}
          </div>
      )}
    </div>
  );
};

export default DmMath;
