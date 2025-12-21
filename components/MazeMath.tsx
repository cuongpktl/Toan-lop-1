
import React, { useRef, useState, useMemo } from 'react';
import { MathProblem } from '../types';
import { focusNextEmptyInput } from '../services/uiUtils';

interface Props {
  problem: MathProblem;
  onUpdate: (val: string) => void;
  showResult: boolean;
}

const MazeMath: React.FC<Props> = ({ problem, onUpdate, showResult }) => {
  const { grid = {}, segments = [] } = problem.visualData || {};
  const userAnswers = problem.userAnswer ? JSON.parse(problem.userAnswer) : {};

  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
    scrollRef.current.style.cursor = 'grabbing';
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
    if (scrollRef.current) {
      scrollRef.current.style.cursor = 'grab';
    }
  };

  const handleInputChange = (coord: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (showResult) return;
    const newAnswers = { ...userAnswers, [coord]: val };
    onUpdate(JSON.stringify(newAnswers));

    if (val !== '') {
        setTimeout(() => focusNextEmptyInput(e.target), 300);
    }
  };

  // Logic kiểm tra tính đúng đắn linh hoạt của từng đoạn phép tính
  const cellStatus = useMemo(() => {
    if (!showResult) return {};
    const status: Record<string, boolean> = {};

    segments.forEach((seg: any) => {
      const getVal = (coord: string) => {
        const cell = grid[coord];
        if (cell.isStatic) return cell.value;
        const uVal = userAnswers[coord];
        return uVal === "" || uVal === undefined ? NaN : parseInt(uVal);
      };

      const vStart = getVal(seg.start);
      const vMiddle = getVal(seg.middle);
      const vEnd = getVal(seg.end);

      if (!isNaN(vStart) && !isNaN(vMiddle) && !isNaN(vEnd)) {
        const isSegmentCorrect = seg.op === '+' 
          ? vStart + vMiddle === vEnd 
          : vStart - vMiddle === vEnd;
        
        // Nếu phép tính đúng, các ô input trong đó được đánh dấu là đúng (nếu chưa bị đánh dấu sai trước đó)
        if (isSegmentCorrect) {
          if (!grid[seg.middle].isStatic && status[seg.middle] !== false) status[seg.middle] = true;
          if (!grid[seg.end].isStatic && status[seg.end] !== false) status[seg.end] = true;
        } else {
          // Nếu sai, đánh dấu sai các ô input
          if (!grid[seg.middle].isStatic) status[seg.middle] = false;
          if (!grid[seg.end].isStatic) status[seg.end] = false;
        }
      } else {
          // Ô trống coi như sai
          if (!grid[seg.middle].isStatic) status[seg.middle] = false;
          if (!grid[seg.end].isStatic) status[seg.end] = false;
      }
    });
    return status;
  }, [showResult, userAnswers, grid, segments]);

  const coords = Object.keys(grid).map(c => c.split(',').map(Number));
  if (coords.length === 0) return null;

  const minR = Math.min(...coords.map(c => c[0]));
  const maxR = Math.max(...coords.map(c => c[0]));
  const minC = Math.min(...coords.map(c => c[1]));
  const maxC = Math.max(...coords.map(c => c[1]));

  const rows = [];
  for (let r = minR; r <= maxR; r++) {
    const cols = [];
    for (let c = minC; c <= maxC; c++) {
      cols.push(grid[`${r},${c}`] || null);
    }
    rows.push(cols);
  }

  return (
    <div className="flex flex-col items-center gap-8 p-6 sm:p-12 bg-white rounded-[48px] border-4 border-blue-50 shadow-xl animate-fadeIn overflow-hidden">
      <div className="text-center space-y-3">
          <h3 className="text-2xl font-black text-blue-600 uppercase tracking-tight">Thử Thách Mê Cung</h3>
          <p className="text-gray-400 font-bold text-sm italic">Bé nhấn giữ chuột và kéo để xem tiếp mê cung nhé!</p>
      </div>

      <div 
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        className="relative p-6 sm:p-10 bg-slate-50/50 rounded-[40px] border-2 border-slate-100 shadow-inner overflow-x-auto w-full max-w-full no-scrollbar cursor-grab active:cursor-grabbing"
      >
        <div className="inline-grid gap-y-3 gap-x-1 sm:gap-x-4">
          {rows.map((row, r) => (
            <div key={r} className="flex gap-1 sm:gap-3 items-center justify-center">
              {row.map((cell, c) => {
                const coord = `${r + minR},${c + minC}`;
                if (!cell) return <div key={coord} className="w-12 h-12 sm:w-16 sm:h-16"></div>;
                if (cell.type === 'op') return <div key={coord} className="w-8 h-12 sm:w-12 sm:h-16 flex items-center justify-center font-black text-2xl sm:text-3xl text-blue-300">{cell.value}</div>;

                const userVal = userAnswers[coord] || '';
                const isCorrect = showResult && cellStatus[coord] === true;
                const isWrong = showResult && cellStatus[coord] === false;

                if (cell.isStatic) return <div key={coord} className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center font-black text-xl sm:text-2xl rounded-2xl border-4 border-blue-100 bg-white text-gray-700 shadow-md">{cell.value}</div>;

                return (
                  <div key={coord} className="relative">
                    <input
                      type="number"
                      inputMode="numeric"
                      data-maze-coord={coord}
                      data-priority="2" 
                      value={userVal}
                      onChange={(e) => handleInputChange(coord, e)}
                      disabled={showResult}
                      className={`w-12 h-12 sm:w-16 sm:h-16 text-center font-black text-xl sm:text-2xl rounded-2xl border-4 outline-none transition-all shadow-lg ${
                        showResult 
                        ? (isCorrect ? 'bg-green-50 border-green-500 text-green-700' : 'bg-red-50 border-red-400 text-red-700') 
                        : 'bg-white border-blue-300 text-blue-600 focus:border-blue-500 focus:scale-110'
                      }`}
                      placeholder="?"
                    />
                    {showResult && isWrong && (
                      <div className="absolute -top-4 -right-4 w-6 h-6 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-lg z-10 border-2 border-white">
                        !
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MazeMath;
