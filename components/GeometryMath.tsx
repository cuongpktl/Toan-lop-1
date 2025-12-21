
import React from 'react';
import { MathProblem } from '../types';
import { focusNextEmptyInput } from '../services/uiUtils';

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onUpdate(val);
    if (val.length >= String(problem.answer).length) {
      setTimeout(() => focusNextEmptyInput(e.target), 400);
    }
  };

  // --- Identify Shape logic giữ nguyên ---
  if (problem.visualType === 'identify_shape') {
      const visualData = problem.visualData || {};
      const { targetId = '', shapes = [] } = visualData;
      const userSelected = problem.userAnswer ? JSON.parse(problem.userAnswer) : [];
      const targetShapeIds = shapes.filter((s: any) => s.type === targetId).map((s: any) => s.id);
      const isIdCorrect = showResult && targetShapeIds.every((id: string) => userSelected.includes(id)) && userSelected.every((id: string) => targetShapeIds.includes(id));
      const borderColor = showResult ? (isIdCorrect ? 'border-green-400 bg-green-50' : 'border-red-400 bg-red-50') : 'border-white';

      return (
          <div className={`p-6 rounded-3xl border-4 flex flex-col items-center justify-center bg-white shadow-xl transition-all w-full ${borderColor}`}>
              <h3 className="text-xl font-black text-gray-800 mb-8 text-center uppercase tracking-tight">{problem.question}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-10">
                  {shapes.map((shape: any) => (
                    <div key={shape.id} onClick={() => toggleShape(shape.id)} className={`relative transition-all duration-300 cursor-pointer p-4 rounded-3xl border-4 flex flex-col items-center justify-center w-32 h-32 sm:w-40 sm:h-40 ${userSelected.includes(shape.id) ? 'border-orange-400 bg-orange-50' : 'border-transparent bg-gray-50'}`}>
                        <svg width="100%" height="100%" viewBox="0 0 100 100">
                            <path d={shape.d} fill={shape.color} stroke="#334155" strokeWidth="3" />
                        </svg>
                    </div>
                  ))}
              </div>
          </div>
      )
  }

  // --- Path Length logic với Auto-focus ---
  if (problem.visualType === 'path_length') {
      const segments = Array.isArray(problem.visualData) ? problem.visualData : [];
      const numPoints = segments.length + 1;
      const pointLabels = "ABCDE";
      const points = [];
      const stepX = 80;
      const totalWidth = (numPoints - 1) * stepX + 40;
      for (let i = 0; i < numPoints; i++) {
          const y = i % 2 === 0 ? 80 : 20;
          points.push({ x: 20 + (i * stepX), y, label: pointLabels[i] });
      }
      const pathD = points.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(" ");

      return (
          <div className={`p-6 rounded-[32px] border-4 flex flex-col items-center justify-center bg-white shadow-xl transition-all w-full ${isCorrect ? 'border-green-400 bg-green-50' : isWrong ? 'border-red-400 bg-red-50' : 'border-teal-100 hover:border-teal-300'}`}>
               <h3 className="text-xl font-black text-gray-800 mb-6 text-center">{problem.question}</h3>
               <div className="w-full max-w-md h-40 flex justify-center">
                   <svg width="100%" height="100%" viewBox={`0 0 ${totalWidth} 100`}>
                       <path d={pathD} fill="none" stroke="#0D9488" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                       {points.map((p, i) => (
                           <g key={i}>
                               <circle cx={p.x} cy={p.y} r="6" fill="#0F766E" stroke="white" strokeWidth="2" />
                               <text x={p.x} y={p.y + (p.y > 50 ? 25 : -15)} textAnchor="middle" className="text-sm font-black fill-teal-800">{p.label}</text>
                           </g>
                       ))}
                       {segments.map((seg: any, i: number) => (
                           <g key={i}>
                               <text x={(points[i].x + points[i+1].x)/2} y={(points[i].y + points[i+1].y)/2} textAnchor="middle" className="text-[12px] font-black fill-rose-600">{seg.length}cm</text>
                           </g>
                       ))}
                   </svg>
               </div>
               <div className="flex items-center gap-4 mt-8 bg-teal-50 p-6 rounded-3xl border-2 border-teal-100">
                    <input 
                        type="number" 
                        inputMode="numeric"
                        value={problem.userAnswer || ''}
                        onChange={handleInputChange}
                        disabled={showResult}
                        className={`w-24 text-center text-3xl font-black p-3 rounded-2xl border-4 outline-none transition-all ${
                            showResult ? (isCorrect ? 'text-green-600 border-green-400' : 'text-red-500 border-red-400') : 'text-gray-800 border-gray-200 focus:border-teal-400'
                        }`}
                        placeholder="..."
                    />
                    <span className="text-xl font-black text-teal-600">cm</span>
               </div>
          </div>
      )
  }

  return null;
};

export default GeometryMath;
