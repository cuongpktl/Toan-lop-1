import React, { useState } from 'react';
import { MathProblem } from '../types';

interface Props {
  problem: MathProblem;
  onUpdate: (val: string) => void;
  showResult: boolean;
}

const PatternMath: React.FC<Props> = ({ problem, onUpdate, showResult }) => {
  // Safe destructuring with defaults
  const { grid = [], hiddenCells = [], options = [] } = (problem.visualData && typeof problem.visualData === 'object' && !Array.isArray(problem.visualData)) 
    ? problem.visualData 
    : {};
    
  const userAnswers = problem.userAnswer ? JSON.parse(problem.userAnswer) : {};
  const [activeCell, setActiveCell] = useState<{ r: number, c: number } | null>(null);

  const handleSelectShape = (shapeId: string) => {
    if (!activeCell) return;
    const newAnswers = { ...userAnswers, [`${activeCell.r}-${activeCell.c}`]: shapeId };
    onUpdate(JSON.stringify(newAnswers));
    setActiveCell(null);
  };

  const isCellCorrect = (r: number, c: number) => {
    const target = hiddenCells.find((h: any) => h.r === r && h.c === c)?.target;
    return userAnswers[`${r}-${c}`] === target;
  };

  if (!grid.length) return null;

  return (
    <div className="bg-white p-6 rounded-3xl border-2 border-teal-100 shadow-lg flex flex-col items-center relative overflow-visible">
      <h3 className="text-gray-700 font-black mb-6 text-center text-lg">{problem.question}</h3>
      
      {/* 3x3 Grid */}
      <div className="grid grid-cols-3 gap-3 bg-teal-50 p-4 rounded-2xl shadow-inner border border-teal-100">
        {grid.map((row: any[], rIndex: number) => (
          Array.isArray(row) && row.map((cell: any, cIndex: number) => {
            const isHidden = hiddenCells.some((h: any) => h.r === rIndex && h.c === cIndex);
            const userChoiceId = userAnswers[`${rIndex}-${cIndex}`];
            const userChoiceShape = options.find((o: any) => o.id === userChoiceId);
            const correct = showResult && isCellCorrect(rIndex, cIndex);
            const wrong = showResult && isHidden && userChoiceId && !isCellCorrect(rIndex, cIndex);

            return (
              <div 
                key={`${rIndex}-${cIndex}`}
                onClick={() => !showResult && isHidden && setActiveCell({ r: rIndex, c: cIndex })}
                className={`w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-xl transition-all duration-200 shadow-sm relative
                  ${isHidden ? 'cursor-pointer border-2 border-dashed' : 'bg-white/60'}
                  ${isHidden && !userChoiceId ? 'border-teal-300 bg-white' : ''}
                  ${isHidden && userChoiceId && !showResult ? 'bg-white border-teal-500 ring-2 ring-teal-100' : ''}
                  ${correct ? 'bg-green-100 border-green-500 scale-95 shadow-none' : ''}
                  ${wrong ? 'bg-red-50 border-red-500 animate-shake' : ''}
                  ${!isHidden ? 'bg-white/80 border-transparent' : ''}
                `}
              >
                {!isHidden ? (
                  <svg viewBox="0 0 100 100" className="w-10 h-10 sm:w-12 sm:h-12">
                    <path d={cell.d} fill={cell.color} stroke="#334155" strokeWidth="3" />
                  </svg>
                ) : userChoiceShape ? (
                  <svg viewBox="0 0 100 100" className="w-10 h-10 sm:w-12 sm:h-12">
                    <path d={userChoiceShape.d} fill={userChoiceShape.color} stroke="#334155" strokeWidth="3" />
                  </svg>
                ) : (
                  <span className="text-teal-400 font-black text-2xl">?</span>
                )}

                {/* Status Indicator */}
                {showResult && isHidden && (
                    <div className="absolute -top-2 -right-2">
                        {correct ? (
                            <div className="bg-green-500 text-white rounded-full p-0.5 shadow-md">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                            </div>
                        ) : (
                            <div className="bg-red-500 text-white rounded-full p-0.5 shadow-md">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                            </div>
                        )}
                    </div>
                )}
              </div>
            );
          })
        ))}
      </div>

      {/* Selection Popover */}
      {activeCell && (
        <div className="absolute inset-0 bg-white/95 z-50 rounded-3xl flex flex-col items-center justify-center p-4 animate-fadeIn">
          <p className="font-bold text-gray-600 mb-4">Bé chọn hình nào?</p>
          <div className="flex gap-4">
            {options.map((shape: any) => (
              <button
                key={shape.id}
                onClick={() => handleSelectShape(shape.id)}
                className="w-16 h-16 bg-teal-50 border-2 border-teal-200 rounded-2xl flex items-center justify-center hover:bg-teal-100 transition-colors shadow-sm active:scale-90"
              >
                <svg viewBox="0 0 100 100" className="w-10 h-10">
                  <path d={shape.d} fill={shape.color} stroke="#334155" strokeWidth="3" />
                </svg>
              </button>
            ))}
          </div>
          <button 
            onClick={() => setActiveCell(null)}
            className="mt-6 text-sm text-gray-400 font-bold hover:text-gray-600"
          >
            Đóng lại
          </button>
        </div>
      )}
    </div>
  );
};

export default PatternMath;