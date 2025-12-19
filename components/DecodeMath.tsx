
import React, { useState, useEffect } from 'react';
import { MathProblem } from '../types';

interface Props {
  problem: MathProblem;
  onUpdate: (val: string) => void;
  showResult: boolean;
}

const ICON_MAP: Record<string, string> = {
  pig: "🐷",
  cat: "🐱",
  chick: "🐥",
  dog: "🐶"
};

const DecodeMath: React.FC<Props> = ({ problem, onUpdate, showResult }) => {
  const visualData = problem.visualData || {};
  const { icon1 = 'pig', icon2 = 'cat', legend = {} } = visualData;
  
  // State cho 2 ô điền số gợi ý dưới con vật
  const [hint1, setHint1] = useState('');
  const [hint2, setHint2] = useState('');

  // Reset hints khi đổi câu hỏi
  useEffect(() => {
    setHint1('');
    setHint2('');
  }, [problem.id]);

  const isCorrect = showResult && parseInt(problem.userAnswer || '') === problem.answer;
  const isWrong = showResult && !isCorrect;

  // Kiểm tra gợi ý có đúng với bảng quy đổi không (để hiện màu xanh/đỏ cho bé)
  const isHint1Correct = hint1 !== '' && parseInt(hint1) === legend[icon1];
  const isHint2Correct = hint2 !== '' && parseInt(hint2) === legend[icon2];

  return (
    <div className={`p-6 sm:p-10 rounded-[48px] border-4 bg-white shadow-xl transition-all flex flex-col items-center gap-8 ${
      showResult ? (isCorrect ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50') : 'border-purple-100'
    }`}>
      <div className="flex items-center gap-4 sm:gap-12">
        {/* Con vật 1 + Ô giải mã 1 */}
        <div className="flex flex-col items-center gap-3">
            <div className="text-5xl sm:text-7xl drop-shadow-md animate-bounce-short" style={{ animationDuration: '3s' }}>
                {ICON_MAP[icon1] || "🐾"}
            </div>
            <div className="relative">
                <input 
                    type="number"
                    inputMode="numeric"
                    value={hint1}
                    onChange={(e) => setHint1(e.target.value)}
                    disabled={showResult}
                    className={`w-12 h-12 sm:w-16 sm:h-16 text-center text-xl font-black rounded-xl border-2 transition-all shadow-inner outline-none ${
                        hint1 === '' ? 'border-gray-200 bg-gray-50' : 
                        (isHint1Correct ? 'border-green-400 bg-green-50 text-green-600' : 'border-orange-300 bg-orange-50 text-orange-600')
                    } ${showResult ? 'opacity-50' : 'focus:border-purple-400 focus:ring-4 focus:ring-purple-50'}`}
                    placeholder="?"
                />
                {showResult && !isHint1Correct && (
                   <div className="absolute -bottom-2 -right-2 bg-green-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black border-2 border-white">
                       {legend[icon1]}
                   </div>
                )}
            </div>
        </div>

        {/* Phép tính */}
        <div className="text-4xl font-black text-purple-400 mb-12">
            {problem.operators?.[0]}
        </div>

        {/* Con vật 2 + Ô giải mã 2 */}
        <div className="flex flex-col items-center gap-3">
            <div className="text-5xl sm:text-7xl drop-shadow-md animate-bounce-short" style={{ animationDuration: '3.5s' }}>
                {ICON_MAP[icon2] || "🐾"}
            </div>
            <div className="relative">
                <input 
                    type="number"
                    inputMode="numeric"
                    value={hint2}
                    onChange={(e) => setHint2(e.target.value)}
                    disabled={showResult}
                    className={`w-12 h-12 sm:w-16 sm:h-16 text-center text-xl font-black rounded-xl border-2 transition-all shadow-inner outline-none ${
                        hint2 === '' ? 'border-gray-200 bg-gray-50' : 
                        (isHint2Correct ? 'border-green-400 bg-green-50 text-green-600' : 'border-orange-300 bg-orange-50 text-orange-600')
                    } ${showResult ? 'opacity-50' : 'focus:border-purple-400 focus:ring-4 focus:ring-purple-50'}`}
                    placeholder="?"
                />
                {showResult && !isHint2Correct && (
                   <div className="absolute -bottom-2 -right-2 bg-green-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black border-2 border-white">
                       {legend[icon2]}
                   </div>
                )}
            </div>
        </div>

        {/* Dấu bằng */}
        <div className="text-4xl font-black text-gray-300 mb-12">
            =
        </div>

        {/* Kết quả cuối cùng */}
        <div className="relative mb-12">
          <input 
            type="number" 
            inputMode="numeric"
            value={problem.userAnswer || ''}
            onChange={(e) => onUpdate(e.target.value)}
            disabled={showResult}
            className={`w-24 sm:w-32 text-center text-4xl font-black p-4 rounded-3xl border-4 outline-none transition-all shadow-lg ${
              showResult 
              ? (isCorrect ? 'text-green-600 border-green-300 bg-white' : 'text-red-500 border-red-300 bg-white') 
              : 'text-gray-800 border-gray-200 bg-gray-50 focus:border-purple-500 focus:bg-white focus:ring-8 focus:ring-purple-50'
            }`}
            placeholder="?"
          />
          {isWrong && (
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-red-500 text-white px-4 py-1.5 rounded-full text-sm font-black shadow-xl whitespace-nowrap z-20 animate-bounce-short">
              Đáp án: {problem.answer}
            </div>
          )}
        </div>
      </div>

      <div className="w-full h-1 bg-purple-50 rounded-full"></div>

      {isCorrect ? (
        <div className="text-green-600 font-black animate-fadeIn text-lg flex items-center gap-2">
          <span>🌟</span> Bé giải mã và tính toán xuất sắc!
        </div>
      ) : (
        <p className="text-gray-400 font-bold text-sm italic">
          Bé hãy điền số tương ứng vào các ô nhỏ dưới con vật trước nhé!
        </p>
      )}
    </div>
  );
};

export default DecodeMath;
