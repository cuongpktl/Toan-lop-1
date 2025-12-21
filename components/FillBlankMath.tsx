
import React from 'react';
import { MathProblem } from '../types';
import { focusNextEmptyInput } from '../services/uiUtils';

interface Props {
  problem: MathProblem;
  onUpdate: (val: string) => void;
  showResult: boolean;
}

const FillBlankMath: React.FC<Props> = ({ problem, onUpdate, showResult }) => {
  const isChain = problem.visualType === 'chain';
  const isDoubleOp = problem.visualType === 'double_op';
  
  const userAns = problem.userAnswer || (isChain || isDoubleOp ? JSON.stringify({}) : '');

  const handleChainInputChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (showResult) return;
    const currentAnswers = JSON.parse(userAns);
    const newAnswers = { ...currentAnswers, [String(index)]: val };
    onUpdate(JSON.stringify(newAnswers));
    if (val !== '') {
      setTimeout(() => focusNextEmptyInput(e.target), 300);
    }
  };

  const handleSingleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onUpdate(val);
    if (val !== '') {
      setTimeout(() => focusNextEmptyInput(e.target), 300);
    }
  };

  const renderNumberBox = (val: number, isHidden: boolean, idx: number, shape: 'circle' | 'square' = 'square', isStarting = false) => {
    const currentAnswers = isChain ? JSON.parse(userAns) : { "2": userAns };
    const userVal = isChain ? currentAnswers[String(idx)] : userAns;
    const targetVal = isChain ? problem.answer[String(idx)] : problem.answer;
    
    const correct = showResult && isHidden && parseInt(userVal) === targetVal;
    const borderRadius = shape === 'circle' ? 'rounded-full' : 'rounded-2xl';

    return (
      <div className="relative flex flex-col items-center">
        <div className={`w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center text-2xl font-black border-4 shadow-md transition-all ${borderRadius} ${
          isHidden 
            ? (showResult ? (correct ? 'bg-green-50 border-green-400 text-green-700' : 'bg-red-50 border-red-400 text-red-700') : 'bg-white border-indigo-300 text-gray-800')
            : (isStarting ? 'bg-gray-200 border-gray-400 text-gray-700' : 'bg-white border-gray-100 text-gray-700')
        }`}>
          {isHidden ? (
            <input
              type="number"
              inputMode="numeric"
              data-priority="2" 
              value={userVal || ''}
              onChange={(e) => isChain ? handleChainInputChange(idx, e) : handleSingleInputChange(e)}
              disabled={showResult}
              className="w-full h-full text-center bg-transparent outline-none"
              placeholder="..."
            />
          ) : (
            val
          )}
        </div>
        {showResult && isHidden && !correct && (
          <div className="absolute -top-4 -right-4 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-xs font-black shadow-lg animate-bounce-short z-10">
            {targetVal}
          </div>
        )}
      </div>
    );
  };

  if (isChain) {
    const { nodes = [], steps = [] } = problem.visualData || {};
    return (
      <div className="flex flex-col gap-6 animate-fadeIn w-full items-center">
        <p className="text-center font-black text-gray-400 text-xs uppercase tracking-widest mb-2">{problem.question}</p>
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap justify-center py-6">
          {nodes.map((node: any, idx: number) => (
            <React.Fragment key={idx}>
              {renderNumberBox(node.value, node.isHidden, idx, node.shape, node.isStarting)}
              {idx < steps.length && (
                <div className="flex flex-col items-center min-w-[60px] relative">
                  <div className="text-xl font-black text-blue-600 mb-1">{steps[idx].op} {steps[idx].val}</div>
                  <svg width="40" height="15" viewBox="0 0 40 15" className="overflow-visible">
                    <path d="M 0 7.5 L 35 7.5" stroke="#94a3b8" strokeWidth="3" fill="none" />
                    <path d="M 30 2 L 38 7.5 L 30 13" stroke="#94a3b8" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  }

  const hideIndex = problem.options?.[0] ?? 2;
  const a = problem.numbers?.[0] || 0;
  const b = problem.numbers?.[1] || 0;
  const res = problem.visualData;

  return (
    <div className="flex flex-col gap-4 animate-fadeIn w-full items-center">
      <div className="p-6 sm:p-10 rounded-[48px] border-4 border-dashed border-indigo-100 bg-indigo-50/30 flex flex-wrap justify-center items-center gap-4 sm:gap-8 relative overflow-visible shadow-sm min-w-[300px]">
        {renderNumberBox(a, hideIndex === 0, 0)}
        <div className="text-3xl font-black text-indigo-300">{problem.operators?.[0]}</div>
        {renderNumberBox(b, hideIndex === 1, 1)}
        <div className="text-3xl font-black text-indigo-300">=</div>
        {renderNumberBox(res, hideIndex === 2, 2)}
      </div>
    </div>
  );
};

export default FillBlankMath;
