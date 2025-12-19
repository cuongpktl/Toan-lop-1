
import React, { useState, useEffect } from 'react';
import { MathProblem } from '../types';
import { generateWordProblem } from '../services/geminiService';
import { audioService } from '../services/audioService';
import { RefreshIcon, CheckCircleIcon, StarIcon } from './icons';

const WordProblem: React.FC = () => {
  const [problems, setProblems] = useState<MathProblem[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputs, setInputs] = useState<string[]>(['', '']);
  const [statuses, setStatuses] = useState<('idle' | 'correct' | 'wrong')[]>(['idle', 'idle']);

  const loadProblems = async () => {
    audioService.play('click');
    setLoading(true);
    setStatuses(['idle', 'idle']);
    setInputs(['', '']);
    
    try {
      const p1 = await generateWordProblem();
      const op1 = p1.operators?.[0] || '+';
      const op2 = op1 === '+' ? '-' : '+';
      const p2 = await generateWordProblem(op2 as '+' | '-');
      setProblems([p1, p2]);
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
    const userInput = inputs[index];
    if (!problem || !userInput) return;

    const newStatuses = [...statuses];
    if (parseInt(userInput) === problem.answer) {
      audioService.play('correct');
      newStatuses[index] = 'correct';
    } else {
      audioService.play('wrong');
      newStatuses[index] = 'wrong';
    }
    setStatuses(newStatuses);
  };

  const handleInputChange = (index: number, value: string) => {
    const newInputs = [...inputs];
    newInputs[index] = value;
    setInputs(newInputs);
    
    if (statuses[index] === 'wrong') {
      const newStatuses = [...statuses];
      newStatuses[index] = 'idle';
      setStatuses(newStatuses);
    }
  };

  const correctCount = statuses.filter(s => s === 'correct').length;
  const calculatedScore10 = problems.length > 0 ? (10 / problems.length) * correctCount : 0;
  const displayScore = calculatedScore10 % 1 === 0 ? calculatedScore10 : calculatedScore10.toFixed(1);

  return (
    <div className="max-w-3xl mx-auto w-full space-y-8 pb-10 relative">
      {/* Vòng tròn điểm số đồng nhất: To và điểm màu đỏ */}
      {!loading && problems.length > 0 && (
        <div className="fixed top-2 left-1/2 -translate-x-1/2 sm:static sm:translate-x-0 sm:mb-4 z-[100] sm:z-auto animate-fadeIn">
          <div className="w-20 h-20 sm:w-28 sm:h-28 bg-white border-4 border-yellow-500 rounded-full shadow-2xl flex flex-col items-center justify-center mx-auto">
            <span className="text-[10px] font-black text-gray-400 uppercase leading-none">Điểm</span>
            <span className="text-xl sm:text-3xl font-black text-red-600">{displayScore}</span>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-yellow-100">
        <div>
          <h2 className="text-xl font-black text-gray-800 flex items-center gap-2">
             <StarIcon className="text-yellow-500" fill="currentColor" />
             Giải Toán Có Lời Văn
          </h2>
          <p className="text-gray-500 text-sm font-bold">Bé hãy đọc kỹ và tìm xem dùng phép tính gì nhé!</p>
        </div>
        <button 
          onClick={loadProblems} 
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold rounded-xl shadow-[0_4px_0_rgb(202,138,4)] active:shadow-none active:translate-y-[4px] transition-all disabled:opacity-50"
        >
          <RefreshIcon className={loading ? "animate-spin" : ""} />
          Đổi Đề Mới
        </button>
      </div>

      <div className="space-y-6">
        {loading ? (
          [1, 2].map(i => (
            <div key={i} className="bg-white p-8 rounded-3xl shadow-lg border-b-4 border-gray-100 animate-pulse space-y-4">
                <div className="h-6 bg-gray-100 rounded w-3/4"></div>
                <div className="h-6 bg-gray-100 rounded w-full"></div>
                <div className="h-12 bg-gray-50 rounded w-48 mt-8"></div>
            </div>
          ))
        ) : (
          problems.map((problem, index) => (
            <div key={problem.id} className={`bg-white rounded-3xl shadow-xl border-b-8 overflow-hidden transition-all duration-500 transform ${
                statuses[index] === 'correct' ? 'border-green-500 scale-[0.98]' : 
                statuses[index] === 'wrong' ? 'border-red-400 animate-shake' : 
                'border-yellow-400 hover:shadow-2xl'
            }`}>
              <div className="bg-gray-50 px-6 py-3 border-b border-gray-100 flex justify-between items-center">
                  <span className="text-sm font-black text-gray-400 uppercase tracking-widest">Bài Toán {index + 1}</span>
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-300 font-black text-xs">?</div>
              </div>
              
              <div className="p-8">
                <p className="text-xl md:text-2xl text-gray-700 leading-relaxed font-bold mb-8">
                    {problem.question}
                </p>
                
                <div className="flex flex-col sm:flex-row items-center gap-4 pt-6 border-t border-gray-50">
                    <div className="relative group">
                        <input 
                            type="number" 
                            inputMode="numeric"
                            value={inputs[index]}
                            onChange={(e) => handleInputChange(index, e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && checkAnswer(index)}
                            disabled={statuses[index] === 'correct'}
                            className={`w-36 text-center text-3xl font-black p-4 rounded-2xl border-4 outline-none transition-all ${
                                statuses[index] === 'correct' ? 'border-green-500 bg-green-50 text-green-700' :
                                statuses[index] === 'wrong' ? 'border-red-500 bg-red-50 text-red-700' :
                                'border-gray-200 bg-gray-50 focus:border-yellow-400 focus:bg-white'
                            }`}
                            placeholder="..."
                        />
                        {statuses[index] === 'correct' && (
                            <div className="absolute -right-4 -top-4 bg-green-500 text-white p-1 rounded-full shadow-lg">
                                <CheckCircleIcon className="w-6 h-6" />
                            </div>
                        )}
                    </div>
                    
                    <button 
                        onClick={() => checkAnswer(index)}
                        disabled={statuses[index] === 'correct' || !inputs[index]}
                        className={`flex-1 sm:flex-none px-10 py-4 font-black rounded-2xl shadow-lg transition-all active:scale-95 disabled:opacity-50 ${
                            statuses[index] === 'correct' ? 'bg-green-500 text-white cursor-default' : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                    >
                        {statuses[index] === 'correct' ? 'Đã Chính Xác!' : 'Kiểm Tra'}
                    </button>
                </div>

                {statuses[index] === 'wrong' && (
                  <p className="mt-4 text-red-500 font-bold text-center">Bé hãy đọc kỹ và tính lại nhé! 💪</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {!loading && problems.length > 0 && statuses.every(s => s === 'correct') && (
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-8 rounded-[40px] text-center shadow-2xl animate-fadeIn">
            <h4 className="text-3xl font-black text-white mb-2">🏆 HOÀN THÀNH XUẤT SẮC!</h4>
            <p className="text-white text-opacity-90 font-bold mb-6">Bé đã chinh phục được cả hai bài toán rồi đấy!</p>
            <button 
              onClick={loadProblems}
              className="px-10 py-4 bg-white text-orange-600 font-black rounded-2xl hover:scale-105 transition-transform shadow-xl"
            >
              Làm Thêm Bài Nữa
            </button>
        </div>
      )}
    </div>
  );
};

export default WordProblem;
