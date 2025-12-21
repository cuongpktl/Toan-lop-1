
import React from 'react';
import { MathProblem } from '../types';
import { focusNextEmptyInput } from '../services/uiUtils';

interface Props {
  problem: MathProblem;
  onUpdate: (val: string) => void;
  showResult: boolean;
}

const MazeMath: React.FC<Props> = ({ problem, onUpdate, showResult }) => {
  const { grid = {} } = problem.visualData || {};
  const userAnswers = problem.userAnswer ? JSON.parse(problem.userAnswer) : {};
  const targetAnswers = problem.answer || {};

  const handleInputChange = (coord: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (showResult) return;
    const newAnswers = { ...userAnswers, [coord]: val };
    onUpdate(JSON.stringify(newAnswers));

    if (val !== '') {
        setTimeout(() => focusNextEmptyInput(e.target), 300);
    }
  };

  const coords = Object.keys(grid).map(c => c.split(',').map(Number));
  if (coords.length === 0) return null;

  const minR = Math.min(...coords.map(c => c[0]));
  const maxR = Math.max(...coords.map(c => c[0]));
  const minC = Math.min(...coords.map(c => c[1]));
  const maxC = Math.max(...coords.map(c => c[1]));

  const rows = [];
  for (let r = minR; r <= maxR; r++) {
    const cols = [];
    for (let c = minC; c <= maxC; c++) {
      cols.push(grid[`${r},${c}`] || null);
    }
    rows.push(cols);
  }

  return (
    <div className="flex flex-col items-center gap-8 p-6 sm:p-12 bg-white rounded-[48px] border-4 border-blue-50 shadow-xl animate-fadeIn overflow-hidden">
      <div className="text-center space-y-3">
          <h3 className="text-2xl font-black text-blue-600 uppercase tracking-tight">Thử Thách Mê Cung</h3>
          <p className="text-gray-400 font-bold text-sm italic">Điền số đúng và con trỏ sẽ tự dẫn đường cho bé nhé!</p>
      </div>

      <div className="relative p-6 sm:p-10 bg-slate-50/50 rounded-[40px] border-2 border-slate-100 shadow-inner overflow-x-auto w-full max-w-full no-scrollbar">
        <div className="inline-grid gap-y-3 gap-x-1 sm:gap-x-4">
          {rows.map((row, r) => (
            <div key={r} className="flex gap-1 sm:gap-3 items-center justify-center">
              {row.map((cell, c) => {
                const coord = `${r + minR},${c + minC}`;
                if (!cell) return <div key={coord} className="w-12 h-12 sm:w-16 sm:h-16"></div>;
                if (cell.type === 'op') return <div key={coord} className="w-8 h-12 sm:w-12 sm:h-16 flex items-center justify-center font-black text-2xl sm:text-3xl text-blue-300">{cell.value}</div>;

                const userVal = userAnswers[coord] || '';
                const targetVal = targetAnswers[coord];
                const isCorrect = showResult && parseInt(userVal) === targetVal;

                if (cell.isStatic) return <div key={coord} className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center font-black text-xl sm:text-2xl rounded-2xl border-4 border-blue-100 bg-white text-gray-700 shadow-md">{cell.value}</div>;

                return (
                  <div key={coord} className="relative">
                    <input
                      type="number"
                      inputMode="numeric"
                      data-maze-coord={coord}
                      data-priority="2" 
                      value={userVal}
                      onChange={(e) => handleInputChange(coord, e)}
                      disabled={showResult}
                      className={`w-12 h-12 sm:w-16 sm:h-16 text-center font-black text-xl sm:text-2xl rounded-2xl border-4 outline-none transition-all shadow-lg ${
                        showResult 
                        ? (isCorrect ? 'bg-green-50 border-green-500 text-green-700' : 'bg-red-50 border-red-400 text-red-700') 
                        : 'bg-white border-blue-300 text-blue-600 focus:border-blue-500 focus:scale-110'
                      }`}
                      placeholder="?"
                    />
                    {showResult && !isCorrect && (
                      <div className="absolute -top-4 -right-4 w-8 h-8 bg-red-500 text-white text-xs font-black rounded-full flex items-center justify-center shadow-lg z-10 border-2 border-white">
                        {targetVal}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MazeMath;
