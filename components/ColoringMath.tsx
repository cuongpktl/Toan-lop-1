
import React, { useState } from 'react';
import { MathProblem } from '../types';

interface Props {
  problem: MathProblem;
  onUpdate: (val: string) => void;
  showResult: boolean;
}

const ColoringMath: React.FC<Props> = ({ problem, onUpdate, showResult }) => {
  const { cells = [], palette = [] } = problem.visualData || {};
  const [selectedColor, setSelectedColor] = useState<string | null>(palette[0]?.id || null);
  
  // Dữ liệu lưu trữ bao gồm cả màu sắc và kết quả số
  const userData = problem.userAnswer ? JSON.parse(problem.userAnswer) : { colors: {}, results: {} };
  const userColors = userData.colors || {};
  const userResults = userData.results || {};

  const handleHexClick = (cellId: string) => {
    if (showResult || !selectedColor) return;
    const newColors = { ...userColors, [cellId]: selectedColor };
    onUpdate(JSON.stringify({ ...userData, colors: newColors }));
  };

  const handleResultChange = (cellId: string, val: string) => {
    if (showResult) return;
    const newResults = { ...userResults, [cellId]: val };
    onUpdate(JSON.stringify({ ...userData, results: newResults }));
  };

  // KÍCH THƯỚC: Tăng HEX_SIZE để tổ ong to hẳn lên (Cũ: 75)
  const HEX_SIZE = 95; 
  const HEX_WIDTH = Math.sqrt(3) * HEX_SIZE;
  const HEX_HEIGHT = 2 * HEX_SIZE;

  const getHexPoints = () => {
    const points = [];
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 180) * (60 * i - 30);
      points.push(`${HEX_SIZE * Math.cos(angle)},${HEX_SIZE * Math.sin(angle)}`);
    }
    return points.join(' ');
  };

  return (
    <div className="flex flex-col items-center gap-4 p-2 sm:p-6 bg-white rounded-[48px] border-4 border-purple-100 shadow-xl animate-fadeIn">
      <div className="text-center space-y-1">
          <h3 className="text-2xl font-black text-purple-700 uppercase tracking-tight">TÔ MÀU TỔ ONG & TÍNH NHẨM</h3>
          <p className="text-gray-500 font-bold text-xs italic">Bé hãy tính kết quả điền vào ô rồi chọn màu tô nhé!</p>
      </div>

      {/* Bảng Quy Đổi Màu (BÉ LẠI THEO YÊU CẦU) */}
      <div className="flex flex-wrap justify-center gap-2 bg-purple-50 p-3 rounded-[24px] border border-purple-100 shadow-inner w-full max-w-xl">
         {palette.map((p: any) => (
            <div key={p.id} className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-xl border border-purple-100 shadow-sm">
               <div className="w-5 h-5 rounded-md shadow-sm border border-white" style={{ backgroundColor: p.color }}></div>
               <span className="font-black text-purple-800 text-[10px] sm:text-xs">{p.target} = {p.name}</span>
            </div>
         ))}
      </div>

      {/* Khu vực Tổ Ong (TO LÊN THEO YÊU CẦU) */}
      <div className="relative w-full overflow-x-auto no-scrollbar flex justify-center py-6">
        <svg 
          viewBox="0 0 900 850" 
          className="w-full max-w-[850px] h-auto drop-shadow-2xl overflow-visible"
        >
            {cells.map((cell: any) => {
               // Căn giữa cluster với kích thước mới to hơn
               const x = cell.q * (HEX_WIDTH + 8) + 450;
               const y = cell.r * (HEX_HEIGHT * 0.75 + 8) + 425;
               
               const userColorId = userColors[cell.id];
               const userColor = palette.find((p: any) => p.id === userColorId)?.color || '#f8fafc';
               const userVal = userResults[cell.id] || '';
               
               const colorCorrect = userColors[cell.id] === cell.targetColor;
               const resultCorrect = parseInt(userVal) === cell.targetValue;
               
               const isCorrect = showResult && colorCorrect && resultCorrect;

               return (
                  <g 
                    key={cell.id} 
                    transform={`translate(${x}, ${y})`} 
                    className="group"
                  >
                     {/* Hình Lục Giác To */}
                     <polygon 
                        points={getHexPoints()} 
                        fill={userColor} 
                        stroke={showResult ? (isCorrect ? '#22c55e' : '#ef4444') : '#e2e8f0'} 
                        strokeWidth={showResult && (userColorId || userVal) ? '10' : '5'}
                        onClick={() => handleHexClick(cell.id)}
                        className={`cursor-pointer transition-all duration-300 ${!showResult && 'hover:stroke-purple-300 hover:scale-[1.03]'}`}
                     />
                     
                     {/* Phép tính - Cỡ chữ TO HƠN */}
                     <text 
                        textAnchor="middle" 
                        y="-25"
                        className={`font-black select-none pointer-events-none transition-all ${
                            userColorId ? 'fill-white text-4xl' : 'fill-gray-700 text-3xl'
                        }`}
                        style={{ filter: userColorId ? 'drop-shadow(0 2px 2px rgba(0,0,0,0.5))' : 'none' }}
                     >
                        {cell.expression}
                     </text>

                     {/* Ô nhập kết quả - Cỡ số TO HƠN */}
                     <foreignObject x="-40" y="15" width="80" height="60" className="overflow-visible">
                        <div className="w-full h-full flex items-center justify-center">
                            <input 
                                type="number"
                                inputMode="numeric"
                                value={userVal}
                                onChange={(e) => handleResultChange(cell.id, e.target.value)}
                                disabled={showResult}
                                className={`w-18 h-14 text-center text-3xl font-black rounded-2xl border-4 outline-none transition-all shadow-md ${
                                    showResult 
                                    ? (resultCorrect ? 'bg-green-50 border-green-400 text-green-700' : 'bg-red-50 border-red-400 text-red-700') 
                                    : 'bg-white/95 border-gray-300 text-gray-800 focus:border-purple-500 focus:bg-white focus:scale-110'
                                }`}
                                placeholder="?"
                                style={{ width: '70px', height: '55px' }}
                            />
                        </div>
                     </foreignObject>

                     {/* Trạng thái tích/x */}
                     {showResult && (userColorId || userVal) && (
                        <g transform={`translate(${HEX_SIZE/1.2}, ${-HEX_SIZE/1.2})`}>
                            <circle r="20" fill={isCorrect ? '#22c55e' : '#ef4444'} stroke="white" strokeWidth="3" className="drop-shadow-md" />
                            {isCorrect ? (
                                <path d="M-8 0 L-2 8 L10 -8" fill="none" stroke="white" strokeWidth="5" strokeLinecap="round" />
                            ) : (
                                <path d="M-7 -7 L7 7 M-7 7 L7 -7" fill="none" stroke="white" strokeWidth="5" strokeLinecap="round" />
                            )}
                        </g>
                     )}
                  </g>
               );
            })}
        </svg>
      </div>

      {/* Bảng chọn màu (Bút chì) - THU NHỎ */}
      <div className="w-full border-t border-purple-100 pt-4 flex flex-col items-center gap-3">
          <div className="bg-white px-4 py-1 rounded-full border border-purple-100 shadow-sm">
             <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Bé chọn màu để tô:</span>
          </div>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
              {palette.map((p: any) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedColor(p.id)}
                    className={`group relative flex flex-col items-center gap-1 transition-all ${
                        selectedColor === p.id ? 'scale-105 -translate-y-1' : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                      <div 
                        className={`w-8 h-16 rounded-t-full rounded-b-lg shadow-md border-[3px] transition-all ${
                            selectedColor === p.id ? 'border-purple-500 ring-2 ring-purple-100' : 'border-white'
                        }`} 
                        style={{ backgroundColor: p.color }}
                      >
                          <div className="w-full h-4 bg-black/10 rounded-t-full flex items-center justify-center">
                             <div className="w-0.5 h-2 bg-white/20 rounded-full"></div>
                          </div>
                      </div>
                      <span className={`text-[8px] font-black uppercase tracking-tighter ${selectedColor === p.id ? 'text-purple-700' : 'text-gray-400'}`}>
                        {p.name}
                      </span>
                  </button>
              ))}
          </div>
      </div>
    </div>
  );
};

export default ColoringMath;
