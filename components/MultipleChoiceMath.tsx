
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

  // --- Shortest Path Grid Renderer ---
  const renderPathGrid = () => {
    if (problem.visualType !== 'shortest_path') return null;
    const { paths = [], startEmoji, endEmoji, gridSize } = problem.visualData || {};
    
    const cellWidth = 60;
    const cellHeight = 60;
    const width = gridSize.cols * cellWidth;
    const height = gridSize.rows * cellHeight;

    return (
      <div className="w-full flex justify-center py-6 bg-slate-50 rounded-[32px] mb-6 overflow-hidden">
        <svg 
          viewBox={`-40 -40 ${width + 80} ${height + 80}`} 
          className="w-full max-w-[400px] h-auto drop-shadow-md overflow-visible"
        >
          {/* Lưới Grid */}
          {[...Array(gridSize.cols + 1)].map((_, c) => (
            <line key={`v-${c}`} x1={c * cellWidth} y1={0} x2={c * cellWidth} y2={height} stroke="#e2e8f0" strokeWidth="2" />
          ))}
          {[...Array(gridSize.rows + 1)].map((_, r) => (
            <line key={`h-${r}`} x1={0} y1={r * cellHeight} x2={width} y2={r * cellHeight} stroke="#e2e8f0" strokeWidth="2" />
          ))}

          {/* Vẽ các đường đi (Paths) */}
          {paths.map((path: number[][], pIdx: number) => {
            const points = path.map(p => `${p[0] * cellWidth},${height - p[1] * cellHeight}`).join(" ");
            const isPath1 = pIdx === 0;
            const strokeColor = isPath1 ? "#3b82f6" : "#f59e0b"; // Xanh cho 1, Cam cho 2
            
            return (
              <g key={`path-${pIdx}`}>
                <polyline 
                  points={points} 
                  fill="none" 
                  stroke={strokeColor} 
                  strokeWidth="6" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />
                {/* Mũi tên chỉ hướng */}
                {path.slice(1).map((p, i) => {
                  const curr = path[i];
                  const next = p;
                  const x = next[0] * cellWidth;
                  const y = height - next[1] * cellHeight;
                  const dx = next[0] - curr[0];
                  const dy = next[1] - curr[1];
                  const angle = Math.atan2(-dy, dx) * (180 / Math.PI);

                  return (
                    <path 
                      key={`arrow-${i}`}
                      d="M -6 -6 L 0 0 L -6 6" 
                      fill="none" 
                      stroke={strokeColor} 
                      strokeWidth="3" 
                      strokeLinecap="round"
                      transform={`translate(${x}, ${y}) rotate(${angle})`}
                    />
                  );
                })}
                {/* Số hiệu đường đi ở điểm bắt đầu */}
                <text 
                  x={path[1][0] * cellWidth / 2 - 15} 
                  y={height - path[1][1] * cellHeight / 2 + 15} 
                  className="font-black text-2xl" 
                  fill={strokeColor}
                >
                  {pIdx + 1}
                </text>
              </g>
            );
          })}

          {/* Bắt đầu: Thỏ */}
          <text x="-15" y={height + 15} className="text-4xl">{startEmoji}</text>
          {/* Kết thúc: Cà rốt */}
          <text x={width - 15} y="-15" className="text-4xl">{endEmoji}</text>
        </svg>
      </div>
    );
  };

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

      {/* Grid Graphic for shortest path */}
      {renderPathGrid()}
      
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
