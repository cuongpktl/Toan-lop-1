
import React, { useRef } from 'react';
import { MathProblem } from '../types';
import { focusNextEmptyInput } from '../services/uiUtils';

interface Props {
  problem: MathProblem;
  onUpdate: (val: string) => void;
  showResult: boolean;
}

const ExpressionMath: React.FC<Props> = ({ problem, onUpdate, showResult }) => {
  const resultInputRef = useRef<HTMLInputElement>(null);
  
  const n1 = problem.numbers?.[0] || 0;
  const n2 = problem.numbers?.[1] || 0;
  const n3 = problem.numbers?.[2] || 0;
  const n4 = problem.numbers?.[3] || 0; 
  const op1 = problem.operators?.[0] || '+';
  const op2 = problem.operators?.[1] || '+';
  
  const isCorrect = showResult && parseInt(problem.userAnswer || '') === problem.answer;
  const isWrong = showResult && !isCorrect;

  const handleFinalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onUpdate(val);
    if (val !== '') {
        setTimeout(() => focusNextEmptyInput(e.target), 400);
    }
  };

  const renderNumberOrInput = (val: number, isMissing: boolean) => {
    if (isMissing) {
      return (
        <div className="relative">
          <input 
            ref={resultInputRef}
            type="number" 
            inputMode="numeric"
            data-priority="2" 
            value={problem.userAnswer || ''}
            onChange={handleFinalChange}
            disabled={showResult}
            className={`w-16 sm:w-20 text-center text-2xl font-black p-2 rounded-2xl border-4 outline-none transition-all ${
              showResult 
              ? (isCorrect ? 'text-green-600 border-green-300 bg-white' : 'text-red-500 border-red-300 bg-white') 
              : 'text-gray-800 border-gray-200 bg-gray-50 focus:border-purple-400 focus:bg-white shadow-inner'
            }`}
            placeholder="..."
          />
          {isWrong && (
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-red-500 text-white px-2 py-1 rounded-full text-[10px] font-black shadow-lg whitespace-nowrap z-10">
              Đáp án: {problem.answer}
            </div>
          )}
        </div>
      );
    }
    return <span className="px-1">{val}</span>;
  };

  const isCalc = problem.visualType === 'calc';
  const isMissingFirst = problem.visualType === 'missing_first';
  const isMissingLast = problem.visualType === 'missing_last';
  const isEquation = problem.visualType === 'equation';

  return (
    <div className={`p-8 sm:p-12 rounded-[32px] sm:rounded-[48px] border-2 bg-white shadow-sm transition-all flex flex-col items-center justify-center ${
      isCorrect ? 'border-green-400 bg-green-50' : isWrong ? 'border-red-400 bg-red-50' : 'border-purple-100 hover:border-purple-200'
    }`}>
        <div className="flex items-center gap-1.5 sm:gap-4 text-2xl sm:text-4xl font-black text-gray-700 font-mono tracking-tighter">
            {renderNumberOrInput(n1, isMissingFirst)}
            <span className="text-purple-400 text-xl sm:text-3xl font-bold">{op1}</span>
            <span>{n2}</span>
            
            {isEquation ? (
              <>
                <span className="text-gray-300 font-normal">=</span>
                <span>{n3}</span>
                <span className="text-purple-400 text-xl sm:text-3xl font-bold">{op2}</span>
                {renderNumberOrInput(n4, true)}
              </>
            ) : (
              <>
                <span className="text-purple-400 text-xl sm:text-3xl font-bold">{op2}</span>
                {renderNumberOrInput(n3, isMissingLast)}
                <span className="text-gray-300 font-normal">=</span>
                {renderNumberOrInput(problem.visualData || 0, isCalc)}
              </>
            )}
        </div>
        
        {/* Chỉ dẫn nhỏ giúp bé tập trung */}
        {!showResult && (
          <div className="mt-6 text-[10px] sm:text-xs font-black text-purple-400 uppercase tracking-widest opacity-60">
            Bé hãy tính nhẩm thật kỹ nhé!
          </div>
        )}
    </div>
  );
};

export default ExpressionMath;
