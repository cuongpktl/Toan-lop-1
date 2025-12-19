
import React from 'react';
import { MathProblem } from '../types';

interface Props {
  problem: MathProblem;
  onUpdate: (val: string) => void;
  showResult: boolean;
}

const MultipleChoiceMath: React.FC<Props> = ({ problem, onUpdate, showResult }) => {
  const options = problem.options || [];
  const userAns = problem.userAnswer || '';
  const isCorrect = showResult && userAns === problem.answer;

  const labels = ['A', 'B', 'C', 'D'];

  return (
    <div className={`p-8 rounded-[40px] border-4 bg-white shadow-sm transition-all flex flex-col items-start gap-6 ${
      showResult ? (isCorrect ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50') : 'border-blue-100 hover:border-blue-200'
    }`}>
      {/* Question Header */}
      <div className="flex items-start gap-4 w-full">
         <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
             <span className="text-blue-600 font-black">?</span>
         </div>
         <p className="text-xl font-bold text-gray-800 leading-relaxed text-left">
            {problem.question}
         </p>
      </div>
      
      {/* Options Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full pt-4 border-t border-gray-50">
        {options.map((opt, index) => {
            const isSelected = userAns === String(opt);
            const isThisCorrect = showResult && String(opt) === problem.answer;
            const isThisWrong = showResult && isSelected && String(opt) !== problem.answer;

            return (
              <button
                key={index}
                onClick={() => !showResult && onUpdate(String(opt))}
                className={`flex items-center gap-4 p-4 rounded-2xl border-4 transition-all text-left group
                  ${isSelected ? 'border-blue-500 bg-blue-50 shadow-md' : 'border-gray-100 bg-gray-50 hover:bg-white hover:border-blue-200'}
                  ${isThisCorrect ? 'border-green-500 bg-green-100' : ''}
                  ${isThisWrong ? 'border-red-500 bg-red-100 animate-shake' : ''}
                `}
              >
                <div className={`w-10 h-10 rounded-full border-4 flex items-center justify-center font-black transition-all
                  ${isSelected ? 'bg-blue-500 border-blue-600 text-white' : 'bg-white border-gray-200 text-gray-400 group-hover:border-blue-300 group-hover:text-blue-500'}
                  ${isThisCorrect ? 'bg-green-500 border-green-600 text-white' : ''}
                  ${isThisWrong ? 'bg-red-500 border-red-600 text-white' : ''}
                `}>
                  {labels[index]}
                </div>
                <span className={`text-lg font-black ${isSelected ? 'text-blue-700' : 'text-gray-600'}`}>
                   {opt}
                </span>
              </button>
            );
        })}
      </div>
      
      {showResult && !isCorrect && (
        <div className="mt-2 text-red-500 font-black animate-fadeIn bg-white px-4 py-2 rounded-xl border-2 border-red-100">
           💡 Bé chọn chưa đúng rồi! Đáp án chính xác là phương án có khoanh xanh nhé.
        </div>
      )}
      
      {isCorrect && (
        <div className="mt-2 text-green-600 font-black animate-fadeIn">
          🌟 Bé tuyệt vời quá! Quan sát và tính toán rất tốt!
        </div>
      )}
    </div>
  );
};

export default MultipleChoiceMath;
