
import React from 'react';
import { MathProblem } from '../types';
import { focusNextEmptyInput } from '../services/uiUtils';

interface Props {
  problem: MathProblem;
  onUpdate: (val: string) => void;
  showResult: boolean;
}

const HouseMath: React.FC<Props> = ({ problem, onUpdate, showResult }) => {
  const { sum, p1, p2 } = problem.answer;
  const userAns = problem.userAnswer ? JSON.parse(problem.userAnswer) : {};

  const handleInputChange = (row: number, col: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (showResult) return;
    const newAns = { ...userAns, [`${row}-${col}`]: val };
    onUpdate(JSON.stringify(newAns));

    if (val !== '') {
        setTimeout(() => focusNextEmptyInput(e.target), 300);
    }
  };

  const checkCellStatus = (rowIdx: number) => {
    if (!showResult) return 'idle';
    
    const v0 = parseInt(userAns[`${rowIdx}-0`]);
    const v1 = parseInt(userAns[`${rowIdx}-1`]);
    const v2 = parseInt(userAns[`${rowIdx}-2`]);

    if (isNaN(v0) || isNaN(v1) || isNaN(v2)) return 'wrong';

    if (rowIdx < 2) {
      const correctMath = (v0 + v1 === v2);
      const correctValues = (v2 === sum) && ((v0 === p1 && v1 === p2) || (v0 === p2 && v1 === p1));
      return (correctMath && correctValues) ? 'correct' : 'wrong';
    } else {
      const correctMath = (v0 - v1 === v2);
      const correctValues = (v0 === sum) && ((v1 === p1 && v2 === p2) || (v1 === p2 && v2 === p1));
      return (correctMath && correctValues) ? 'correct' : 'wrong';
    }
  };

  const renderInput = (row: number, col: number) => {
    const status = checkCellStatus(row);
    const userVal = userAns[`${row}-${col}`] || '';
    
    let defaultTarget;
    if (row === 0) defaultTarget = [p1, p2, sum][col];
    else if (row === 1) defaultTarget = [p2, p1, sum][col];
    else if (row === 2) defaultTarget = [sum, p1, p2][col];
    else defaultTarget = [sum, p2, p1][col];

    return (
      <div className="relative">
        <input
          type="number"
          inputMode="numeric"
          data-priority="2" 
          value={userVal}
          onChange={(e) => handleInputChange(row, col, e)}
          disabled={showResult}
          className={`w-12 h-12 sm:w-16 sm:h-16 text-center text-xl font-black rounded-xl border-4 transition-all outline-none ${
            showResult 
            ? (status === 'correct' ? 'border-green-500 bg-green-50 text-green-700' : 'border-red-400 bg-red-50 text-red-700') 
            : 'border-blue-100 bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50'
          }`}
          placeholder="..."
        />
        {showResult && status === 'wrong' && (
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-red-500 text-white px-2 py-1 rounded-full text-[10px] font-black shadow-lg z-10 whitespace-nowrap">
                {defaultTarget}
            </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center gap-8 p-6 sm:p-10 bg-white rounded-[48px] border-4 border-indigo-50 shadow-xl animate-fadeIn w-full max-w-2xl mx-auto overflow-visible">
      <div className="text-center space-y-2 pointer-events-none">
          <h3 className="text-2xl font-black text-indigo-700 uppercase tracking-tight">{problem.question}</h3>
          <p className="text-gray-400 font-bold text-sm italic">Bé hãy điền số rồi con trỏ sẽ tự nhảy sang ô tiếp theo nhé!</p>
      </div>

      <div className="relative w-full max-w-[450px] bg-slate-50/50 rounded-[40px] border-2 border-slate-100 p-8 pt-4 pb-12 shadow-inner">
        <div className="flex flex-col items-center">
            <div className="relative w-full flex justify-center mb-[-2px] z-10">
                <svg width="340" height="120" viewBox="0 0 340 120" className="drop-shadow-lg">
                    <path d="M170 10 L330 110 H10 Z" fill="#4338ca" stroke="#312e81" strokeWidth="4" strokeLinejoin="round" />
                    <rect x="145" y="45" width="50" height="50" rx="8" fill="white" stroke="#312e81" strokeWidth="3" />
                    <rect x="75" y="65" width="50" height="50" rx="8" fill="white" stroke="#312e81" strokeWidth="3" />
                    <rect x="215" y="65" width="50" height="50" rx="8" fill="white" stroke="#312e81" strokeWidth="3" />
                    <text x="170" y="80" textAnchor="middle" className="text-2xl font-black fill-indigo-900">{sum}</text>
                    <text x="100" y="100" textAnchor="middle" className="text-2xl font-black fill-indigo-900">{p1}</text>
                    <text x="240" y="100" textAnchor="middle" className="text-2xl font-black fill-indigo-900">{p2}</text>
                </svg>
            </div>
            <div className="w-[320px] bg-white border-x-4 border-b-4 border-indigo-900 rounded-b-3xl p-6 shadow-xl flex flex-col gap-4">
                {[0, 1, 2, 3].map(row => (
                    <div key={row} className="flex items-center justify-between gap-1 sm:gap-2">
                        {renderInput(row, 0)}
                        <span className="text-2xl font-black text-indigo-300">
                            {row < 2 ? '+' : '-'}
                        </span>
                        {renderInput(row, 1)}
                        <span className="text-2xl font-black text-gray-300">=</span>
                        {renderInput(row, 2)}
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default HouseMath;
