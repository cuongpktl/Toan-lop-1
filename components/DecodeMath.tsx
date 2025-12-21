
import React, { useState, useEffect } from 'react';
import { MathProblem } from '../types';
import { focusNextEmptyInput } from '../services/uiUtils';

interface Props {
  problem: MathProblem;
  onUpdate: (val: string) => void;
  showResult: boolean;
}

const ICON_MAP: Record<string, string> = { pig: "🐷", cat: "🐱", chick: "🐥", dog: "🐶" };

const DecodeMath: React.FC<Props> = ({ problem, onUpdate, showResult }) => {
  const { icon1 = 'pig', icon2 = 'cat', legend = {} } = problem.visualData || {};
  const [hint1, setHint1] = useState('');
  const [hint2, setHint2] = useState('');

  useEffect(() => { setHint1(''); setHint2(''); }, [problem.id]);

  const isCorrect = showResult && parseInt(problem.userAnswer || '') === problem.answer;
  const isWrong = showResult && !isCorrect;

  const handleHintChange = (setter: (v: string) => void, e: React.ChangeEvent<HTMLInputElement>) => {
    setter(e.target.value);
    if (e.target.value !== '') {
      setTimeout(() => focusNextEmptyInput(e.target), 300);
    }
  };

  const handleFinalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onUpdate(val);
    if (val !== '') {
      setTimeout(() => focusNextEmptyInput(e.target), 400);
    }
  };

  return (
    <div className={`p-4 sm:p-10 rounded-[32px] border-4 bg-white shadow-xl transition-all flex flex-col items-center gap-8 w-full ${showResult ? (isCorrect ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50') : 'border-purple-100'}`}>
      <div className="flex items-center justify-center gap-2 sm:gap-12 flex-wrap">
          <div className="flex flex-col items-center gap-2">
              <div className="text-4xl sm:text-7xl">{ICON_MAP[icon1]}</div>
              <input type="number" data-priority="1" value={hint1} onChange={(e) => handleHintChange(setHint1, e)} className="w-10 h-10 sm:w-16 sm:h-16 text-center text-xl font-black rounded-xl border-2" placeholder="?" />
          </div>
          <div className="text-2xl sm:text-4xl font-black text-purple-400">{problem.operators?.[0]}</div>
          <div className="flex flex-col items-center gap-2">
              <div className="text-4xl sm:text-7xl">{ICON_MAP[icon2]}</div>
              <input type="number" data-priority="1" value={hint2} onChange={(e) => handleHintChange(setHint2, e)} className="w-10 h-10 sm:w-16 sm:h-16 text-center text-xl font-black rounded-xl border-2" placeholder="?" />
          </div>
          <div className="text-2xl sm:text-4xl font-black text-gray-300">=</div>
          <input type="number" data-priority="2" value={problem.userAnswer || ''} onChange={handleFinalChange} className="w-20 sm:w-32 h-16 sm:h-20 text-center text-3xl font-black rounded-2xl border-4" placeholder="?" />
      </div>
      {isWrong && <div className="text-red-500 font-bold">Đáp án đúng là: {problem.answer}</div>}
    </div>
  );
};

export default DecodeMath;
