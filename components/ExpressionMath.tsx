
import React, { useState, useEffect } from 'react';
import { MathProblem } from '../types';

interface Props {
  problem: MathProblem;
  onUpdate: (val: string) => void;
  showResult: boolean;
}

const ExpressionMath: React.FC<Props> = ({ problem, onUpdate, showResult }) => {
  const [intermediateVal, setIntermediateVal] = useState('');
  
  const n1 = problem.numbers?.[0] || 0;
  const n2 = problem.numbers?.[1] || 0;
  const n3 = problem.numbers?.[2] || 0;
  const op1 = problem.operators?.[0] || '+';
  const op2 = problem.operators?.[1] || '+';
  
  const step1Result = op1 === '+' ? n1 + n2 : n1 - n2;
  const isCorrect = showResult && parseInt(problem.userAnswer || '') === problem.answer;
  const isWrong = showResult && !isCorrect;

  // Trạng thái kiểm tra nhanh kết quả trung gian cho bé
  const isStep1Correct = intermediateVal !== '' && parseInt(intermediateVal) === step1Result;
  const isStep1Wrong = intermediateVal !== '' && parseInt(intermediateVal) !== step1Result;

  // Reset local state when problem changes
  useEffect(() => {
    setIntermediateVal('');
  }, [problem.id]);

  return (
    <div className={`p-8 rounded-[32px] border-2 bg-white shadow-sm transition-all flex flex-col items-center ${
      isCorrect ? 'border-green-400 bg-green-50' : isWrong ? 'border-red-400 bg-red-50' : 'border-purple-100 hover:border-purple-200'
    }`}>
        {/* Dòng biểu thức chính */}
        <div className="flex items-center gap-3 sm:gap-6 text-3xl sm:text-4xl font-black text-gray-700 font-mono mb-2">
            <div className="flex flex-col items-center">
                <span>{n1}</span>
            </div>
            <span className="text-purple-400">{op1}</span>
            <div className="flex flex-col items-center">
                <span>{n2}</span>
            </div>
            <span className="text-purple-400">{op2}</span>
            <div className="flex flex-col items-center">
                <span>{n3}</span>
            </div>
            <span className="text-gray-300">=</span>
            
            <div className="relative">
                <input 
                    type="number" 
                    inputMode="numeric"
                    value={problem.userAnswer || ''}
                    onChange={(e) => onUpdate(e.target.value)}
                    disabled={showResult}
                    className={`w-24 sm:w-28 text-center text-3xl font-black p-3 rounded-2xl border-4 outline-none transition-all ${
                        showResult 
                        ? (isCorrect ? 'text-green-600 border-green-300 bg-white' : 'text-red-500 border-red-300 bg-white') 
                        : 'text-gray-800 border-gray-200 bg-gray-50 focus:border-purple-400 focus:bg-white'
                    }`}
                    placeholder="?"
                />
                {isWrong && (
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-black shadow-lg whitespace-nowrap z-10">
                        Đáp án: {problem.answer}
                    </div>
                )}
            </div>
        </div>

        {/* Phần sơ đồ tính toán trung gian (Sơ đồ chữ V) - Căn chỉnh lệch trái hơn nữa */}
        <div className="flex w-full max-w-[400px] mt-1 relative h-20">
            {/* Đường kẻ nối chữ V - Kéo hẳn sang trái, chừa khoảng cách với op2 */}
            <div className="absolute top-0 left-[2%] right-[70%] h-8 border-l-4 border-b-4 border-r-4 border-purple-200 rounded-b-2xl"></div>
            
            {/* Ô kết quả trung gian - Nằm lệch trái dưới n1 và n2 */}
            <div className="absolute top-8 left-[16%] -translate-x-1/2 flex flex-col items-center">
                <div className="relative group">
                    <input 
                        type="number"
                        inputMode="numeric"
                        placeholder="..."
                        value={intermediateVal}
                        onChange={(e) => setIntermediateVal(e.target.value)}
                        disabled={showResult}
                        className={`w-16 h-12 text-center text-lg font-black rounded-xl border-2 outline-none transition-all shadow-sm ${
                            isStep1Correct ? 'border-green-400 bg-green-50 text-green-600' :
                            isStep1Wrong ? 'border-orange-300 bg-orange-50 text-orange-600' :
                            'border-purple-100 bg-purple-50 focus:border-purple-300'
                        }`}
                    />
                    {isStep1Wrong && !showResult && (
                        <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 text-[10px] font-bold text-orange-500 whitespace-nowrap">
                            Tính lại nhé!
                        </div>
                    )}
                </div>
            </div>

            {/* Mũi tên dẫn sang bước tiếp theo - Dời sang trái để thông thoáng */}
            <div className="absolute top-10 left-[35%] text-purple-200 font-bold opacity-60">→</div>

            {/* Nhắc lại phép tính và số thứ 3 - Dời vị trí để không bị chồng lấn */}
            <div className="absolute top-8 left-[58%] -translate-x-1/2 flex flex-col items-center">
                <div className="flex items-center gap-2 text-gray-400 font-bold">
                    <span className="text-purple-300">{op2}</span>
                    <span className="bg-gray-50 px-3 py-1 rounded-lg border border-gray-100">{n3}</span>
                </div>
            </div>
        </div>
        
        {isCorrect && (
            <div className="mt-2 text-green-600 font-black text-sm animate-bounce-short">
                🌟 Bé giỏi lắm! Tính rất chuẩn!
            </div>
        )}
    </div>
  );
};

export default ExpressionMath;
