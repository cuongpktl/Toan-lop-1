
import React, { useState, useEffect } from 'react';
import { MathProblem } from '../types';

interface Props {
  problem: MathProblem;
  onUpdate: (val: string) => void;
  showResult: boolean;
}

const ComparisonMath: React.FC<Props> = ({ problem, onUpdate, showResult }) => {
  const [showSelector, setShowSelector] = useState(false);
  const [leftIntermediate, setLeftIntermediate] = useState('');
  const [rightIntermediate, setRightIntermediate] = useState('');
  
  const nums = problem.numbers || [0, 0, 0, 0];
  const ops = problem.operators || ['+', '+'];
  const userAns = problem.userAnswer || '';
  const isMissingNumber = problem.visualType === 'missing_number';
  const { sign: targetSign = '', hideIdx = -1 } = problem.visualData || {};

  const leftTarget = ops[0] === '+' ? nums[0] + nums[1] : nums[0] - nums[1];
  const rightTarget = ops[1] === '+' ? nums[2] + nums[3] : nums[2] - nums[3];

  const isLeftCorrect = leftIntermediate !== '' && parseInt(leftIntermediate) === leftTarget;
  const isRightCorrect = rightIntermediate !== '' && parseInt(rightIntermediate) === rightTarget;

  useEffect(() => {
    setLeftIntermediate('');
    setRightIntermediate('');
  }, [problem.id]);

  const handleSelectSign = (val: string) => {
    if (showResult || isMissingNumber) return;
    onUpdate(val);
    setShowSelector(false);
  };

  const handleNumberInput = (val: string) => {
    if (showResult) return;
    onUpdate(val);
  };

  // Logic kiểm tra đúng sai
  let isCorrect = false;
  if (showResult) {
    if (isMissingNumber) {
        // Kiểm tra xem số người dùng nhập có làm cho phép so sánh đúng không
        const currentNums = [...nums];
        currentNums[hideIdx] = parseInt(userAns);
        const lRes = ops[0] === '+' ? currentNums[0] + currentNums[1] : currentNums[0] - currentNums[1];
        const rRes = ops[1] === '+' ? currentNums[2] + currentNums[3] : currentNums[2] - currentNums[3];
        
        if (targetSign === '>') isCorrect = lRes > rRes;
        else if (targetSign === '<') isCorrect = lRes < rRes;
        else isCorrect = lRes === rRes;
    } else {
        isCorrect = userAns === problem.answer;
    }
  }
  const isWrong = showResult && !isCorrect;

  const SYMBOLS = ['>', '<', '='];

  const renderSide = (nA: number, nB: number, op: string, isLeftSide: boolean) => {
    const isHideA = !isLeftSide ? (hideIdx === 2) : (hideIdx === 0);
    const isHideB = !isLeftSide ? (hideIdx === 3) : (hideIdx === 1);
    const intermediateVal = isLeftSide ? leftIntermediate : rightIntermediate;
    const setIntermediateVal = isLeftSide ? setLeftIntermediate : setRightIntermediate;
    const isIntermediateCorrect = isLeftSide ? isLeftCorrect : isRightCorrect;

    const renderVal = (val: number, isHidden: boolean) => {
      if (isHidden && isMissingNumber) {
        return (
          <div className="relative">
             <input 
                type="number"
                inputMode="numeric"
                value={userAns}
                onChange={(e) => handleNumberInput(e.target.value)}
                disabled={showResult}
                className={`w-14 h-12 sm:w-16 sm:h-14 text-center text-xl font-black rounded-xl border-2 outline-none transition-all shadow-inner ${
                    showResult 
                    ? (isCorrect ? 'border-green-400 bg-green-50 text-green-700' : 'border-red-400 bg-red-50 text-red-700') 
                    : 'border-blue-200 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50'
                }`}
                placeholder="..."
             />
          </div>
        );
      }
      return <span>{val}</span>;
    };

    return (
      <div className="flex flex-col items-center">
          <div className="flex items-center gap-2 text-2xl font-black text-gray-700 font-mono bg-white px-4 py-2 rounded-2xl border border-gray-100 shadow-sm min-w-[120px] justify-center">
              {renderVal(nA, isHideA)}
              <span className={`${op === '+' ? 'text-indigo-400' : 'text-red-400'} text-xl`}>{op}</span>
              {renderVal(nB, isHideB)}
          </div>
          
          {/* Sơ đồ chữ V */}
          <div className="relative w-full h-14 mt-1">
              <div className="absolute top-0 left-[15%] right-[15%] h-5 border-l-2 border-b-2 border-r-2 border-indigo-200 rounded-b-lg"></div>
              <div className="absolute top-4 left-1/2 -translate-x-1/2">
                  <input 
                      type="number"
                      inputMode="numeric"
                      placeholder="..."
                      value={intermediateVal}
                      onChange={(e) => setIntermediateVal(e.target.value)}
                      disabled={showResult}
                      className={`w-12 h-8 text-center text-xs font-black rounded-lg border-2 outline-none transition-all shadow-sm ${
                          isIntermediateCorrect ? 'border-green-400 bg-green-50 text-green-600' :
                          intermediateVal !== '' ? 'border-orange-300 bg-orange-50 text-orange-600' :
                          'border-indigo-50 bg-white focus:border-indigo-200'
                      }`}
                  />
              </div>
          </div>
      </div>
    );
  };

  return (
    <div className={`p-8 rounded-[40px] border-2 flex flex-col items-center bg-white shadow-sm transition-all duration-300 relative ${
        showResult ? (isCorrect ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50') : 'border-indigo-100 hover:border-indigo-300'
    }`}>
      <div className="flex items-center gap-4 sm:gap-10 w-full justify-center">
        
        {renderSide(nums[0], nums[1], ops[0], true)}

        {/* Comparison Circle */}
        <div className="relative mb-14">
            {isMissingNumber ? (
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-4 border-indigo-500 bg-white flex items-center justify-center text-3xl font-black text-indigo-600 shadow-md">
                {targetSign}
              </div>
            ) : (
              <button 
                  onClick={() => !showResult && setShowSelector(!showSelector)}
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full border-4 flex items-center justify-center text-3xl font-black transition-all shadow-md z-10 relative
                      ${userAns ? 'text-indigo-600 border-indigo-500 bg-white' : 'text-gray-300 border-gray-100 bg-gray-50'}
                      ${isCorrect ? 'border-green-500 text-green-600' : ''}
                      ${isWrong ? 'border-red-500 text-red-600 animate-shake' : ''}
                      ${!showResult && !userAns ? 'hover:border-indigo-300 animate-pulse' : ''}
                  `}
              >
                  {userAns || '?'}
              </button>
            )}

            {/* Selection Menu (Chỉ cho dạng tìm dấu) */}
            {showSelector && !showResult && !isMissingNumber && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 bg-white border-2 border-indigo-200 rounded-[24px] shadow-2xl flex p-2 gap-2 z-50 animate-fadeIn overflow-hidden">
                    {SYMBOLS.map(sym => (
                        <button 
                            key={sym} 
                            onClick={() => handleSelectSign(sym)}
                            className="w-12 h-12 flex items-center justify-center text-2xl font-black text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors active:scale-90"
                        >
                            {sym}
                        </button>
                    ))}
                </div>
            )}
        </div>

        {renderSide(nums[2], nums[3], ops[1], false)}
      </div>

      {showResult && !isCorrect && (
          <div className="absolute -top-3 bg-red-500 text-white px-3 py-1 rounded-full text-[10px] font-black shadow-lg">
             {isMissingNumber ? `Số cần tìm là: ${problem.answer}` : `Dấu đúng là: ${problem.answer}`}
          </div>
      )}
    </div>
  );
};

export default ComparisonMath;
