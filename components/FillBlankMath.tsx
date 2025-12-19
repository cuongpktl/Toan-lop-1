
import React from 'react';
import { MathProblem } from '../types';

interface Props {
  problem: MathProblem;
  onUpdate: (val: string) => void;
  showResult: boolean;
}

const FillBlankMath: React.FC<Props> = ({ problem, onUpdate, showResult }) => {
  const isDoubleOp = problem.visualType === 'double_op';
  const userAns = problem.userAnswer || (isDoubleOp ? JSON.stringify(['', '']) : '');
  const userOps = isDoubleOp ? JSON.parse(userAns) : [userAns];
  const targetOps = isDoubleOp ? JSON.parse(problem.answer) : [problem.answer];

  const handleOpClick = (index: number, symbol: string) => {
    if (showResult) return;
    if (isDoubleOp) {
      const newOps = [...userOps];
      newOps[index] = symbol;
      onUpdate(JSON.stringify(newOps));
    } else {
      onUpdate(symbol);
    }
  };

  const isCorrect = showResult && (
    isDoubleOp 
    ? userOps.every((op: string, i: number) => op === targetOps[i])
    : userAns === problem.answer
  );

  const hideIndex = problem.options?.[0] ?? 2;
  const a = problem.numbers?.[0] || 0;
  const b = problem.numbers?.[1] || 0;
  const c = problem.numbers?.[2] || 0;
  const res = problem.visualData;

  const renderSignPicker = (index: number) => {
    const currentOp = userOps[index];
    const targetOp = targetOps[index];
    
    return (
      <div className="relative group">
        {/* Trang trí chú voi/chuột bao quanh */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-20 group-hover:opacity-40 transition-opacity">
            <svg width="40" height="30" viewBox="0 0 40 30">
                <circle cx="10" cy="15" r="8" fill="#94a3b8" />
                <circle cx="30" cy="15" r="8" fill="#94a3b8" />
                <path d="M5 20 Q 20 10 35 20" stroke="#475569" strokeWidth="2" fill="none" />
            </svg>
        </div>

        <div className={`flex flex-col gap-1 p-1 rounded-2xl border-2 bg-white shadow-sm transition-all ${
            showResult ? (currentOp === targetOp ? 'border-green-300' : 'border-red-300 animate-shake') : 'border-blue-100'
        }`}>
          {['+', '-'].map(symbol => (
            <button
              key={symbol}
              onClick={() => handleOpClick(index, symbol)}
              className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-xl font-black rounded-xl border-2 transition-all ${
                currentOp === symbol 
                  ? 'bg-indigo-500 text-white border-indigo-600 scale-105 shadow-md' 
                  : 'bg-white border-gray-50 text-gray-300 hover:border-indigo-200 hover:text-indigo-400'
              } ${showResult && symbol === targetOp ? 'bg-green-500 text-white border-green-600' : ''}
                ${showResult && currentOp === symbol && symbol !== targetOp ? 'bg-red-500 text-white border-red-600' : ''}
              `}
            >
              {symbol}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderNumberBox = (val: number, isHidden: boolean, idx?: number) => {
    if (isHidden) {
      const currentVal = problem.userAnswer || '';
      const correct = showResult && currentVal === String(problem.answer);
      return (
        <div className="relative">
          <input
            type="number"
            inputMode="numeric"
            value={currentVal}
            onChange={(e) => onUpdate(e.target.value)}
            disabled={showResult}
            className={`w-16 h-16 sm:w-20 sm:h-20 text-center text-2xl font-black rounded-2xl border-4 shadow-inner outline-none transition-all ${
              showResult 
              ? (correct ? 'bg-green-50 border-green-400 text-green-700' : 'bg-red-50 border-red-400 text-red-700') 
              : 'bg-white border-indigo-300 text-gray-800 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100'
            }`}
            placeholder="?"
          />
          {showResult && !correct && (
            <div className="absolute -top-4 -right-4 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-xs font-black shadow-lg animate-bounce-short z-10">
              {problem.answer}
            </div>
          )}
        </div>
      );
    }
    return (
      <div className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center text-2xl font-black rounded-2xl bg-white border-2 border-gray-100 text-gray-700 shadow-sm">
        {val}
      </div>
    );
  };

  const isSignFilling = problem.operators?.[0] === '?' || isDoubleOp;

  return (
    <div className="flex flex-col gap-4 animate-fadeIn w-full items-center">
      {problem.question && <p className="text-center font-black text-gray-400 text-xs uppercase tracking-widest mb-2">{problem.question}</p>}
      
      <div className={`p-6 sm:p-10 rounded-[48px] border-4 border-dashed transition-all ${
        showResult ? (isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50') : 'border-indigo-100 bg-indigo-50/30'
      } flex flex-wrap justify-center items-center gap-4 sm:gap-8 relative overflow-visible shadow-sm min-w-[300px]`}>
        
        {/* Dạng C = A ? B */}
        {problem.visualType === 'reverse_calc' ? (
          <>
            {renderNumberBox(res, false)}
            <div className="text-3xl font-black text-indigo-300">=</div>
            {renderNumberBox(a, false)}
            {renderSignPicker(0)}
            {renderNumberBox(b, false)}
          </>
        ) : isDoubleOp ? (
          /* Dạng A ? B ? C = D */
          <>
            {renderNumberBox(a, false)}
            {renderSignPicker(0)}
            {renderNumberBox(b, false)}
            {renderSignPicker(1)}
            {renderNumberBox(c, false)}
            <div className="text-3xl font-black text-indigo-300">=</div>
            {renderNumberBox(res, false)}
          </>
        ) : isSignFilling ? (
          /* Dạng A ? B = C */
          <>
            {renderNumberBox(a, false)}
            {renderSignPicker(0)}
            {renderNumberBox(b, false)}
            <div className="text-3xl font-black text-indigo-300">=</div>
            {renderNumberBox(res, false)}
          </>
        ) : (
          /* Dạng điền số (Thẻ số) */
          <>
            {renderNumberBox(a, hideIndex === 0)}
            <div className="text-3xl font-black text-indigo-300">{problem.operators?.[0]}</div>
            {renderNumberBox(b, hideIndex === 1)}
            <div className="text-3xl font-black text-indigo-300">=</div>
            {renderNumberBox(res, hideIndex === 2)}
          </>
        )}
      </div>

      {showResult && !isCorrect && (
          <div className="mt-2 text-red-500 font-black text-xs animate-bounce">
              🔍 Bé hãy kiểm tra lại kết quả tính toán nhé!
          </div>
      )}
    </div>
  );
};

export default FillBlankMath;
