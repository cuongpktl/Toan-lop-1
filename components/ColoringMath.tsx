
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

  // KÍCH THƯỚC: Giữ nguyên kích thước to rõ
  const HEX_SIZE = 65; 
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
    <div className="flex flex-col items-center gap-6 p-4 sm:p-8 bg-white rounded-[48px] border-4 border-purple-100 shadow-xl animate-fadeIn">
      <div className="text-center space-y-2">
          <h3 className="text-2xl font-black text-purple-700 uppercase tracking-tight">Tô Màu Tổ Ong & Tính Nhẩm</h3>
          <p className="text-gray-500 font-bold text-sm italic">Bé hãy tính kết quả điền vào ô rồi chọn màu tô nhé!</p>
      </div>

      {/* Bảng Quy Đổi Màu (Ghi chú màu) */}
      <div className="flex flex-wrap justify-center gap-3 bg-purple-50 p-4 rounded-[32px] border-2 border-purple-100 shadow-inner w-full max-w-2xl">
         {palette.map((p: any) => (
            <div key={p.id} className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-2xl border-2 border-purple-100 shadow-sm">
               <div className="w-8 h-8 rounded-lg shadow-sm border-2 border-white" style={{ backgroundColor: p.color }}></div>
               <span className="font-black text-purple-800 text-sm sm:text-base">{p.target} = {p.name}</span>
            </div>
         ))}
      </div>

      {/* Khu vực Tổ Ong - Đã căn giữa và điều chỉnh vị trí */}
      <div className="relative w-full overflow-x-auto no-scrollbar flex justify-center py-4">
        <svg 
          viewBox="0 0 700 650" 
          className="w-full max-w-[650px] h-auto drop-shadow-2xl overflow-visible"
        >
            {cells.map((cell: any) => {
               // Căn giữa cluster 15 ô bằng cách sử dụng offset centerX và centerY
               // Offset 350 là tâm ngang của viewBox 700
               // Offset 320 là tâm dọc của viewBox 650
               const x = cell.q * (HEX_WIDTH + 4) + 350;
               const y = cell.r * (HEX_HEIGHT * 0.75 + 4) + 320;
               
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
                     {/* Hình Lục Giác */}
                     <polygon 
                        points={getHexPoints()} 
                        fill={userColor} 
                        stroke={showResult ? (isCorrect ? '#22c55e' : '#ef4444') : '#e2e8f0'} 
                        strokeWidth={showResult && (userColorId || userVal) ? '6' : '3'}
                        onClick={() => handleHexClick(cell.id)}
                        className={`cursor-pointer transition-all duration-300 ${!showResult && 'hover:stroke-purple-300 hover:scale-[1.03]'}`}
                     />
                     
                     {/* Phép tính */}
                     <text 
                        textAnchor="middle" 
                        y="-15"
                        className={`font-black select-none pointer-events-none transition-all ${
                            userColorId ? 'fill-white drop-shadow-md text-2xl' : 'fill-gray-600 text-xl'
                        }`}
                        style={{ filter: userColorId ? 'drop-shadow(0 2px 2px rgba(0,0,0,0.3))' : 'none' }}
                     >
                        {cell.expression}
                     </text>

                     {/* Ô nhập kết quả */}
                     <foreignObject x="-25" y="10" width="50" height="35" className="overflow-visible">
                        <div className="w-full h-full flex items-center justify-center">
                            <input 
                                type="number"
                                inputMode="numeric"
                                value={userVal}
                                onChange={(e) => handleResultChange(cell.id, e.target.value)}
                                disabled={showResult}
                                className={`w-12 h-10 text-center text-lg font-black rounded-xl border-2 outline-none transition-all shadow-sm ${
                                    showResult 
                                    ? (resultCorrect ? 'bg-green-50 border-green-400 text-green-700' : 'bg-red-50 border-red-400 text-red-700') 
                                    : 'bg-white/90 border-gray-200 text-gray-800 focus:border-purple-500 focus:bg-white'
                                }`}
                                placeholder="?"
                            />
                        </div>
                     </foreignObject>

                     {/* Trạng thái tích/x */}
                     {showResult && (userColorId || userVal) && (
                        <g transform={`translate(${HEX_SIZE/1.5}, ${-HEX_SIZE/1.5})`}>
                            <circle r="14" fill={isCorrect ? '#22c55e' : '#ef4444'} stroke="white" strokeWidth="2" className="drop-shadow-md" />
                            {isCorrect ? (
                                <path d="M-6 0 L-1 5 L7 -5" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" />
                            ) : (
                                <path d="M-5 -5 L5 5 M-5 5 L5 -5" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" />
                            )}
                        </g>
                     )}
                  </g>
               );
            })}
        </svg>
      </div>

      {/* Bảng chọn màu (Bút chì) */}
      <div className="w-full border-t border-purple-100 pt-6 flex flex-col items-center gap-4">
          <div className="bg-white px-6 py-1.5 rounded-full border-2 border-purple-100 shadow-sm">
             <span className="text-xs font-black text-purple-400 uppercase tracking-[0.2em]">Bé chọn màu để tô:</span>
          </div>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
              {palette.map((p: any) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedColor(p.id)}
                    className={`group relative flex flex-col items-center gap-2 transition-all ${
                        selectedColor === p.id ? 'scale-110 -translate-y-2' : 'hover:scale-105 opacity-60 hover:opacity-100'
                    }`}
                  >
                      <div 
                        className={`w-12 h-24 rounded-t-full rounded-b-xl shadow-xl border-[6px] transition-all ${
                            selectedColor === p.id ? 'border-purple-500 ring-4 ring-purple-100' : 'border-white'
                        }`} 
                        style={{ backgroundColor: p.color }}
                      >
                          <div className="w-full h-8 bg-black/10 rounded-t-full flex items-center justify-center">
                             <div className="w-0.5 h-4 bg-white/20 rounded-full"></div>
                          </div>
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-widest ${selectedColor === p.id ? 'text-purple-700' : 'text-gray-400'}`}>
                        {p.name}
                      </span>
                      {selectedColor === p.id && (
                        <div className="absolute -top-4 bg-purple-500 text-white p-1 rounded-full shadow-lg border-2 border-white animate-bounce-short">
                           <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        </div>
                      )}
                  </button>
              ))}
          </div>
      </div>
    </div>
  );
};

export default ColoringMath;
