
import React, { useState, useEffect } from 'react';
import { MathProblem } from '../types';
import { generateWordProblem } from '../services/geminiService';
import { audioService } from '../services/audioService';
import { RefreshIcon, CheckCircleIcon, StarIcon } from './icons';
import { focusNextEmptyInput } from '../services/uiUtils';

interface EquationState {
  val1: string;
  op: string;
  val2: string;
  equal: string;
  result: string;
}

const WordProblem: React.FC = () => {
  const [problems, setProblems] = useState<MathProblem[]>([]);
  const [loading, setLoading] = useState(false);
  const [equationInputs, setEquationInputs] = useState<EquationState[]>(
    Array.from({ length: 10 }, () => ({ val1: '', op: '', val2: '', equal: '=', result: '' }))
  );
  const [statuses, setStatuses] = useState<('idle' | 'correct' | 'wrong')[]>(Array.from({ length: 10 }, () => 'idle'));

  const loadProblems = async () => {
    audioService.play('click');
    setLoading(true);
    setStatuses(Array.from({ length: 10 }, () => 'idle'));
    setEquationInputs(Array.from({ length: 10 }, () => ({ val1: '', op: '', val2: '', equal: '=', result: '' })));
    try {
      const generated: MathProblem[] = [];
      for (let i = 0; i < 10; i++) {
        const p = await generateWordProblem(i % 2 === 0 ? '+' : '-');
        generated.push(p);
      }
      setProblems(generated);
    } catch (error) {
      console.error("Failed to load problems", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProblems();
  }, []);

  const handleEqChange = (index: number, field: keyof EquationState, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.value;
    const newEqs = [...equationInputs];
    newEqs[index] = { ...newEqs[index], [field]: value };
    setEquationInputs(newEqs);
    
    if (value !== '') {
        setTimeout(() => focusNextEmptyInput(e.target), 200);
    }

    if (statuses[index] === 'wrong') {
      const newStatuses = [...statuses];
      newStatuses[index] = 'idle';
      setStatuses(newStatuses);
    }
  };

  const checkAnswer = (index: number) => {
    const problem = problems[index];
    const eq = equationInputs[index];
    const v1 = parseInt(eq.val1);
    const v2 = parseInt(eq.val2);
    const res = parseInt(eq.result);
    const targetOp = problem.operators?.[0] || '+';
    
    const isValuesCorrect = (v1 === problem.numbers?.[0] && v2 === problem.numbers?.[1]) || (targetOp === '+' && v1 === problem.numbers?.[1] && v2 === problem.numbers?.[0]);
    const isOpCorrect = eq.op === targetOp;
    const isResultCorrect = res === problem.answer;

    const newStatuses = [...statuses];
    if (isValuesCorrect && isOpCorrect && isResultCorrect) {
      audioService.play('correct');
      newStatuses[index] = 'correct';
      // Khi nộp 1 câu đúng, tự động tìm ô trống tiếp theo của các câu khác
      setTimeout(() => focusNextEmptyInput(), 400);
    } else {
      audioService.play('wrong');
      newStatuses[index] = 'wrong';
    }
    setStatuses(newStatuses);
  };

  const correctCount = statuses.filter(s => s === 'correct').length;
  const displayScore = problems.length > 0 ? ((10 / problems.length) * correctCount).toFixed(correctCount % problems.length === 0 ? 0 : 1) : 0;

  return (
    <div className="max-w-4xl mx-auto w-full space-y-8 pb-10 px-2">
      <div className="flex justify-between items-center bg-white p-6 rounded-[32px] shadow-sm border border-yellow-100">
        <div>
          <h2 className="text-2xl font-black text-gray-800 flex items-center gap-2">
             <StarIcon className="text-yellow-500" fill="currentColor" /> Giải Toán Có Lời Văn
          </h2>
          <p className="text-gray-500 text-sm font-bold">Bé hãy điền phép tính thật chính xác nhé!</p>
        </div>
        <div className="bg-white border-4 border-yellow-500 rounded-full w-20 h-20 flex flex-col items-center justify-center">
            <span className="text-[8px] font-black text-gray-400">ĐIỂM</span>
            <span className="text-2xl font-black text-red-600">{displayScore}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-10">
        {!loading && problems.map((problem, index) => (
          <div key={problem.id} className={`bg-white rounded-[40px] shadow-2xl border-b-[12px] overflow-hidden transition-all ${statuses[index] === 'correct' ? 'border-green-500' : 'border-gray-100'}`}>
            <div className="p-8 sm:p-12 space-y-6">
                <h3 className="text-2xl font-black text-gray-800 leading-relaxed">{problem.fullQuestion || problem.question}</h3>
                
                {problem.summaryLines && (
                  <div className="bg-yellow-50/50 p-6 rounded-3xl border-2 border-dashed border-yellow-200">
                    {problem.summaryLines.map((line, i) => (
                      <p key={i} className="text-lg font-bold text-gray-600 italic">Tóm tắt: {line}</p>
                    ))}
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-2 justify-center pt-6">
                    <input 
                      type="number" 
                      inputMode="numeric"
                      data-priority="2"
                      value={equationInputs[index].val1} 
                      onChange={(e) => handleEqChange(index, 'val1', e)} 
                      className="w-16 h-16 text-center text-2xl font-black rounded-xl border-4 outline-none focus:border-yellow-400" 
                      placeholder="..." 
                    />
                    <select 
                      value={equationInputs[index].op} 
                      onChange={(e) => handleEqChange(index, 'op', e)} 
                      className="w-16 h-16 text-center text-2xl font-black rounded-xl border-4 appearance-none focus:border-yellow-400"
                    >
                        <option value=""></option>
                        <option value="+">+</option>
                        <option value="-">-</option>
                    </select>
                    <input 
                      type="number" 
                      inputMode="numeric"
                      data-priority="2"
                      value={equationInputs[index].val2} 
                      onChange={(e) => handleEqChange(index, 'val2', e)} 
                      className="w-16 h-16 text-center text-2xl font-black rounded-xl border-4 outline-none focus:border-yellow-400" 
                      placeholder="..." 
                    />
                    <span className="text-2xl font-black text-gray-300">=</span>
                    <input 
                      type="number" 
                      inputMode="numeric"
                      data-priority="2"
                      value={equationInputs[index].result} 
                      onChange={(e) => handleEqChange(index, 'result', e)} 
                      className="w-16 h-16 text-center text-2xl font-black rounded-xl border-4 outline-none focus:border-yellow-400" 
                      placeholder="..." 
                    />
                    <button 
                      onClick={() => checkAnswer(index)} 
                      className="ml-4 px-8 py-4 bg-blue-600 text-white font-black rounded-2xl shadow-lg hover:bg-blue-700 active:scale-95 transition-all"
                    >
                      Gửi
                    </button>
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WordProblem;
