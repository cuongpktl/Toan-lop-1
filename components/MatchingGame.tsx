
import React, { useState, useEffect } from 'react';
import { MathProblem } from '../types';
import { generateMatchingGameData } from '../services/mathUtils';
import { audioService } from '../services/audioService';
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
    const data = generateMatchingGameData(4);
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

  const handleIntermediateChange = (birdId: string, val: string) => {
      setIntermediateValues(prev => ({ ...prev, [birdId]: val }));
  };

  const isComplete = birds.length > 0 && solvedIds.length === birds.length;
  const calculatedScore10 = birds.length > 0 ? (10 / birds.length) * solvedIds.length : 0;
  const displayScore = calculatedScore10 % 1 === 0 ? calculatedScore10 : calculatedScore10.toFixed(1);

  return (
    <div className="max-w-4xl mx-auto px-2 relative">
      {/* Vòng tròn điểm số đồng nhất: Điểm màu đỏ và To hơn */}
      {birds.length > 0 && (
        <div className="fixed top-2 left-1/2 -translate-x-1/2 sm:static sm:translate-x-0 sm:mb-4 z-[100] animate-fadeIn">
          <div className="w-20 h-20 sm:w-28 sm:h-28 bg-white border-4 border-orange-500 rounded-full shadow-2xl flex flex-col items-center justify-center mx-auto">
            <span className="text-[10px] font-black text-gray-400 uppercase leading-none">Điểm</span>
            <span className="text-xl sm:text-3xl font-black text-red-600">{displayScore}</span>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 bg-white p-5 rounded-3xl shadow-sm border border-gray-100 gap-4">
        <div className="text-center sm:text-left">
            <h2 className="text-xl font-extrabold text-gray-800">Ghép Chim Về Tổ</h2>
            <p className="text-gray-500 text-sm">Bé hãy tính từng bước dưới chú chim rồi chọn tổ nhé!</p>
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
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-20 sm:gap-x-8">
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
                            className={`p-2 sm:p-4 rounded-3xl border-4 w-32 h-32 sm:w-40 sm:h-40 flex items-center justify-center relative shadow-xl bg-white cursor-pointer transition-all
                              ${isSelected ? 'border-blue-500 bg-blue-50 ring-8 ring-blue-100 -translate-y-2' : 'border-sky-50 hover:border-sky-200'}
                              ${isWrong ? 'border-red-400 bg-red-50 animate-shake' : ''}
                          `}>
                              <BirdIcon className={`w-24 h-24 ${isSelected ? 'text-blue-500' : 'text-sky-400'}`} />
                              <div className="absolute -bottom-5 bg-white border-2 border-sky-100 px-2 py-1.5 rounded-xl text-[11px] sm:text-xs font-black text-gray-700 shadow-lg whitespace-nowrap flex gap-1 items-center">
                                  <span>{n1}</span>
                                  <span className="text-blue-400">{op1}</span>
                                  <span>{n2}</span>
                                  <span className="text-blue-400">{op2}</span>
                                  <span>{n3}</span>
                              </div>
                          </div>

                          <div className="w-full relative h-16 mt-6 flex justify-center overflow-visible">
                               <div className="absolute top-0 left-[26%] right-[48%] h-5 border-l-2 border-b-2 border-r-2 border-blue-200 rounded-b-lg"></div>
                               <div className="absolute top-5 left-[42%] -translate-x-1/2">
                                    <input 
                                        type="number"
                                        inputMode="numeric"
                                        placeholder="..."
                                        value={userStep1}
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={(e) => handleIntermediateChange(bird.id, e.target.value)}
                                        className={`w-10 h-8 text-center text-[10px] font-black rounded-lg border-2 outline-none transition-all shadow-sm ${
                                            isStep1Correct ? 'border-green-400 bg-green-50 text-green-600' :
                                            isStep1Wrong ? 'border-orange-300 bg-orange-50 text-orange-600' :
                                            'border-blue-50 bg-white focus:border-blue-200'
                                        }`}
                                    />
                               </div>
                               <div className="absolute top-6 left-[58%] text-[10px] text-blue-200 font-bold opacity-60">→</div>
                               <div className="absolute top-5 left-[78%] -translate-x-1/2 flex items-center gap-1 text-[10px] font-black text-gray-400">
                                   <span className="text-blue-300">{op2}</span>
                                   <span className="bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">{n3}</span>
                               </div>
                          </div>
                      </div>
                  )
              })}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
              {houses.map(house => {
                  const isSolved = solvedIds.includes(house.id);
                  const isTargetForWrong = wrongMatch && selectedHouseId === house.id;

                  return (
                    <div 
                        key={house.id}
                        onClick={() => handleHouseClick(house.id)}
                        className={`flex flex-col items-center cursor-pointer transition-all duration-300 ${isSolved ? 'scale-0 opacity-0 pointer-events-none' : ''}`}
                      >
                          <div className={`w-32 h-32 sm:w-40 sm:h-40 flex flex-col items-center justify-end relative
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
