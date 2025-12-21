
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
      const { shapes = [] } = visualData;
      const userSelected = problem.userAnswer ? JSON.parse(problem.userAnswer) : [];

      return (
          <div className="p-6 rounded-3xl border-4 border-white bg-white shadow-xl flex flex-col items-center w-full">
              <h3 className="text-xl font-black text-gray-800 mb-8 text-center uppercase">{problem.question}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                  {shapes.map((shape: any) => (
                    <div key={shape.id} onClick={() => toggleShape(shape.id)} className={`relative transition-all cursor-pointer p-4 rounded-3xl border-4 flex flex-col items-center justify-center w-32 h-32 ${userSelected.includes(shape.id) ? 'border-orange-400 bg-orange-50' : 'border-transparent bg-gray-50'}`}>
                        <svg width="100%" height="100%" viewBox="0 0 100 100">
                            <path d={shape.d} fill={shape.color} stroke="#334155" strokeWidth="3" />
                        </svg>
                    </div>
                  ))}
              </div>
          </div>
      )
  }

  if (problem.visualType === 'path_length') {
      const segments = Array.isArray(problem.visualData) ? problem.visualData : [];
      return (
          <div className={`p-6 rounded-[32px] border-4 flex flex-col items-center justify-center bg-white shadow-xl w-full ${isCorrect ? 'border-green-400 bg-green-50' : isWrong ? 'border-red-400 bg-red-50' : 'border-teal-100'}`}>
               <h3 className="text-xl font-black text-gray-800 mb-6 text-center">{problem.question}</h3>
               <div className="flex items-center gap-2 mb-6 text-rose-600 font-black">
                 {segments.map((s: any, idx: number) => (
                   <React.Fragment key={idx}>
                     <span>{s.length}cm</span>
                     {idx < segments.length - 1 && <span>+</span>}
                   </React.Fragment>
                 ))}
               </div>
               <div className="flex items-center gap-4 bg-teal-50 p-6 rounded-3xl">
                    <input 
                        type="number" 
                        inputMode="numeric"
                        data-priority="2"
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
