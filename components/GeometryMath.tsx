
import React, { useState } from 'react';
import { MathProblem } from '../types';

interface Props {
  problem: MathProblem;
  onUpdate: (val: string) => void;
  showResult: boolean;
}

const GeometryMath: React.FC<Props> = ({ problem, onUpdate, showResult }) => {
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
  
  const isCorrect = showResult && parseInt(problem.userAnswer || '') === problem.answer;
  const isWrong = showResult && !isCorrect;

  // --- Identify Shape Render ---
  if (problem.visualType === 'identify_shape') {
      const visualData = (problem.visualData && typeof problem.visualData === 'object' && !Array.isArray(problem.visualData)) ? problem.visualData : {};
      const { targetId = '', shapes = [] } = visualData;
      
      const userSelected = problem.userAnswer ? JSON.parse(problem.userAnswer) : [];
      const targetShapeIds = shapes.filter((s: any) => s.type === targetId).map((s: any) => s.id);
      
      const isIdCorrect = showResult && 
          targetShapeIds.every((id: string) => userSelected.includes(id)) && 
          userSelected.every((id: string) => targetShapeIds.includes(id));
      
      const borderColor = showResult 
          ? (isIdCorrect ? 'border-green-400 bg-green-50' : 'border-red-400 bg-red-50')
          : 'border-white';

      return (
          <div className={`p-6 rounded-3xl border-4 flex flex-col items-center justify-center bg-white shadow-xl transition-all w-full ${borderColor}`}>
              <h3 className="text-xl font-black text-gray-800 mb-8 text-center uppercase tracking-tight">
                  {problem.question}
              </h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-10">
                  {shapes.map((shape: any) => {
                      const isSelected = userSelected.includes(shape.id);
                      const isTarget = shape.type === targetId;
                      
                      let shapeContainerClass = "relative transition-all duration-300 cursor-pointer p-4 rounded-3xl border-4 flex flex-col items-center justify-center ";
                      if (showResult) {
                          if (isTarget) {
                              shapeContainerClass += isSelected ? "border-green-500 bg-green-50 scale-105 shadow-green-100 " : "border-green-200 bg-white opacity-80 ";
                          } else {
                              shapeContainerClass += isSelected ? "border-red-500 bg-red-50 animate-shake " : "border-transparent opacity-40 ";
                          }
                      } else {
                          if (isSelected) shapeContainerClass += "border-orange-400 bg-orange-50 shadow-2xl shadow-orange-100 -translate-y-2 ";
                          else shapeContainerClass += "border-transparent bg-gray-50 hover:bg-white hover:border-gray-200 hover:shadow-lg ";
                      }

                      return (
                          <div key={shape.id} onClick={() => toggleShape(shape.id)} className={shapeContainerClass + "w-32 h-32 sm:w-40 sm:h-40"}>
                              <svg width="100%" height="100%" viewBox="0 0 100 100" className="overflow-visible drop-shadow-md">
                                  <path d={shape.d} fill={shape.color} stroke="#334155" strokeWidth="3" />
                                  <text x="50" y="55" textAnchor="middle" className="text-xl font-black fill-gray-800 pointer-events-none select-none" style={{ filter: 'drop-shadow(0px 1px 1px white)' }}>
                                      {shape.num || ''}
                                  </text>
                              </svg>

                              {showResult && isSelected && (
                                  <div className={`absolute -top-3 -right-3 rounded-full p-1.5 shadow-lg ${isTarget ? 'bg-green-500' : 'bg-red-500'}`}>
                                      {isTarget ? (
                                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                      ) : (
                                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                                      )}
                                  </div>
                              )}
                          </div>
                      )
                  })}
              </div>
              
              {showResult && (
                  <div className={`mt-10 px-6 py-3 rounded-2xl font-black text-lg ${isIdCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600 animate-bounce-short'}`}>
                      {isIdCorrect ? '🎉 Hoan hô! Bé chọn rất đúng!' : '🔍 Bé hãy nhìn kỹ các cạnh và chọn lại nhé!'}
                  </div>
              )}
          </div>
      )
  }

  // --- Path Length Render ---
  if (problem.visualType === 'path_length') {
      const segments = Array.isArray(problem.visualData) ? problem.visualData : [];
      const numPoints = segments.length + 1;
      const pointLabels = "ABCDE";
      const points = [];
      
      // Căn chỉnh khoảng cách dựa trên số điểm để luôn vừa khung
      const stepX = segments.length > 3 ? 60 : 80;
      const totalWidth = (numPoints - 1) * stepX + 40;
      let currentX = 20;
      
      for (let i = 0; i < numPoints; i++) {
          const y = i % 2 === 0 ? 80 : 20;
          points.push({ x: currentX, y, label: pointLabels[i] });
          currentX += stepX;
      }

      const pathD = points.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(" ");

      return (
          <div className={`p-6 rounded-[32px] border-4 flex flex-col items-center justify-center bg-white shadow-xl transition-all w-full ${isCorrect ? 'border-green-400 bg-green-50' : isWrong ? 'border-red-400 bg-red-50' : 'border-teal-100 hover:border-teal-300'}`}>
               <h3 className="text-xl font-black text-gray-800 mb-6 text-center">{problem.question}</h3>
               
               <div className="w-full max-w-md overflow-visible relative h-40 my-4 flex justify-center">
                   <svg width="100%" height="100%" viewBox={`0 0 ${totalWidth} 100`} preserveAspectRatio="xMidYMid meet" className="overflow-visible">
                       {/* Đường gấp khúc */}
                       <path d={pathD} fill="none" stroke="#0D9488" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-sm" />
                       
                       {/* Các điểm và nhãn điểm */}
                       {points.map((p, i) => (
                           <g key={i}>
                               <circle cx={p.x} cy={p.y} r="6" fill="#0F766E" stroke="white" strokeWidth="2" />
                               <text x={p.x} y={p.y + (p.y > 50 ? 25 : -15)} textAnchor="middle" className="text-sm font-black fill-teal-800">
                                   {p.label}
                               </text>
                           </g>
                       ))}
                       
                       {/* Độ dài đoạn thẳng */}
                       {segments.map((seg: any, i: number) => {
                           const p1 = points[i];
                           const p2 = points[i+1];
                           const mx = (p1.x + p2.x) / 2;
                           const my = (p1.y + p2.y) / 2;
                           
                           // Tính góc để nhãn song song hoặc nằm ngang dễ nhìn
                           return (
                               <g key={i}>
                                   <rect x={mx - 15} y={my - 12} width="30" height="18" rx="4" fill="white" fillOpacity="0.8" />
                                   <text x={mx} y={my + 2} textAnchor="middle" className="text-[12px] font-black fill-rose-600">
                                       {seg.length}
                                   </text>
                                   <text x={mx + 12} y={my + 2} textAnchor="start" className="text-[8px] font-bold fill-gray-400">
                                       cm
                                   </text>
                               </g>
                           )
                       })}
                   </svg>
               </div>

               <div className="flex flex-col sm:flex-row items-center gap-4 mt-8 bg-teal-50 p-6 rounded-3xl border-2 border-teal-100">
                    <span className="text-lg font-black text-teal-800">Đáp án của bé là:</span>
                    <div className="relative flex items-center gap-2">
                        <input 
                            type="number" 
                            inputMode="numeric"
                            value={problem.userAnswer || ''}
                            onChange={(e) => onUpdate(e.target.value)}
                            disabled={showResult}
                            className={`w-24 text-center text-3xl font-black p-3 rounded-2xl border-4 outline-none transition-all shadow-inner ${
                                showResult 
                                ? (isCorrect ? 'text-green-600 border-green-400 bg-white' : 'text-red-500 border-red-400 bg-white') 
                                : 'text-gray-800 border-gray-200 bg-white focus:border-teal-400'
                            }`}
                            placeholder="..."
                        />
                        <span className="text-xl font-black text-teal-600">cm</span>
                        
                        {isWrong && (
                            <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-red-500 text-white px-4 py-1.5 rounded-full text-sm font-black shadow-xl whitespace-nowrap z-10 animate-bounce-short">
                                Đúng là: {problem.answer} cm
                            </div>
                        )}
                    </div>
               </div>

               {isCorrect && (
                   <div className="mt-4 text-green-600 font-black animate-fadeIn">
                       ✨ Tuyệt vời! Bé tính toán rất nhanh!
                   </div>
               )}
          </div>
      )
  }

  return <div>Vui lòng đợi trong giây lát...</div>;
};

export default GeometryMath;
