import React from 'react';
import { MathProblem } from '../types';

interface Props {
  problem: MathProblem;
  onUpdate: (val: string) => void;
  showResult: boolean;
}

const VerticalMath: React.FC<Props> = ({ problem, onUpdate, showResult }) => {
  const isCorrect = showResult && parseInt(problem.userAnswer || '') === problem.answer;
  const isWrong = showResult && !isCorrect;

  return (
    <div className={`p-6 rounded-3xl border-2 flex flex-col items-center justify-center relative bg-white shadow-sm transition-all duration-300 ${isCorrect ? 'border-green-400 bg-green-50' : isWrong ? 'border-red-400 bg-red-50' : 'border-blue-50 hover:border-blue-200 hover:shadow-md'}`}>
      <div className="font-mono text-4xl font-black text-gray-700 flex flex-col items-end leading-none tracking-widest mr-4 mb-2">
        <div className="mb-2">{problem.numbers?.[0]}</div>
        <div className="flex items-center w-full justify-between gap-4">
           <span className="text-2xl text-blue-500 font-black">{problem.operators?.[0]}</span>
           <span>{problem.numbers?.[1]}</span>
        </div>
        <div className="w-full h-1.5 bg-gray-700 mt-2 mb-4 rounded-full"></div>
      </div>
      
      <input 
        type="number" 
        inputMode="numeric"
        value={problem.userAnswer || ''}
        onChange={(e) => onUpdate(e.target.value)}
        disabled={showResult}
        className={`w-24 text-center text-3xl font-black p-2 rounded-2xl border-2 outline-none focus:ring-4 focus:ring-blue-100 transition-all ${
            showResult 
            ? (isCorrect ? 'text-green-600 border-green-300 bg-white' : 'text-red-500 border-red-300 bg-white') 
            : 'text-gray-800 border-gray-200 bg-gray-50'
        }`}
        placeholder="?"
        style={{ fontSize: '24px' }} // Ensures no auto-zoom on mobile
      />
      
      {isWrong && (
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-black shadow-lg z-10 whitespace-nowrap">
              Đúng là: {problem.answer}
          </div>
      )}
    </div>
  );
};

export default VerticalMath;