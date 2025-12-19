
import React from 'react';
import { MathProblem } from '../types';

interface Props {
  problem: MathProblem;
  onUpdate: (val: string) => void;
  showResult: boolean;
}

const MeasurementMath: React.FC<Props> = ({ problem, onUpdate, showResult }) => {
  const isCorrect = showResult && parseInt(problem.userAnswer || '') === problem.answer;
  const isWrong = showResult && !isCorrect;
  
  const inputColor = showResult 
      ? (isCorrect ? 'text-green-600 border-green-300 bg-green-50' : 'text-red-600 border-red-300 bg-red-50') 
      : 'text-gray-800 border-gray-300 bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100';

  const renderInput = (unit: string) => (
    <div className="relative inline-flex items-center gap-2">
      <input 
        type="number" 
        inputMode="numeric"
        value={problem.userAnswer || ''}
        onChange={(e) => onUpdate(e.target.value)}
        disabled={showResult}
        className={`w-20 text-center text-2xl font-black p-2 rounded-2xl border-4 outline-none transition-all ${inputColor}`}
        placeholder="?"
      />
      <span className="text-lg font-black text-gray-400">{unit}</span>
      {isWrong && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-red-500 text-white px-3 py-1 rounded-full text-[10px] font-black shadow-lg z-20 whitespace-nowrap">
          Đúng là: {problem.answer}
        </div>
      )}
    </div>
  );

  // --- 1. Cân đòn (Balance Scale) ---
  if (problem.visualType === 'balance') {
    const weights = Array.isArray(problem.visualData) ? problem.visualData : [];
    return (
      <div className="bg-orange-50 p-6 rounded-[32px] border-4 border-orange-100 flex flex-col items-center shadow-sm animate-fadeIn">
        <h3 className="text-gray-700 font-black mb-6 w-full text-center">Con cá nặng bao nhiêu kg?</h3>
        <div className="relative w-full max-w-[450px] h-56 mt-2">
          {/* Trụ cân */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[30px] border-l-transparent border-r-[30px] border-r-transparent border-b-[60px] border-b-gray-400"></div>
          
          {/* Thanh cân */}
          <div className="absolute bottom-[60px] left-0 w-full h-3 bg-gray-600 rounded-full shadow-sm"></div>
          
          {/* Đĩa cân bên trái (Chứa con cá) */}
          <div className="absolute bottom-[63px] left-0 w-52 h-2 bg-gray-400 origin-bottom flex justify-center">
            <div className="absolute bottom-2 flex flex-col items-center">
               {/* Hình con cá thực tế hơn */}
               <svg width="140" height="85" viewBox="0 0 120 70" className="drop-shadow-lg">
                  {/* Đuôi */}
                  <path d="M10 35 L 35 15 L 35 55 Z" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="1" />
                  {/* Thân */}
                  <path d="M35 35 Q 35 0 75 0 Q 115 0 115 35 Q 115 70 75 70 Q 35 70 35 35 Z" fill="#60A5FA" stroke="#1D4ED8" strokeWidth="1" />
                  {/* Vây lưng */}
                  <path d="M60 10 Q 75 -10 90 10" fill="#2563EB" stroke="#1D4ED8" strokeWidth="1" />
                  {/* Vây bụng */}
                  <path d="M65 60 Q 75 75 85 60" fill="#2563EB" stroke="#1D4ED8" strokeWidth="1" />
                  {/* Mắt */}
                  <circle cx="100" cy="25" r="5" fill="white" />
                  <circle cx="102" cy="25" r="2.5" fill="black" />
                  {/* Mang/Vảy */}
                  <path d="M50 25 Q 60 35 50 45" stroke="white" strokeWidth="2" fill="none" opacity="0.5"/>
                  <path d="M60 25 Q 70 35 60 45" stroke="white" strokeWidth="2" fill="none" opacity="0.3"/>
               </svg>
               <div className="w-40 h-2.5 bg-gray-300 rounded-full mt-1"></div>
            </div>
          </div>

          {/* Đĩa cân bên phải (Chứa quả cân) */}
          <div className="absolute bottom-[63px] right-0 w-52 h-2 bg-gray-400 flex flex-col-reverse items-center justify-start pb-2 gap-2">
            <div className="flex flex-wrap justify-center items-end gap-2 max-w-[180px]">
              {weights.map((w, idx) => (
                <div key={idx} className="relative flex flex-col items-center">
                   {/* Hình dáng quả cân to hơn tương ứng với con cá */}
                   <svg width="75" height="85" viewBox="0 0 45 50" className="drop-shadow-md">
                      <path d="M15 5 Q 22.5 0 30 5 L 30 15 L 40 15 Q 45 15 45 20 L 45 45 Q 45 50 40 50 L 5 50 Q 0 50 0 45 L 0 20 Q 0 15 5 15 L 15 15 Z" fill="#D97706" stroke="#92400E" strokeWidth="1" />
                      <text x="22.5" y="38" textAnchor="middle" fill="white" fontSize="15" fontWeight="900">{w}kg</text>
                   </svg>
                </div>
              ))}
            </div>
            <div className="w-40 h-2.5 bg-gray-300 rounded-full"></div>
          </div>
        </div>
        <div className="mt-8 flex items-center gap-4">
          {renderInput('kg')}
        </div>
      </div>
    );
  }

  // --- 2. Cân đồng hồ (Spring Scale) ---
  if (problem.visualType === 'spring') {
    const weight = typeof problem.visualData === 'number' ? problem.visualData : 0;
    const rotation = weight * 36;
    
    return (
      <div className="bg-emerald-50 p-6 rounded-[32px] border-4 border-emerald-100 flex flex-col items-center shadow-sm animate-fadeIn">
        <h3 className="text-gray-700 font-black mb-6 w-full text-center">Quả dưa hấu nặng bao nhiêu kg?</h3>
        <div className="relative w-56 h-72 flex flex-col items-center">
          <div className="z-10 w-40 h-32 -mb-2">
            <svg viewBox="0 0 100 80" className="w-full h-full drop-shadow-xl">
              <ellipse cx="50" cy="40" rx="45" ry="35" fill="#166534" />
              <path d="M15 40 Q 50 50 85 40 M 25 20 Q 50 30 75 20 M 25 60 Q 50 50 75 60" stroke="#4ade80" strokeWidth="4" fill="none" opacity="0.3"/>
              <path d="M50 5 Q 55 -2 60 5" stroke="#3f6212" strokeWidth="4" fill="none" />
            </svg>
          </div>
          <div className="w-36 h-4 bg-gray-300 rounded-full border-2 border-gray-400 shadow-inner"></div>
          <div className="w-8 h-12 bg-gray-400"></div>
          <div className="relative w-48 h-48 bg-emerald-600 rounded-[40px] border-b-8 border-emerald-800 shadow-2xl flex items-center justify-center">
            <div className="w-40 h-40 bg-white rounded-full relative border-4 border-emerald-700 shadow-inner flex items-center justify-center">
              {[...Array(20)].map((_, i) => (
                <div key={`small-${i}`} className="absolute inset-0 flex flex-col items-center" style={{ transform: `rotate(${i * 18}deg)` }}>
                  <div className="w-0.5 h-1.5 bg-gray-300 mt-1"></div>
                </div>
              ))}
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                <div key={n} className="absolute inset-0 flex flex-col items-center pt-1" style={{ transform: `rotate(${n * 36}deg)` }}>
                  <div className={`w-1.5 h-3.5 ${n % 5 === 0 ? 'bg-gray-800' : 'bg-gray-500'}`}></div>
                  <div className="mt-1" style={{ transform: `rotate(-${n * 36}deg)` }}>
                    {n === 0 ? (
                      <div className="flex flex-col items-center -mt-1">
                        <span className="text-[12px] font-black text-gray-900 leading-none">0</span>
                        <span className="text-[10px] font-black text-red-500 leading-none mt-0.5">10</span>
                      </div>
                    ) : (
                      <span className="text-[11px] font-black text-gray-600">{n}</span>
                    )}
                  </div>
                </div>
              ))}
              <div className="absolute text-[10px] font-black text-emerald-200 uppercase tracking-widest top-[65%]">kg</div>
              <div 
                className="absolute top-1/2 left-1/2 w-1.5 h-16 bg-red-600 origin-bottom -translate-x-1/2 -translate-y-full rounded-full transition-transform duration-1000 shadow-sm" 
                style={{ transform: `translate(-50%, -100%) rotate(${rotation}deg)` }}
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[8px] border-b-red-600 -mt-2"></div>
              </div>
              <div className="w-4 h-4 bg-gray-800 rounded-full z-10 shadow-md border-2 border-gray-400"></div>
            </div>
          </div>
        </div>
        <div className="mt-8">
          {renderInput('kg')}
        </div>
      </div>
    );
  }

  // --- 3. Bình chia độ (Beaker) ---
  if (problem.visualType === 'beaker') {
    const level = typeof problem.visualData === 'number' ? problem.visualData : 0;
    const baseY = 180;
    const waterY = baseY - (level * 16);
    const waterHeight = level * 16;

    return (
      <div className="bg-blue-50 p-6 rounded-[32px] border-4 border-blue-100 flex flex-col items-center shadow-sm animate-fadeIn">
        <h3 className="text-gray-700 font-black mb-6 w-full text-center">Bình nước chứa bao nhiêu Lít (l)?</h3>
        <div className="relative w-48 h-64 flex items-center justify-center">
          <svg width="160" height="220" viewBox="0 0 160 220" className="overflow-visible">
            <rect x="30" y="10" width="100" height="180" rx="10" fill="white" fillOpacity="0.8" stroke="#cbd5e1" strokeWidth="4" />
            <rect 
              x="32" 
              y={waterY} 
              width="96" 
              height={waterHeight} 
              rx="2" 
              fill="#60A5FA" 
              className="transition-all duration-1000"
            />
            {level > 0 && (
              <line x1="32" y1={waterY} x2="128" y2={waterY} stroke="#2563EB" strokeWidth="4" className="transition-all duration-1000" />
            )}
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(l => {
              const tickY = baseY - (l * 16);
              const isMajor = l % 2 === 0 || l === 0 || l === 10;
              return (
                <g key={l}>
                  <line 
                    x1={isMajor ? 80 : 100} 
                    y1={tickY} 
                    x2="130" 
                    y2={tickY} 
                    stroke={isMajor ? "#475569" : "#94a3b8"} 
                    strokeWidth={isMajor ? "3" : "1.5"} 
                  />
                  {isMajor && (
                    <text x="140" y={tickY + 5} className="text-[14px] font-black fill-gray-500">{l}</text>
                  )}
                </g>
              );
            })}
            <path d="M 30 180 Q 30 190 40 190 L 120 190 Q 130 190 130 180" fill="none" stroke="#cbd5e1" strokeWidth="4" />
          </svg>
        </div>
        <div className="mt-8 flex items-center gap-2">
          {renderInput('l')}
        </div>
      </div>
    );
  }

  // --- 4. Phép tính đơn vị ---
  return (
    <div className={`p-8 rounded-[32px] border-4 flex flex-col items-center justify-center bg-white shadow-sm transition-all ${isCorrect ? 'border-green-400 bg-green-50' : isWrong ? 'border-red-400 bg-red-50' : 'border-pink-100 hover:border-pink-300'}`}>
        <div className="text-3xl font-black text-gray-700 font-mono flex items-center gap-3 flex-wrap justify-center">
            <span>{problem.numbers?.[0]}<span className="text-sm font-sans text-gray-400 ml-1">{problem.unit}</span></span>
            <span className="text-pink-500">{problem.operators?.[0]}</span>
            <span>{problem.numbers?.[1]}<span className="text-sm font-sans text-gray-400 ml-1">{problem.unit}</span></span>
            <span className="text-gray-300">=</span>
            {renderInput(problem.unit || '')}
        </div>
    </div>
  );
};

export default MeasurementMath;
