
import React, { useState, useEffect } from 'react';
import { MathProblem } from '../types';
import { generateWordProblem } from '../services/geminiService';
import { audioService } from '../services/audioService';
import { RefreshIcon, CheckCircleIcon, StarIcon } from './icons';

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

  const checkAnswer = (index: number) => {
    const problem = problems[index];
    const eq = equationInputs[index];
    if (!problem || !eq.val1 || !eq.op || !eq.val2 || !eq.result) return;

    const v1 = parseInt(eq.val1);
    const v2 = parseInt(eq.val2);
    const res = parseInt(eq.result);
    const targetOp = problem.operators?.[0] || '+';
    
    const isValuesCorrect = (v1 === problem.numbers?.[0] && v2 === problem.numbers?.[1]) || 
                            (targetOp === '+' && v1 === problem.numbers?.[1] && v2 === problem.numbers?.[0]);
    const isOpCorrect = eq.op === targetOp;
    const isResultCorrect = res === problem.answer;

    const newStatuses = [...statuses];
    if (isValuesCorrect && isOpCorrect && isResultCorrect) {
      audioService.play('correct');
      newStatuses[index] = 'correct';
    } else {
      audioService.play('wrong');
      newStatuses[index] = 'wrong';
    }
    setStatuses(newStatuses);
  };

  const handleEqChange = (index: number, field: keyof EquationState, value: string) => {
    const newEqs = [...equationInputs];
    newEqs[index] = { ...newEqs[index], [field]: value };
    setEquationInputs(newEqs);
    
    if (statuses[index] === 'wrong') {
      const newStatuses = [...statuses];
      newStatuses[index] = 'idle';
      setStatuses(newStatuses);
    }
  };

  const correctCount = statuses.filter(s => s === 'correct').length;
  const calculatedScore10 = problems.length > 0 ? (10 / problems.length) * correctCount : 0;
  const displayScore = calculatedScore10 % 1 === 0 ? calculatedScore10 : calculatedScore10.toFixed(1);

  const getProblemIcon = (index: number) => {
    const text = (problems[index]?.fullQuestion || problems[index]?.question || '').toLowerCase();
    if (text.includes('cam') || text.includes('táo')) return '🍎';
    if (text.includes('kẹo')) return '🍭';
    if (text.includes('chim')) return '🐦';
    if (text.includes('gà')) return '🐔';
    if (text.includes('bi')) return '🔵';
    if (text.includes('xe')) return '🚲';
    if (text.includes('cao')) return '📏';
    return '🌟';
  };

  return (
    <div className="max-w-4xl mx-auto w-full space-y-8 pb-10 relative px-2">
      {!loading && problems.length > 0 && (
        <div className="fixed top-2 left-1/2 -translate-x-1/2 sm:static sm:translate-x-0 sm:mb-4 z-[100] sm:z-auto animate-fadeIn">
          <div className="w-20 h-20 sm:w-28 sm:h-28 bg-white border-4 border-yellow-500 rounded-full shadow-2xl flex flex-col items-center justify-center mx-auto">
            <span className="text-[10px] font-black text-gray-400 uppercase leading-none">Điểm</span>
            <span className="text-xl sm:text-3xl font-black text-red-600">{displayScore}</span>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center bg-white p-4 sm:p-6 rounded-[32px] shadow-sm border border-yellow-100">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-800 flex items-center gap-2">
             <StarIcon className="text-yellow-500" fill="currentColor" />
             Giải Toán Có Lời Văn
          </h2>
          <p className="text-gray-500 text-sm font-bold">Bé hãy đọc kỹ bài toán và điền phép tính thích hợp nhé!</p>
        </div>
        <button 
          onClick={loadProblems} 
          disabled={loading}
          className="flex items-center gap-2 px-4 py-3 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-black rounded-2xl shadow-[0_4px_0_rgb(202,138,4)] active:shadow-none active:translate-y-[4px] transition-all disabled:opacity-50"
        >
          <RefreshIcon className={loading ? "animate-spin" : ""} />
          Đổi Đề
        </button>
      </div>

      <div className="grid grid-cols-1 gap-10">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-white p-12 rounded-[40px] shadow-lg border-b-4 border-gray-100 animate-pulse space-y-6">
                <div className="h-4 bg-gray-100 rounded w-1/4"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-16 bg-gray-50 rounded-2xl w-full mt-8"></div>
            </div>
          ))
        ) : (
          problems.map((problem, index) => {
            const isLongStyle = !!problem.fullQuestion;
            return (
              <div key={problem.id} className={`bg-white rounded-[40px] shadow-2xl border-b-[12px] overflow-hidden transition-all duration-500 transform ${
                  statuses[index] === 'correct' ? 'border-green-500' : 
                  statuses[index] === 'wrong' ? 'border-red-400 animate-shake' : 
                  'border-gray-100'
              }`}>
                <div className="bg-slate-50 px-8 py-4 border-b border-gray-100 flex justify-between items-center">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">BÀI TOÁN {index + 1}</span>
                    {statuses[index] === 'correct' && <CheckCircleIcon className="text-green-500 w-6 h-6" />}
                </div>
                
                <div className="p-8 sm:p-12">
                  <div className="flex flex-col gap-6">
                      {/* Hiển thị câu hỏi (Dạng dài hoặc Dạng ngắn) */}
                      <div className="w-full">
                          <h3 className="text-2xl sm:text-3xl font-black text-gray-800 leading-tight">
                              {isLongStyle ? problem.fullQuestion : problem.question}
                          </h3>
                      </div>

                      <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                          {/* Phần Tóm tắt - Chỉ hiện cho dạng dài */}
                          {isLongStyle && (
                            <div className="flex-1 space-y-4 w-full">
                                <div className="bg-blue-50/50 p-6 rounded-3xl border-2 border-blue-100 relative">
                                    <div className="absolute -top-4 -left-4 w-12 h-12 bg-white rounded-2xl shadow-md border-2 border-blue-100 flex items-center justify-center text-3xl">
                                        {getProblemIcon(index)}
                                    </div>
                                    <div className="space-y-3 pl-4">
                                        {problem.summaryLines?.map((line, lIdx) => (
                                            <p key={lIdx} className={`text-xl font-bold ${lIdx === 2 ? 'text-blue-700' : 'text-gray-700'}`}>
                                                {line}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                                <p className="text-gray-500 font-black text-sm italic pl-2">{problem.question}</p>
                            </div>
                          )}

                          {/* Phần Nhập phép tính */}
                          <div className={`flex flex-col items-center gap-6 w-full ${isLongStyle ? 'md:w-auto' : ''}`}>
                              {!isLongStyle && (
                                <p className="text-gray-500 font-black text-sm italic self-start mb-2">Bé hãy viết phép tính thích hợp.</p>
                              )}
                              <div className="flex items-center gap-1 sm:gap-2">
                                  <input 
                                      type="number" inputMode="numeric"
                                      value={equationInputs[index].val1}
                                      onChange={(e) => handleEqChange(index, 'val1', e.target.value)}
                                      disabled={statuses[index] === 'correct'}
                                      className={`w-14 h-14 sm:w-16 sm:h-16 text-center text-2xl font-black rounded-xl border-2 shadow-inner outline-none transition-all ${
                                          statuses[index] === 'correct' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-white border-slate-200 focus:border-blue-400'
                                      }`}
                                      placeholder="..."
                                  />
                                  <select 
                                      value={equationInputs[index].op}
                                      onChange={(e) => handleEqChange(index, 'op', e.target.value)}
                                      disabled={statuses[index] === 'correct'}
                                      className={`w-14 h-14 sm:w-16 sm:h-16 text-center text-2xl font-black rounded-xl border-2 shadow-inner outline-none transition-all appearance-none cursor-pointer ${
                                          statuses[index] === 'correct' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-white border-slate-200 focus:border-blue-400'
                                      }`}
                                  >
                                      <option value=""></option>
                                      <option value="+">+</option>
                                      <option value="-">-</option>
                                  </select>
                                  <input 
                                      type="number" inputMode="numeric"
                                      value={equationInputs[index].val2}
                                      onChange={(e) => handleEqChange(index, 'val2', e.target.value)}
                                      disabled={statuses[index] === 'correct'}
                                      className={`w-14 h-14 sm:w-16 sm:h-16 text-center text-2xl font-black rounded-xl border-2 shadow-inner outline-none transition-all ${
                                          statuses[index] === 'correct' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-white border-slate-200 focus:border-blue-400'
                                      }`}
                                      placeholder="..."
                                  />
                                  <div className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center text-2xl font-black text-slate-300 border-2 border-transparent">
                                      =
                                  </div>
                                  <input 
                                      type="number" inputMode="numeric"
                                      value={equationInputs[index].result}
                                      onChange={(e) => handleEqChange(index, 'result', e.target.value)}
                                      disabled={statuses[index] === 'correct'}
                                      className={`w-14 h-14 sm:w-16 sm:h-16 text-center text-2xl font-black rounded-xl border-2 shadow-inner outline-none transition-all ${
                                          statuses[index] === 'correct' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-white border-slate-200 focus:border-blue-400'
                                      }`}
                                      placeholder="..."
                                  />
                              </div>

                              <button 
                                  onClick={() => checkAnswer(index)}
                                  disabled={statuses[index] === 'correct' || !equationInputs[index].result}
                                  className={`w-full py-4 font-black rounded-2xl shadow-lg transition-all active:scale-95 disabled:opacity-50 ${
                                      statuses[index] === 'correct' ? 'bg-green-500 text-white cursor-default' : 'bg-blue-600 hover:bg-blue-700 text-white'
                                  }`}
                              >
                                  {statuses[index] === 'correct' ? 'Đúng Rồi!' : 'Kiểm Tra'}
                              </button>
                          </div>
                      </div>
                  </div>

                  {statuses[index] === 'wrong' && (
                    <p className="mt-8 text-red-500 font-black text-center animate-bounce">
                        Bé hãy kiểm tra lại các số và dấu nhé! 💪
                    </p>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {!loading && problems.length > 0 && statuses.every(s => s === 'correct') && (
        <div className="bg-gradient-to-r from-green-400 to-blue-500 p-10 rounded-[48px] text-center shadow-2xl animate-fadeIn mt-10">
            <h4 className="text-4xl font-black text-white mb-2">BÉ QUÁ GIỎI! 🏆</h4>
            <p className="text-white text-opacity-90 font-bold mb-8">Bé đã giải đúng tất cả các bài toán rồi!</p>
            <button 
              onClick={loadProblems}
              className="px-12 py-4 bg-white text-blue-600 font-black rounded-2xl hover:scale-105 transition-transform shadow-xl text-xl"
            >
              Làm Thêm Bài Mới
            </button>
        </div>
      )}
    </div>
  );
};

export default WordProblem;
