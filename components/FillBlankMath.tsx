
import React from 'react';
import { MathProblem } from '../types';

interface Props {
  problem: MathProblem;
  onUpdate: (val: string) => void;
  showResult: boolean;
}

const FillBlankMath: React.FC<Props> = ({ problem, onUpdate, showResult }) => {
  const isCorrect = showResult && problem.userAnswer === String(problem.answer);
  const hideIndex = problem.options?.[0] ?? 2; // 0: num1, 1: num2, 2: result, 3: operator
  
  const op = problem.operators?.[0] || '+';
  const a = problem.numbers?.[0] || 0;
  const b = problem.numbers?.[1] || 0;
  const res = hideIndex === 3 ? problem.visualData : (op === '+' ? a + b : a - b);

  const handleOpClick = (clickedOp: string) => {
    if (showResult) return;
    onUpdate(clickedOp);
  };

  const renderBox = (val: any, isHidden: boolean) => {
    if (isHidden) {
      if (hideIndex === 3) {
        // Dạng điền dấu + hoặc -
        return (
          <div className="flex gap-2">
            {['+', '-'].map(symbol => (
              <button
                key={symbol}
                onClick={() => handleOpClick(symbol)}
                className={`w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center text-2xl font-black rounded-2xl border-4 transition-all shadow-sm ${
                  problem.userAnswer === symbol 
                    ? 'bg-indigo-500 text-white border-indigo-600 scale-110 shadow-lg' 
                    : 'bg-white border-gray-100 text-gray-400 hover:border-indigo-200'
                } ${showResult && symbol === problem.answer ? 'bg-green-500 text-white border-green-600' : ''}
                  ${showResult && problem.userAnswer === symbol && symbol !== problem.answer ? 'bg-red-500 text-white border-red-600' : ''}
                `}
              >
                {symbol}
              </button>
            ))}
          </div>
        );
      }

      return (
        <div className="relative">
          <input
            type="number"
            inputMode="numeric"
            value={problem.userAnswer || ''}
            onChange={(e) => onUpdate(e.target.value)}
            disabled={showResult}
            className={`w-16 h-16 sm:w-20 sm:h-20 text-center text-2xl font-black rounded-2xl border-4 shadow-inner outline-none transition-all ${
              showResult 
              ? (isCorrect ? 'bg-green-50 border-green-400 text-green-700' : 'bg-red-50 border-red-400 text-red-700') 
              : 'bg-white border-indigo-300 text-gray-800 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100'
            }`}
            placeholder="?"
          />
          {showResult && !isCorrect && (
            <div className="absolute -top-4 -right-4 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-xs font-black shadow-lg animate-bounce-short z-10">
              {problem.answer}
            </div>
          )}
        </div>
      );
    }
    return (
      <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center text-2xl font-black rounded-2xl bg-white border-4 border-gray-100 text-gray-700 shadow-sm">
        {val}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-4 animate-fadeIn">
      {problem.question && <p className="text-center font-black text-gray-500 text-sm uppercase mb-2">{problem.question}</p>}
      <div className={`bg-indigo-50 p-6 sm:p-8 rounded-[40px] border-4 border-dashed transition-all ${showResult && !isCorrect ? 'border-red-200 bg-red-50' : 'border-indigo-200'} flex flex-wrap justify-center items-center gap-3 sm:gap-6 relative overflow-visible shadow-sm`}>
        {renderBox(a, hideIndex === 0)}
        {hideIndex === 3 ? renderBox(null, true) : <div className="text-3xl font-black text-indigo-400">{op}</div>}
        {renderBox(b, hideIndex === 1)}
        <div className="text-3xl font-black text-indigo-400">=</div>
        {renderBox(res, hideIndex === 2)}
      </div>
    </div>
  );
};

export default FillBlankMath;
