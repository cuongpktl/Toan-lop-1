
import React from 'react';
import { MathProblem } from '../types';
import { focusNextEmptyInput } from '../services/uiUtils';

interface Props {
  problem: MathProblem;
  onUpdate: (val: string) => void;
  showResult: boolean;
}

const GeometryMath: React.FC<Props> = ({ problem, onUpdate, showResult }) => {
  const isCorrect = showResult && parseInt(problem.userAnswer || '') === problem.answer;
  const isWrong = showResult && !isCorrect;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onUpdate(val);
    if (val !== '') {
      setTimeout(() => focusNextEmptyInput(e.target), 200);
    }
  };

  const toggleShape = (id: string) => {
    if (showResult) return;
    const userSelected = problem.userAnswer ? JSON.parse(problem.userAnswer) : [];
    let newSelection;
    if (userSelected.includes(id)) {
        newSelection = userSelected.filter((sid: string) => sid !== id);
    } else {
        newSelection = [...userSelected, id];
    }
    onUpdate(JSON.stringify(newSelection));
  };

  if (problem.visualType === 'identify_shape') {
      const visualData = problem.visualData || {};
      const { shapes = [], targetId = '' } = visualData;
      const userSelected: string[] = problem.userAnswer ? JSON.parse(problem.userAnswer) : [];
      
      const targetIds = shapes.filter((s: any) => s.type === targetId).map((s: any) => s.id);
      const missingCount = targetIds.filter((id: string) => !userSelected.includes(id)).length;
      const extraCount = userSelected.filter((id: string) => !targetIds.includes(id)).length;
      const isPerfect = userSelected.length > 0 && missingCount === 0 && extraCount === 0;

      // Tìm tên hình mục tiêu để hiển thị trong chú thích
      const targetName = problem.question?.toLowerCase().includes("tam giác") ? "hình Tam Giác" :
                         problem.question?.toLowerCase().includes("vuông") ? "hình Vuông" :
                         problem.question?.toLowerCase().includes("tròn") ? "hình Tròn" : "hình Chữ Nhật";

      return (
          <div className={`p-6 rounded-[32px] border-4 transition-all flex flex-col items-center w-full ${
              showResult ? (isPerfect ? 'border-green-400 bg-green-50' : 'border-red-400 bg-red-50') : 'border-white bg-white shadow-xl'
          }`}>
              <h3 className="text-xl font-black text-gray-800 mb-8 text-center uppercase">{problem.question}</h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8">
                  {shapes.map((shape: any) => {
                    const isSelected = userSelected.includes(shape.id);
                    const isTarget = shape.type === targetId;
                    
                    let statusClass = "border-transparent bg-gray-50";
                    if (showResult) {
                        if (isSelected && isTarget) statusClass = "border-green-500 bg-green-100 ring-4 ring-green-50";
                        else if (isSelected && !isTarget) statusClass = "border-red-500 bg-red-100 animate-shake";
                        else if (!isSelected && isTarget) statusClass = "border-green-300 border-dashed bg-white opacity-60";
                    } else {
                        if (isSelected) statusClass = "border-blue-500 bg-blue-50 ring-4 ring-blue-100 scale-105 shadow-md";
                    }

                    return (
                        <div 
                            key={shape.id} 
                            onClick={() => toggleShape(shape.id)} 
                            className={`relative transition-all cursor-pointer p-4 rounded-3xl border-4 flex flex-col items-center justify-center w-32 h-32 ${statusClass}`}
                        >
                            <svg width="100%" height="100%" viewBox="0 0 100 100">
                                <path d={shape.d} fill={shape.color} stroke="#334155" strokeWidth="3" />
                            </svg>
                            {showResult && isSelected && !isTarget && (
                                <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-[10px] font-black shadow-lg">✕</div>
                            )}
                            {showResult && isSelected && isTarget && (
                                <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-[10px] font-black shadow-lg">✓</div>
                            )}
                        </div>
                    );
                  })}
              </div>

              {/* Chú thích lỗi sai hoặc khen ngợi */}
              {showResult && (
                  <div className={`px-6 py-3 rounded-2xl font-bold text-sm sm:text-base animate-fadeIn ${isPerfect ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'}`}>
                      {isPerfect ? (
                          <span>🌟 Bé thật giỏi! Bé đã chọn đúng tất cả {targetIds.length} {targetName}.</span>
                      ) : (
                          <div className="flex flex-col items-center gap-1">
                              <span className="font-black">💡 Bé xem lại nhé:</span>
                              {extraCount > 0 && <span>• Bé đã chọn nhầm {extraCount} hình khác rồi.</span>}
                              {missingCount > 0 && <span>• Bé vẫn còn thiếu {missingCount} {targetName} nữa đấy.</span>}
                              <span className="text-xs opacity-80 mt-1">(Các hình có viền xanh lá là đáp án đúng)</span>
                          </div>
                      )}
                  </div>
              )}
          </div>
      )
  }

  if (problem.visualType === 'path_length') {
      const segments = Array.isArray(problem.visualData) ? problem.visualData : [];
      const points: {x: number, y: number}[] = [{x: 20, y: 80}];
      const angles = [0, -45, 10]; 
      const scale = 35;

      segments.forEach((s, i) => {
          const prev = points[i];
          const angle = (angles[i] || 0) * (Math.PI / 180);
          points.push({
              x: prev.x + s.length * scale * Math.cos(angle),
              y: prev.y + s.length * scale * Math.sin(angle)
          });
      });

      return (
          <div className={`p-6 rounded-[32px] border-4 flex flex-col items-center justify-center bg-white shadow-xl w-full ${isCorrect ? 'border-green-400 bg-green-50' : isWrong ? 'border-red-400 bg-red-50' : 'border-teal-100'}`}>
               <h3 className="text-xl font-black text-gray-800 mb-4 text-center">{problem.question}</h3>
               
               <div className="w-full max-w-[400px] bg-slate-50 rounded-2xl mb-6 p-4">
                    <svg viewBox="0 0 400 120" className="w-full h-auto overflow-visible">
                        {segments.map((s, i) => (
                            <g key={i}>
                                <line 
                                    x1={points[i].x} y1={points[i].y} 
                                    x2={points[i+1].x} y2={points[i+1].y} 
                                    stroke="#0d9488" strokeWidth="6" strokeLinecap="round" 
                                />
                                <text 
                                    x={(points[i].x + points[i+1].x) / 2} 
                                    y={(points[i].y + points[i+1].y) / 2 - 15} 
                                    textAnchor="middle" 
                                    className="fill-teal-600 font-black text-lg"
                                >
                                    {s.length}cm
                                </text>
                                <circle cx={points[i].x} cy={points[i].y} r="5" fill="#0d9488" />
                                {i === segments.length - 1 && <circle cx={points[i+1].x} cy={points[i+1].y} r="5" fill="#0d9488" />}
                            </g>
                        ))}
                    </svg>
               </div>

               <div className="flex items-center gap-2 mb-6 text-rose-600 font-black text-2xl">
                 {segments.map((s: any, idx: number) => (
                   <React.Fragment key={idx}>
                     <span>{s.length}cm</span>
                     {idx < segments.length - 1 && <span>+</span>}
                   </React.Fragment>
                 ))}
               </div>

               <div className="flex items-center gap-4 bg-teal-50 p-6 rounded-3xl border-2 border-teal-100">
                    <input 
                        type="number" 
                        inputMode="numeric"
                        data-priority="2"
                        value={problem.userAnswer || ''}
                        onChange={handleInputChange}
                        disabled={showResult}
                        className={`w-24 text-center text-3xl font-black p-3 rounded-2xl border-4 outline-none transition-all shadow-sm ${
                            showResult ? (isCorrect ? 'text-green-600 border-green-400' : 'text-red-500 border-red-400') : 'text-gray-800 border-gray-200 focus:border-teal-400'
                        }`}
                        placeholder="..."
                    />
                    <span className="text-xl font-black text-teal-600">cm</span>
                    {isWrong && (
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-red-500 text-white px-4 py-1.5 rounded-full text-sm font-black shadow-lg z-20 whitespace-nowrap">
                            Đúng là: {problem.answer} cm
                        </div>
                    )}
               </div>
          </div>
      )
  }

  return null;
};

export default GeometryMath;
