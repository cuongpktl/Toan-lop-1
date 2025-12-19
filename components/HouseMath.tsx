
import React from 'react';
import { MathProblem } from '../types';

interface Props {
  problem: MathProblem;
  onUpdate: (val: string) => void;
  showResult: boolean;
}

const HouseMath: React.FC<Props> = ({ problem, onUpdate, showResult }) => {
  const { sum, p1, p2 } = problem.answer;
  
  // Dữ liệu người dùng: JSON của 12 ô nhập (4 hàng x 3 ô)
  const userAns = problem.userAnswer ? JSON.parse(problem.userAnswer) : {};

  const handleInputChange = (row: number, col: number, val: string) => {
    if (showResult) return;
    const newAns = { ...userAns, [`${row}-${col}`]: val };
    onUpdate(JSON.stringify(newAns));
  };

  const checkCell = (row: number, col: number) => {
    if (!showResult) return 'idle';
    const val = parseInt(userAns[`${row}-${col}`] || '');
    
    // Đáp án chuẩn cho từng hàng
    // Hàng 0: p1 + p2 = sum
    // Hàng 1: p2 + p1 = sum
    // Hàng 2: sum - p1 = p2
    // Hàng 3: sum - p2 = p1
    
    let target;
    if (row === 0) target = [p1, p2, sum][col];
    else if (row === 1) target = [p2, p1, sum][col];
    else if (row === 2) target = [sum, p1, p2][col];
    else target = [sum, p2, p1][col];

    return val === target ? 'correct' : 'wrong';
  };

  const renderInput = (row: number, col: number) => {
    const status = checkCell(row, col);
    let targetVal;
    if (row === 0) targetVal = [p1, p2, sum][col];
    else if (row === 1) targetVal = [p2, p1, sum][col];
    else if (row === 2) targetVal = [sum, p1, p2][col];
    else targetVal = [sum, p2, p1][col];

    return (
      <div className="relative">
        <input
          type="number"
          inputMode="numeric"
          value={userAns[`${row}-${col}`] || ''}
          onChange={(e) => handleInputChange(row, col, e.target.value)}
          disabled={showResult}
          className={`w-12 h-12 sm:w-16 sm:h-16 text-center text-xl font-black rounded-xl border-4 transition-all outline-none ${
            showResult 
            ? (status === 'correct' ? 'border-green-400 bg-green-50 text-green-700' : 'border-red-400 bg-red-50 text-red-700') 
            : 'border-blue-100 bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50'
          }`}
          placeholder="..."
        />
        {status === 'wrong' && (
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-red-500 text-white px-2 py-1 rounded-full text-[10px] font-black shadow-lg z-10 whitespace-nowrap">
                {targetVal}
            </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center gap-8 p-6 sm:p-10 bg-white rounded-[48px] border-4 border-indigo-50 shadow-xl animate-fadeIn w-full max-w-2xl mx-auto overflow-visible">
      <div className="text-center space-y-2 pointer-events-none">
          <h3 className="text-2xl font-black text-indigo-700 uppercase tracking-tight">{problem.question}</h3>
          <p className="text-gray-400 font-bold text-sm italic">Bé hãy dùng 3 số ở nóc nhà để viết 4 phép tính đúng nhé!</p>
      </div>

      <div className="relative w-full max-w-[450px] bg-slate-50/50 rounded-[40px] border-2 border-slate-100 p-8 pt-4 pb-12 shadow-inner">
        {/* Hình Ngôi Nhà */}
        <div className="flex flex-col items-center">
            {/* Mái Nhà */}
            <div className="relative w-full flex justify-center mb-[-2px] z-10">
                <svg width="340" height="120" viewBox="0 0 340 120" className="drop-shadow-lg">
                    <path d="M170 10 L330 110 H10 Z" fill="#4338ca" stroke="#312e81" strokeWidth="4" strokeLinejoin="round" />
                    {/* 3 Ô số trên nóc */}
                    <rect x="145" y="45" width="50" height="50" rx="8" fill="white" stroke="#312e81" strokeWidth="3" />
                    <rect x="75" y="65" width="50" height="50" rx="8" fill="white" stroke="#312e81" strokeWidth="3" />
                    <rect x="215" y="65" width="50" height="50" rx="8" fill="white" stroke="#312e81" strokeWidth="3" />
                    
                    <text x="170" y="80" textAnchor="middle" className="text-2xl font-black fill-indigo-900">{sum}</text>
                    <text x="100" y="100" textAnchor="middle" className="text-2xl font-black fill-indigo-900">{p1}</text>
                    <text x="240" y="100" textAnchor="middle" className="text-2xl font-black fill-indigo-900">{p2}</text>
                </svg>
            </div>

            {/* Thân Nhà (Các phép tính) */}
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

      {showResult && (
          <div className="bg-indigo-50 p-4 rounded-2xl w-full border-2 border-indigo-100 flex items-center gap-3 animate-fadeIn">
              <span className="text-2xl">💡</span>
              <p className="text-sm font-bold text-indigo-700">
                  Trong ngôi nhà này: <span className="underline">{p1} + {p2} = {sum}</span>. Bé hãy đảo vị trí hoặc dùng phép trừ để hoàn thành nhé!
              </p>
          </div>
      )}
    </div>
  );
};

export default HouseMath;
