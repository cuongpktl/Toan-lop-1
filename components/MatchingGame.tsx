
import React, { useState, useEffect } from 'react';
import { MathProblem } from '../types';
import { generateMatchingGameData } from '../services/mathUtils';
import { audioService } from '../services/audioService';
import { focusNextEmptyInput } from '../services/uiUtils';
import { RefreshIcon, StarIcon, BirdIcon, HouseIcon } from './icons';

interface HouseItem {
    id: string;
    value: number;
}

const MatchingGame: React.FC = () => {
  const [birds, setBirds] = useState<MathProblem[]>([]);
  const [houses, setHouses] = useState<HouseItem[]>([]);
  
  const [selectedBirdId, setSelectedBirdId] = useState<string | null>(null);
  const [selectedHouseId, setSelectedHouseId] = useState<string | null>(null);
  
  const [solvedIds, setSolvedIds] = useState<string[]>([]);
  const [wrongMatch, setWrongMatch] = useState(false);
  
  const [intermediateValues, setIntermediateValues] = useState<Record<string, string>>({});

  const initGame = () => {
    audioService.play('click');
    const data = generateMatchingGameData(10);
    setBirds(data.birds);
    setHouses(data.houses);
    setSolvedIds([]);
    setSelectedBirdId(null);
    setSelectedHouseId(null);
    setWrongMatch(false);
    setIntermediateValues({});
  };

  useEffect(() => {
    initGame();
  }, []);

  useEffect(() => {
      if (selectedBirdId && selectedHouseId) {
          if (selectedBirdId === selectedHouseId) {
              audioService.play('correct');
              setSolvedIds(prev => [...prev, selectedBirdId]);
              setSelectedBirdId(null);
              setSelectedHouseId(null);
              // Khi giải xong một cặp, tìm ô trung gian trống tiếp theo của con chim khác
              setTimeout(() => focusNextEmptyInput(), 400);
          } else {
              audioService.play('wrong');
              setWrongMatch(true);
              const timer = setTimeout(() => {
                  setWrongMatch(false);
                  setSelectedBirdId(null);
                  setSelectedHouseId(null);
              }, 1000);
              return () => clearTimeout(timer);
          }
      }
  }, [selectedBirdId, selectedHouseId]);

  const handleBirdClick = (id: string) => {
      if (solvedIds.includes(id) || wrongMatch) return;
      audioService.play('click');
      setSelectedBirdId(selectedBirdId === id ? null : id);
  };

  const handleHouseClick = (id: string) => {
      if (solvedIds.includes(id) || wrongMatch || !selectedBirdId) return;
      audioService.play('click');
      setSelectedHouseId(selectedHouseId === id ? null : id);
  };

  const handleIntermediateChange = (birdId: string, e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setIntermediateValues(prev => ({ ...prev, [birdId]: val }));
      if (val !== '') {
          setTimeout(() => focusNextEmptyInput(e.target), 300);
      }
  };

  const isComplete = birds.length > 0 && solvedIds.length === birds.length;
  const calculatedScore10 = birds.length > 0 ? (10 / birds.length) * solvedIds.length : 0;
  const displayScore = calculatedScore10 % 1 === 0 ? calculatedScore10 : calculatedScore10.toFixed(1);

  return (
    <div className="max-w-4xl mx-auto px-2 relative">
      {birds.length > 0 && (
        <div className="fixed top-2 left-[150px] sm:left-[220px] md:left-[260px] z-[100] animate-bounce-short">
          <div className="w-16 h-16 sm:w-24 sm:h-24 bg-white border-4 border-blue-600 rounded-full shadow-xl flex flex-col items-center justify-center">
            <span className="text-[10px] font-black text-gray-400 uppercase leading-none">Điểm</span>
            <span className="text-lg sm:text-2xl font-black text-red-600">{displayScore}</span>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 bg-white p-5 rounded-3xl shadow-sm border border-gray-100 gap-4">
        <div className="text-center sm:text-left">
            <h2 className="text-xl font-extrabold text-gray-800">Ghép Chim Về Tổ</h2>
            <p className="text-gray-500 text-sm">Bé hãy tính từng bước dưới chú chim rồi chọn tổ nhé! (10 câu)</p>
        </div>
        <div className="flex items-center gap-3">
            {isComplete && (
                <div className="flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full font-bold animate-bounce text-sm">
                    <StarIcon fill="currentColor" className="w-4 h-4" />
                    <span>Xuất sắc!</span>
                </div>
            )}
            <button onClick={initGame} className="p-3 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-100 transition-colors">
                <RefreshIcon className="w-5 h-5" />
            </button>
        </div>
      </div>

      <div className="space-y-24 py-10">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-x-6 gap-y-20 sm:gap-x-8">
              {birds.map(bird => {
                  const isSolved = solvedIds.includes(bird.id);
                  const isSelected = selectedBirdId === bird.id;
                  const isWrong = wrongMatch && isSelected;

                  const n1 = bird.numbers?.[0] || 0;
                  const n2 = bird.numbers?.[1] || 0;
                  const n3 = bird.numbers?.[2] || 0;
                  const op1 = bird.operators?.[0] || '+';
                  const op2 = bird.operators?.[1] || '+';
                  const step1Target = op1 === '+' ? n1 + n2 : n1 - n2;
                  
                  const userStep1 = intermediateValues[bird.id] || '';
                  const isStep1Correct = userStep1 !== '' && parseInt(userStep1) === step1Target;
                  const isStep1Wrong = userStep1 !== '' && parseInt(userStep1) !== step1Target;

                  return (
                      <div 
                        key={bird.id}
                        className={`flex flex-col items-center transition-all duration-300 ${isSolved ? 'scale-0 opacity-0 pointer-events-none' : ''}`}
                      >
                          <div 
                            onClick={() => handleBirdClick(bird.id)}
                            className={`p-2 sm:p-4 rounded-3xl border-4 w-32 h-32 sm:w-36 sm:h-36 flex items-center justify-center relative shadow-xl bg-white cursor-pointer transition-all
                              ${isSelected ? 'border-blue-500 bg-blue-50 ring-8 ring-blue-100 -translate-y-2' : 'border-sky-50 hover:border-sky-200'}
                              ${isWrong ? 'border-red-400 bg-red-50 animate-shake' : ''}
                          `}>
                              <BirdIcon className={`w-20 h-20 ${isSelected ? 'text-blue-500' : 'text-sky-400'}`} />
                              <div className="absolute -bottom-6 bg-white border-2 border-sky-100 px-3 py-1.5 rounded-xl text-lg sm:text-xl font-black text-gray-700 shadow-lg whitespace-nowrap flex gap-1 items-center">
                                  <span>{n1}</span>
                                  <span className="text-blue-400">{op1}</span>
                                  <span>{n2}</span>
                                  <span className="text-blue-400">{op2}</span>
                                  <span>{n3}</span>
                              </div>
                          </div>

                          <div className="w-full relative h-14 mt-8 flex justify-center overflow-visible">
                               <div className={`absolute top-0 left-[26%] right-[48%] h-4 border-l-2 border-b-2 border-r-2 rounded-b-lg transition-colors ${
                                   isStep1Correct ? 'border-green-400' : 'border-blue-200'
                               }`}></div>
                               <div className="absolute top-4 left-[42%] -translate-x-1/2">
                                    <input 
                                        type="number"
                                        inputMode="numeric"
                                        data-priority="1" 
                                        placeholder="..."
                                        value={userStep1}
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={(e) => handleIntermediateChange(bird.id, e)}
                                        className={`w-12 h-9 text-center text-sm font-black rounded-lg border-2 outline-none transition-all shadow-sm ${
                                            isStep1Correct ? 'border-green-400 bg-green-50 text-green-600' :
                                            isStep1Wrong ? 'border-orange-300 bg-orange-50 text-orange-600' :
                                            'border-blue-50 bg-white focus:border-blue-200'
                                        }`}
                                    />
                               </div>
                               <div className={`absolute top-6 left-[58%] text-[10px] font-bold opacity-60 transition-colors ${
                                   isStep1Correct ? 'text-green-500' : 'text-blue-200'
                               }`}>→</div>
                          </div>
                      </div>
                  )
              })}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-6 sm:gap-8">
              {houses.map(house => {
                  const isSolved = solvedIds.includes(house.id);
                  const isTargetForWrong = wrongMatch && selectedHouseId === house.id;

                  return (
                    <div 
                        key={house.id}
                        onClick={() => handleHouseClick(house.id)}
                        className={`flex flex-col items-center cursor-pointer transition-all duration-300 ${isSolved ? 'scale-0 opacity-0 pointer-events-none' : ''}`}
                      >
                          <div className={`w-32 h-32 sm:w-36 sm:h-36 flex flex-col items-center justify-end relative
                               ${isTargetForWrong ? 'animate-shake' : 'hover:scale-105'}
                          `}>
                              <HouseIcon className={`w-full h-full drop-shadow-2xl ${selectedBirdId && !wrongMatch && !isSolved ? 'text-orange-400' : 'text-orange-200'}`} />
                              <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-white font-black text-2xl sm:text-3xl drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]">
                                  {house.value}
                              </div>
                          </div>
                      </div>
                  );
              })}
          </div>
      </div>
    </div>
  );
};

export default MatchingGame;
