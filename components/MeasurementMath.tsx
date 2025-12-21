
import React from 'react';
import { MathProblem } from '../types';
import { focusNextEmptyInput } from '../services/uiUtils';

interface Props {
  problem: MathProblem;
  onUpdate: (val: string) => void;
  showResult: boolean;
}

const MeasurementMath: React.FC<Props> = ({ problem, onUpdate, showResult }) => {
  const userVal = parseInt(problem.userAnswer || '');
  const isCorrect = showResult && userVal === problem.answer;
  const isWrong = showResult && !isCorrect;
  
  const inputColor = showResult 
      ? (isCorrect ? 'text-green-600 border-green-300 bg-green-50' : 'text-red-600 border-red-300 bg-red-50') 
      : 'text-gray-800 border-gray-300 bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onUpdate(val);
    if (val !== '') {
      setTimeout(() => focusNextEmptyInput(e.target), 300);
    }
  };

  const renderInput = (unit: string) => (
    <div className="relative inline-flex items-center gap-2">
      <input 
        type="number" 
        inputMode="numeric"
        data-priority="2"
        value={problem.userAnswer || ''}
        onChange={handleInputChange}
        disabled={showResult}
        className="w-24 text-center text-3xl font-black p-3 rounded-2xl border-4 outline-none transition-all shadow-sm"
        style={{ 
          borderColor: isCorrect ? '#86efac' : isWrong ? '#fca5a5' : '#d1d5db',
          backgroundColor: isCorrect ? '#f0fdf4' : isWrong ? '#fef2f2' : 'white',
          color: isCorrect ? '#16a34a' : isWrong ? '#dc2626' : '#1f2937'
        }}
        placeholder="?"
      />
      <span className="text-2xl font-black text-gray-500">{unit}</span>
      {isWrong && (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-red-500 text-white px-4 py-1.5 rounded-full text-sm font-black shadow-lg z-20 whitespace-nowrap">
          Đúng là: {problem.answer} {unit}
        </div>
      )}
    </div>
  );

  // 1. CÂN ĐĨA (CON CÁ) - ĐÃ TĂNG KÍCH THƯỚC
  if (problem.visualType === 'balance') {
    const weights = Array.isArray(problem.visualData) ? problem.visualData : [];
    return (
      <div className="bg-orange-50 p-6 sm:p-10 rounded-[32px] border-4 border-orange-100 flex flex-col items-center shadow-sm animate-fadeIn w-full">
        <h3 className="text-gray-700 text-lg sm:text-xl font-black mb-8 w-full text-center">Con cá nặng bao nhiêu kg?</h3>
        <div className="relative w-full max-w-[500px] h-64 mt-2">
           {/* Đế cân */}
           <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[40px] border-l-transparent border-r-[40px] border-r-transparent border-b-[80px] border-b-gray-400"></div>
           {/* Thanh ngang */}
           <div className="absolute bottom-[80px] left-0 w-full h-4 bg-gray-600 rounded-full shadow-sm"></div>
           
           {/* Đĩa bên trái (Cá to hơn) */}
           <div className="absolute bottom-[84px] left-0 w-[48%] flex flex-col items-center">
               <span className="text-7xl sm:text-9xl drop-shadow-xl animate-pulse">🐟</span>
               <div className="w-full h-3 bg-gray-300 rounded-full mt-2 shadow-inner"></div>
           </div>
           
           {/* Đĩa bên phải (Quả cân to hơn) */}
           <div className="absolute bottom-[84px] right-0 w-[48%] flex flex-col items-center gap-2">
              <div className="flex flex-wrap justify-center gap-2">
                {weights.map((w, idx) => (
                  <div key={idx} className="bg-orange-600 text-white text-base sm:text-xl font-black px-4 py-2 rounded-xl shadow-md border-b-4 border-orange-800 flex items-center justify-center min-w-[50px]">
                    {w}kg
                  </div>
                ))}
              </div>
              <div className="w-full h-3 bg-gray-300 rounded-full shadow-inner"></div>
           </div>
        </div>
        <div className="mt-12">{renderInput('kg')}</div>
      </div>
    );
  }

  // 2. CÂN BÀN / CÂN ĐỒNG HỒ (DƯA HẤU)
  if (problem.visualType === 'spring') {
    const weightVal = problem.visualData || 0;
    const rotation = (weightVal / 10) * 360;
    
    return (
      <div className="bg-emerald-50 p-6 rounded-[32px] border-4 border-emerald-100 flex flex-col items-center shadow-sm w-full">
        <h3 className="text-gray-700 text-lg sm:text-xl font-black mb-8">Quả dưa hấu nặng bao nhiêu kg?</h3>
        <div className="relative mb-6 flex flex-col items-center">
           <div className="text-8xl mb-8 drop-shadow-lg transform hover:scale-110 transition-transform">🍉</div>
           
           <div className="relative w-56 h-56 sm:w-64 sm:h-64">
              {/* Vỏ cân */}
              <div className="absolute inset-0 bg-emerald-600 rounded-3xl shadow-xl border-b-[12px] border-emerald-800"></div>
              
              {/* Mặt đồng hồ */}
              <div className="absolute inset-5 bg-white rounded-full border-8 border-gray-200 shadow-inner flex items-center justify-center">
                 <svg viewBox="0 0 100 100" className="w-full h-full p-1 overflow-visible">
                    {[...Array(10)].map((_, i) => {
                      const num = i + 1;
                      const angle = (num * 36) * (Math.PI / 180) - (Math.PI / 2);
                      const x = 50 + 36 * Math.cos(angle);
                      const y = 50 + 36 * Math.sin(angle);
                      const lineX1 = 50 + 40 * Math.cos(angle);
                      const lineY1 = 50 + 40 * Math.sin(angle);
                      const lineX2 = 50 + 46 * Math.cos(angle);
                      const lineY2 = 50 + 46 * Math.sin(angle);
                      
                      return (
                        <g key={num}>
                          <line x1={lineX1} y1={lineY1} x2={lineX2} y2={lineY2} stroke="#64748b" strokeWidth="2.5" />
                          <text 
                            x={x} 
                            y={y} 
                            textAnchor="middle" 
                            dominantBaseline="middle" 
                            className="font-black text-[12px] fill-gray-800"
                          >
                            {num}
                          </text>
                        </g>
                      );
                    })}
                    <g style={{ transform: `rotate(${rotation}deg)`, transformOrigin: '50% 50%', transition: 'transform 1s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
                       <path d="M50 50 L50 12" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />
                       <path d="M46 25 L50 8 L54 25 Z" fill="#ef4444" />
                    </g>
                    <circle cx="50" cy="50" r="5" fill="#1e293b" />
                 </svg>
              </div>
           </div>
        </div>
        <div className="mt-6">{renderInput('kg')}</div>
      </div>
    );
  }

  // 3. BÌNH NƯỚC (LÍT) - TĂNG CỠ CHỮ VẠCH CHIA
  if (problem.visualType === 'beaker') {
    const liquidLevel = (problem.visualData || 0) * 10;
    return (
      <div className="bg-blue-50 p-6 rounded-[32px] border-4 border-blue-100 flex flex-col items-center shadow-sm w-full">
        <h3 className="text-gray-700 text-lg sm:text-xl font-black mb-8">Bình nước chứa bao nhiêu Lít (l)?</h3>
        <div className="relative w-32 h-64 border-x-8 border-b-8 border-blue-200 rounded-b-2xl bg-white/70 mb-10 overflow-hidden shadow-inner">
            <div 
              className="absolute bottom-0 left-0 w-full bg-blue-400/70 transition-all duration-1000 border-t-4 border-blue-500"
              style={{ height: `${liquidLevel}%` }}
            >
              <div className="absolute top-0 left-0 w-full h-3 bg-blue-300/40 animate-pulse"></div>
            </div>
            {/* Vạch chia với chữ TO HƠN */}
            {[...Array(10)].map((_, i) => (
              <div key={i} className="absolute left-0 w-6 h-1 bg-blue-200" style={{ bottom: `${(i+1)*10}%` }}>
                 <span className="ml-8 text-sm sm:text-base font-black text-blue-500">{i+1}l</span>
              </div>
            ))}
        </div>
        {renderInput('l')}
      </div>
    );
  }

  // 4. TÍNH TOÁN ĐƠN VỊ (CM, DM...)
  return (
    <div className={`p-10 rounded-[40px] border-4 flex flex-col items-center justify-center bg-white shadow-md transition-all ${isCorrect ? 'border-green-400 bg-green-50' : isWrong ? 'border-red-400 bg-red-50' : 'border-pink-100 hover:border-pink-300'}`}>
        <div className="text-4xl font-black text-gray-700 font-mono flex items-center gap-4 flex-wrap justify-center">
            <span>{problem.numbers?.[0]}<span className="text-lg font-sans text-gray-400 ml-1 font-bold">{problem.unit}</span></span>
            <span className="text-pink-500">{problem.operators?.[0]}</span>
            <span>{problem.numbers?.[1]}<span className="text-lg font-sans text-gray-400 ml-1 font-bold">{problem.unit}</span></span>
            <span className="text-gray-300 text-3xl">=</span>
            {renderInput(problem.unit || '')}
        </div>
    </div>
  );
};

export default MeasurementMath;
