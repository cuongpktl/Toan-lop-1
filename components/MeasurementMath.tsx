
import React, { useMemo } from 'react';
import { MathProblem } from '../types';
import { focusNextEmptyInput } from '../services/uiUtils';

interface Props {
  problem: MathProblem;
  onUpdate: (val: string) => void;
  showResult: boolean;
}

// Hằng số vạch chia độ tĩnh để tránh recalculate
const STATIC_TICKS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// Input con được tối ưu hóa
const MeasurementInput: React.FC<{
    value: string;
    answer: number;
    unit: string;
    showResult: boolean;
    onUpdate: (val: string) => void;
}> = React.memo(({ value, answer, unit, showResult, onUpdate }) => {
    const userVal = parseInt(value || '');
    const isCorrect = showResult && userVal === answer;
    const isWrong = showResult && !isCorrect;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        onUpdate(val);
        // Trì hoãn focus để trình duyệt rảnh tay render
        if (val !== '') {
            setTimeout(() => focusNextEmptyInput(e.target), 100);
        }
    };

    return (
        <div className="relative inline-flex items-center gap-2">
            <input 
                type="number" 
                inputMode="numeric"
                value={value || ''}
                onChange={handleChange}
                disabled={showResult}
                className={`w-20 sm:w-24 text-center text-2xl sm:text-3xl font-black p-2 sm:p-3 rounded-2xl border-4 outline-none transition-colors shadow-sm ${
                    showResult ? (isCorrect ? 'border-green-300 bg-green-50 text-green-700' : 'border-red-300 bg-red-50 text-red-700') : 'border-gray-200 bg-white focus:border-pink-300'
                }`}
                placeholder="?"
            />
            <span className="text-xl sm:text-2xl font-black text-gray-400">{unit}</span>
            {isWrong && (
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-red-500 text-white px-4 py-1.5 rounded-full text-xs font-black shadow-lg z-20 whitespace-nowrap animate-fadeIn">
                    Đúng là: {answer} {unit}
                </div>
            )}
        </div>
    );
});

const MeasurementMath: React.FC<Props> = ({ problem, onUpdate, showResult }) => {
  const userVal = useMemo(() => parseInt(problem.userAnswer || ''), [problem.userAnswer]);
  const isCorrect = showResult && userVal === problem.answer;

  // --- 1. CÂN ĐĨA ---
  if (problem.visualType === 'balance') {
    const weights = Array.isArray(problem.visualData) ? problem.visualData : [];
    return (
      <div className="bg-orange-50 p-6 rounded-[32px] border-4 border-orange-100 flex flex-col items-center shadow-sm w-full overflow-hidden">
        <h3 className="text-gray-700 text-lg font-black mb-6 text-center uppercase">Con cá nặng bao nhiêu kg?</h3>
        <div className="relative w-full max-w-[400px] h-48 sm:h-56">
           <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[30px] border-l-transparent border-r-[30px] border-r-transparent border-b-[60px] border-b-gray-400"></div>
           <div className="absolute bottom-[60px] left-0 w-full h-3 bg-gray-600 rounded-full"></div>
           <div className="absolute bottom-[63px] left-[5%] w-[40%] flex flex-col items-center">
               <span className="text-6xl sm:text-7xl drop-shadow-md">🐟</span>
               <div className="w-full h-2 bg-gray-300 rounded-full mt-1"></div>
           </div>
           <div className="absolute bottom-[63px] right-[5%] w-[40%] flex flex-col items-center gap-1">
              <div className="flex flex-wrap justify-center gap-1">
                {weights.map((w, idx) => (
                  <div key={idx} className="bg-orange-600 text-white text-[10px] font-black px-2 py-1 rounded-lg shadow-sm">
                    {w}kg
                  </div>
                ))}
              </div>
              <div className="w-full h-2 bg-gray-300 rounded-full mt-1"></div>
           </div>
        </div>
        <div className="mt-8">
            <MeasurementInput value={problem.userAnswer || ''} answer={problem.answer} unit="kg" showResult={showResult} onUpdate={onUpdate} />
        </div>
      </div>
    );
  }

  // --- 2. CÂN ĐỒNG HỒ ---
  if (problem.visualType === 'spring') {
    const weightVal = Number(problem.visualData) || 0;
    const rotation = useMemo(() => (Number.isFinite(weightVal) ? (weightVal / 10) * 360 : 0), [weightVal]);
    
    // Tính toán vạch chia độ bằng useMemo để giảm tải CPU
    const tickMarks = useMemo(() => STATIC_TICKS.map(num => {
        const angle = (num * 36) * (Math.PI / 180) - (Math.PI / 2);
        return {
            num,
            x: 50 + 36 * Math.cos(angle),
            y: 50 + 36 * Math.sin(angle)
        };
    }), []);

    return (
      <div className="bg-emerald-50 p-6 rounded-[32px] border-4 border-emerald-100 flex flex-col items-center shadow-sm w-full overflow-hidden">
        <h3 className="text-gray-700 text-lg font-black mb-6 uppercase">Quả dưa hấu nặng bao nhiêu kg?</h3>
        <div className="flex flex-col items-center gap-4">
           <div className="text-7xl sm:text-8xl drop-shadow-md">🍉</div>
           <div className="relative w-48 h-48 sm:w-56 sm:h-56">
              <div className="absolute inset-0 bg-emerald-600 rounded-3xl shadow-lg border-b-8 border-emerald-800"></div>
              <div className="absolute inset-4 bg-white rounded-full border-4 border-gray-100 flex items-center justify-center">
                 <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
                    {tickMarks.map(tm => (
                      <text key={tm.num} x={tm.x} y={tm.y} textAnchor="middle" dominantBaseline="middle" className="font-black text-[9px] fill-gray-500">{tm.num}</text>
                    ))}
                    {/* BỎ transition CSS ở đây vì nó là thủ phạm chính gây đơ trên nhiều trình duyệt */}
                    <g transform={`rotate(${rotation}, 50, 50)`}>
                       <line x1="50" y1="50" x2="50" y2="15" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
                       <path d="M47 25 L50 10 L53 25 Z" fill="#ef4444" />
                    </g>
                    <circle cx="50" cy="50" r="4" fill="#1e293b" />
                 </svg>
              </div>
           </div>
        </div>
        <div className="mt-8">
            <MeasurementInput value={problem.userAnswer || ''} answer={problem.answer} unit="kg" showResult={showResult} onUpdate={onUpdate} />
        </div>
      </div>
    );
  }

  // --- 3. BÌNH NƯỚC ---
  if (problem.visualType === 'beaker') {
    const level = Number(problem.visualData) || 0;
    const liquidHeight = useMemo(() => (Number.isFinite(level) ? Math.min(100, Math.max(0, level * 10)) : 0), [level]);
    
    return (
      <div className="bg-blue-50 p-6 rounded-[32px] border-4 border-blue-100 flex flex-col items-center shadow-sm w-full overflow-hidden">
        <h3 className="text-gray-700 text-lg font-black mb-6 uppercase">Bình nước chứa bao nhiêu Lít (l)?</h3>
        <div className="relative w-20 h-40 sm:w-28 sm:h-56 border-x-4 border-b-4 border-blue-200 rounded-b-xl bg-white/40 mb-8 overflow-hidden">
            <div className="absolute bottom-0 left-0 w-full bg-blue-400/50" style={{ height: `${liquidHeight}%` }}></div>
            {STATIC_TICKS.map(num => (
              <div key={num} className="absolute left-0 w-3 h-0.5 bg-blue-200" style={{ bottom: `${num * 10}%` }}>
                 <span className="ml-4 text-[9px] font-black text-blue-400">{num}l</span>
              </div>
            ))}
        </div>
        <MeasurementInput value={problem.userAnswer || ''} answer={problem.answer} unit="l" showResult={showResult} onUpdate={onUpdate} />
      </div>
    );
  }

  // --- 4. TÍNH TOÁN ---
  return (
    <div className={`p-8 rounded-[40px] border-4 flex flex-col items-center justify-center bg-white shadow-sm transition-colors ${showResult ? (isCorrect ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50') : 'border-pink-50'}`}>
        <div className="text-xl sm:text-2xl font-black text-gray-700 flex items-center gap-3 flex-wrap justify-center">
            <span>{problem.numbers?.[0]}<span className="text-xs text-gray-400 ml-1">{problem.unit}</span></span>
            <span className="text-pink-400">{problem.operators?.[0]}</span>
            <span>{problem.numbers?.[1]}<span className="text-xs text-gray-400 ml-1">{problem.unit}</span></span>
            <span className="text-gray-300 mx-2">=</span>
            <MeasurementInput value={problem.userAnswer || ''} answer={problem.answer} unit={problem.unit || ''} showResult={showResult} onUpdate={onUpdate} />
        </div>
    </div>
  );
};

export default React.memo(MeasurementMath);
