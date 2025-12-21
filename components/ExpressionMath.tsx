
import React, { useState, useEffect, useRef } from 'react';
import { MathProblem } from '../types';
import { focusNextEmptyInput } from '../services/uiUtils';

interface Props {
  problem: MathProblem;
  onUpdate: (val: string) => void;
  showResult: boolean;
}

const ExpressionMath: React.FC<Props> = ({ problem, onUpdate, showResult }) => {
  const [intermediateVal, setIntermediateVal] = useState('');
  const resultInputRef = useRef<HTMLInputElement>(null);
  const intermediateInputRef = useRef<HTMLInputElement>(null);
  
  const n1 = problem.numbers?.[0] || 0;
  const n2 = problem.numbers?.[1] || 0;
  const n3 = problem.numbers?.[2] || 0;
  const n4 = problem.numbers?.[3] || 0; 
  const op1 = problem.operators?.[0] || '+';
  const op2 = problem.operators?.[1] || '+';
  
  const step1Result = op1 === '+' ? n1 + n2 : n1 - n2;
  const isCorrect = showResult && parseInt(problem.userAnswer || '') === problem.answer;
  const isWrong = showResult && !isCorrect;

  const isStep1Correct = intermediateVal !== '' && parseInt(intermediateVal) === step1Result;

  useEffect(() => {
    setIntermediateVal('');
  }, [problem.id]);

  const handleIntermediateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setIntermediateVal(val);
    // Nếu bé điền xong ô phụ, hệ thống sẽ tự tìm ô phụ tiếp theo hoặc ô chính
    if (val !== '') {
        setTimeout(() => focusNextEmptyInput(e.target), 300);
    }
  };

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
              : 'text-gray-800 border-gray-200 bg-gray-50 focus:border-purple-400 focus:bg-white'
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
    return <span>{val}</span>;
  };

  const isCalc = problem.visualType === 'calc';
  const isMissingFirst = problem.visualType === 'missing_first';
  const isMissingLast = problem.visualType === 'missing_last';
  const isEquation = problem.visualType === 'equation';

  return (
    <div className={`p-8 rounded-[32px] border-2 bg-white shadow-sm transition-all flex flex-col items-center ${
      isCorrect ? 'border-green-400 bg-green-50' : isWrong ? 'border-red-400 bg-red-50' : 'border-purple-100 hover:border-purple-200'
    }`}>
        <div className="flex items-center gap-2 sm:gap-4 text-3xl sm:text-4xl font-black text-gray-700 font-mono mb-2">
            {renderNumberOrInput(n1, isMissingFirst)}
            <span className="text-purple-400 text-2xl">{op1}</span>
            <span>{n2}</span>
            
            {isEquation ? (
              <>
                <span className="text-gray-300">=</span>
                <span>{n3}</span>
                <span className="text-purple-400 text-2xl">{op2}</span>
                {renderNumberOrInput(n4, true)}
              </>
            ) : (
              <>
                <span className="text-purple-400 text-2xl">{op2}</span>
                {renderNumberOrInput(n3, isMissingLast)}
                <span className="text-gray-300">=</span>
                {renderNumberOrInput(problem.visualData || 0, isCalc)}
              </>
            )}
        </div>

        {!isEquation && (
          <div className="flex w-full max-w-[320px] mt-1 relative h-16">
              <div className={`absolute top-0 left-[10%] right-[60%] h-6 border-l-4 border-b-4 border-r-4 rounded-b-xl transition-colors ${
                  isStep1Correct ? 'border-green-500' : 'border-purple-200'
              }`}></div>
              
              <div className="absolute top-6 left-[25%] -translate-x-1/2 flex flex-col items-center">
                  <div className="relative group">
                      <input 
                          ref={intermediateInputRef}
                          type="number"
                          inputMode="numeric"
                          data-priority="1" 
                          placeholder="..."
                          value={intermediateVal}
                          onChange={handleIntermediateChange}
                          disabled={showResult}
                          className={`w-12 h-10 text-center text-sm font-black rounded-lg border-2 outline-none transition-all shadow-sm ${
                              isStep1Correct ? 'border-green-500 bg-green-50 text-green-700' : 'border-purple-50 bg-purple-50 focus:border-purple-200'
                          }`}
                      />
                  </div>
              </div>
              <div className="absolute top-6 left-[70%] -translate-x-1/2 flex flex-col items-center">
                  <div className="flex items-center gap-1 text-gray-400 font-bold text-sm">
                      <span className="text-purple-300">{op2}</span>
                      <span className="bg-gray-50 px-2 py-0.5 rounded border border-gray-100">{n3}</span>
                  </div>
              </div>
          </div>
        )}
    </div>
  );
};

export default ExpressionMath;
