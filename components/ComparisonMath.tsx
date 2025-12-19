
import React, { useState, useEffect } from 'react';
import { MathProblem } from '../types';

interface Props {
  problem: MathProblem;
  onUpdate: (val: string) => void;
  showResult: boolean;
}

const ComparisonMath: React.FC<Props> = ({ problem, onUpdate, showResult }) => {
  const [showSelector, setShowSelector] = useState(false);
  const [leftIntermediate, setLeftIntermediate] = useState('');
  const [rightIntermediate, setRightIntermediate] = useState('');
  
  const nums = problem.numbers || [0, 0, 0, 0];
  const ops = problem.operators || ['+', '+'];
  const userAns = problem.userAnswer || '';
  const isCorrect = showResult && userAns === problem.answer;
  const isWrong = showResult && userAns !== '' && !isCorrect;

  // Kiểm tra xem bên phải có phải là biểu thức hay chỉ là một số
  const isRightExpression = ops[1] !== '=';

  const leftTarget = ops[0] === '+' ? nums[0] + nums[1] : nums[0] - nums[1];
  const rightTarget = isRightExpression ? (ops[1] === '+' ? nums[2] + nums[3] : nums[2] - nums[3]) : nums[2];

  const isLeftCorrect = leftIntermediate !== '' && parseInt(leftIntermediate) === leftTarget;
  const isRightCorrect = rightIntermediate !== '' && parseInt(rightIntermediate) === rightTarget;

  useEffect(() => {
    setLeftIntermediate('');
    setRightIntermediate('');
  }, [problem.id]);

  const handleSelect = (val: string) => {
    if (showResult) return;
    onUpdate(val);
    setShowSelector(false);
  };

  const SYMBOLS = ['>', '<', '='];

  return (
    <div className={`p-8 rounded-[40px] border-2 flex flex-col items-center bg-white shadow-sm transition-all duration-300 relative ${
        showResult ? (isCorrect ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50') : 'border-indigo-100 hover:border-indigo-300'
    }`}>
      <div className="flex items-center gap-4 sm:gap-10 w-full justify-center">
        
        {/* Left Side: Luôn là biểu thức */}
        <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 text-2xl font-black text-gray-700 font-mono bg-white px-4 py-2 rounded-2xl border border-gray-100 shadow-sm">
                <span>{nums[0]}</span>
                <span className={`${ops[0] === '+' ? 'text-indigo-400' : 'text-red-400'} text-xl`}>{ops[0]}</span>
                <span>{nums[1]}</span>
            </div>
            
            {/* V Diagram Left */}
            <div className="relative w-full h-14 mt-1">
                <div className="absolute top-0 left-[15%] right-[15%] h-5 border-l-2 border-b-2 border-r-2 border-indigo-200 rounded-b-lg"></div>
                <div className="absolute top-4 left-1/2 -translate-x-1/2">
                    <input 
                        type="number"
                        inputMode="numeric"
                        placeholder="..."
                        value={leftIntermediate}
                        onChange={(e) => setLeftIntermediate(e.target.value)}
                        disabled={showResult}
                        className={`w-12 h-8 text-center text-xs font-black rounded-lg border-2 outline-none transition-all shadow-sm ${
                            isLeftCorrect ? 'border-green-400 bg-green-50 text-green-600' :
                            leftIntermediate !== '' ? 'border-orange-300 bg-orange-50 text-orange-600' :
                            'border-indigo-50 bg-white focus:border-indigo-200'
                        }`}
                    />
                </div>
            </div>
        </div>

        {/* Comparison Circle */}
        <div className="relative mb-14">
            <button 
                onClick={() => !showResult && setShowSelector(!showSelector)}
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full border-4 flex items-center justify-center text-3xl font-black transition-all shadow-md z-10 relative
                    ${userAns ? 'text-indigo-600 border-indigo-500 bg-white' : 'text-gray-300 border-gray-100 bg-gray-50'}
                    ${isCorrect ? 'border-green-500 text-green-600' : ''}
                    ${isWrong ? 'border-red-500 text-red-600 animate-shake' : ''}
                    ${!showResult && !userAns ? 'hover:border-indigo-300 animate-pulse' : ''}
                `}
            >
                {userAns || '?'}
            </button>

            {/* Selection Menu */}
            {showSelector && !showResult && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 bg-white border-2 border-indigo-200 rounded-[24px] shadow-2xl flex p-2 gap-2 z-50 animate-fadeIn overflow-hidden">
                    {SYMBOLS.map(sym => (
                        <button 
                            key={sym} 
                            onClick={() => handleSelect(sym)}
                            className="w-12 h-12 flex items-center justify-center text-2xl font-black text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors active:scale-90"
                        >
                            {sym}
                        </button>
                    ))}
                </div>
            )}
        </div>

        {/* Right Side: Có thể là biểu thức hoặc một số */}
        <div className="flex flex-col items-center">
            <div className={`flex items-center gap-2 text-2xl font-black text-gray-700 font-mono bg-white px-4 py-2 rounded-2xl border border-gray-100 shadow-sm ${!isRightExpression ? 'min-w-[80px] justify-center' : ''}`}>
                <span>{nums[2]}</span>
                {isRightExpression && (
                  <>
                    <span className={`${ops[1] === '+' ? 'text-indigo-400' : 'text-red-400'} text-xl`}>{ops[1]}</span>
                    <span>{nums[3]}</span>
                  </>
                )}
            </div>

            {/* V Diagram Right - Chỉ hiện nếu là biểu thức */}
            {isRightExpression && (
              <div className="relative w-full h-14 mt-1">
                  <div className="absolute top-0 left-[15%] right-[15%] h-5 border-l-2 border-b-2 border-r-2 border-indigo-200 rounded-b-lg"></div>
                  <div className="absolute top-4 left-1/2 -translate-x-1/2">
                      <input 
                          type="number"
                          inputMode="numeric"
                          placeholder="..."
                          value={rightIntermediate}
                          onChange={(e) => setRightIntermediate(e.target.value)}
                          disabled={showResult}
                          className={`w-12 h-8 text-center text-xs font-black rounded-lg border-2 outline-none transition-all shadow-sm ${
                              isRightCorrect ? 'border-green-400 bg-green-50 text-green-600' :
                              rightIntermediate !== '' ? 'border-orange-300 bg-orange-50 text-orange-600' :
                              'border-indigo-50 bg-white focus:border-indigo-200'
                          }`}
                      />
                  </div>
              </div>
            )}
        </div>
      </div>

      {showResult && !isCorrect && (
          <div className="absolute -top-3 bg-red-500 text-white px-3 py-1 rounded-full text-[10px] font-black shadow-lg">
             Đúng là: {problem.answer}
          </div>
      )}
    </div>
  );
};

export default ComparisonMath;
