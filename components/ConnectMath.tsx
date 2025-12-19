
import React, { useState, useEffect, useRef } from 'react';
import { MathProblem } from '../types';
import { audioService } from '../services/audioService';

interface Props {
  problem: MathProblem;
  onUpdate: (val: string) => void;
  showResult: boolean;
}

const ConnectMath: React.FC<Props> = ({ problem, onUpdate, showResult }) => {
  const { left = [], right = [] } = problem.visualData || {};
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [dragStartPos, setDragStartPos] = useState<{ x: number, y: number, id: string } | null>(null);
  const [currentMousePos, setCurrentMousePos] = useState<{ x: number, y: number } | null>(null);
  
  const userConnections: Record<string, string> = problem.userAnswer ? JSON.parse(problem.userAnswer) : {};
  const targetAnswers = problem.answer || {};

  const containerRef = useRef<HTMLDivElement>(null);
  // Refs cho các chấm tròn vàng (anchor points) thay vì toàn bộ button
  const leftAnchorRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const rightRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Cập nhật vị trí khi resize hoặc scroll
  const [, setTick] = useState(0);
  useEffect(() => {
    const handleResize = () => setTick(t => t + 1);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getRelativePos = (element: HTMLElement | null) => {
    if (!element || !containerRef.current) return { x: 0, y: 0 };
    const rect = element.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();
    return {
      x: rect.left - containerRect.left + rect.width / 2,
      y: rect.top - containerRect.top + rect.height / 2
    };
  };

  const handleStartDrag = (e: React.MouseEvent | React.TouchEvent, id: string) => {
    if (showResult) return;
    audioService.play('click');
    const pos = 'touches' in e ? e.touches[0] : e;
    const containerRect = containerRef.current?.getBoundingClientRect();
    const anchorEl = leftAnchorRefs.current[id];
    
    if (containerRect && anchorEl) {
      const anchorPos = getRelativePos(anchorEl);
      setDragStartPos({
        x: anchorPos.x,
        y: anchorPos.y,
        id
      });
      setSelectedLeft(id);
    }
  };

  const handleMove = (e: MouseEvent | TouchEvent) => {
    if (!dragStartPos || !containerRef.current) return;
    const pos = 'touches' in e ? e.touches[0] : e;
    const containerRect = containerRef.current.getBoundingClientRect();
    setCurrentMousePos({
      x: pos.clientX - containerRect.left,
      y: pos.clientY - containerRect.top
    });
  };

  const handleEndDrag = (e: MouseEvent | TouchEvent) => {
    if (!dragStartPos) return;
    
    const pos = 'touches' in e ? e.changedTouches[0] : e;
    const targetEl = document.elementFromPoint(pos.clientX, pos.clientY);
    const eggEl = targetEl?.closest('[data-result-val]');
    
    if (eggEl) {
      const resultVal = eggEl.getAttribute('data-result-val');
      if (resultVal) {
        audioService.play('click');
        const newConnections = { ...userConnections, [dragStartPos.id]: resultVal };
        onUpdate(JSON.stringify(newConnections));
      }
    }

    setDragStartPos(null);
    setCurrentMousePos(null);
    setSelectedLeft(null);
  };

  useEffect(() => {
    if (dragStartPos) {
      window.addEventListener('mousemove', handleMove);
      window.addEventListener('mouseup', handleEndDrag);
      window.addEventListener('touchmove', handleMove);
      window.addEventListener('touchend', handleEndDrag);
    } else {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEndDrag);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEndDrag);
    }
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEndDrag);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEndDrag);
    };
  }, [dragStartPos]);

  const getStatus = (leftId: string) => {
    if (!showResult) return 'idle';
    const userVal = userConnections[leftId];
    if (!userVal) return 'missing';
    return parseInt(userVal) === targetAnswers[leftId] ? 'correct' : 'wrong';
  };

  return (
    <div ref={containerRef} className="relative flex flex-col items-center gap-8 p-6 sm:p-10 bg-white rounded-[48px] border-4 border-yellow-50 shadow-xl animate-fadeIn w-full max-w-3xl mx-auto touch-none select-none overflow-visible">
      <div className="text-center space-y-2 pointer-events-none">
          <h3 className="text-2xl font-black text-yellow-600 uppercase tracking-tight">Nối Phép Tính Với Kết Quả</h3>
          <p className="text-gray-400 font-bold text-sm italic">Bé hãy dùng tay kéo từ chấm tròn vàng sang quả trứng đúng nhé!</p>
      </div>

      {/* Lớp vẽ đường nối SVG */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible">
        {Object.entries(userConnections).map(([leftId, resultVal]) => {
          const start = getRelativePos(leftAnchorRefs.current[leftId]);
          const end = getRelativePos(rightRefs.current[resultVal]);
          
          if (!start.x || !end.x) return null;
          
          const status = getStatus(leftId);
          let strokeColor = "#60a5fa"; // Blue default
          if (showResult) {
            strokeColor = status === 'correct' ? '#22c55e' : '#ef4444';
          }

          return (
            <line 
              key={`line-${leftId}`}
              x1={start.x}
              y1={start.y}
              x2={end.x - 30} // Gần tâm quả trứng nhưng lùi ra cạnh trái một chút
              y2={end.y}
              stroke={strokeColor}
              strokeWidth="6"
              strokeLinecap="round"
              className="transition-all duration-300 drop-shadow-sm"
            />
          );
        })}

        {dragStartPos && currentMousePos && (
          <line 
            x1={dragStartPos.x}
            y1={dragStartPos.y}
            x2={currentMousePos.x}
            y2={currentMousePos.y}
            stroke="#fbbf24"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray="8,8"
          />
        )}
      </svg>

      <div className="flex justify-between w-full gap-8 sm:gap-16 relative z-20">
        {/* Cột trái: Phép tính (Thiết kế giống hình ảnh) */}
        <div className="flex flex-col gap-6 w-1/2">
          {left.map((item: any) => {
            const status = getStatus(item.id);
            const isSelected = selectedLeft === item.id;
            const isConnected = !!userConnections[item.id];
            
            return (
              <div
                key={item.id}
                onMouseDown={(e) => handleStartDrag(e, item.id)}
                onTouchStart={(e) => handleStartDrag(e, item.id)}
                className={`relative group flex items-center justify-center p-4 rounded-2xl border-4 transition-all h-20 text-xl font-black shadow-sm cursor-pointer
                  ${isSelected ? 'border-yellow-500 bg-yellow-50' : 'bg-white border-blue-200'}
                  ${status === 'correct' ? 'border-green-400 bg-green-50 text-green-700' : ''}
                  ${status === 'wrong' ? 'border-red-400 bg-red-50 text-red-700' : ''}
                `}
              >
                {item.text}
                
                {/* Dấu chấm tròn vàng ở cạnh phải (Anchor Point) */}
                <div 
                  ref={(el) => { leftAnchorRefs.current[item.id] = el; }}
                  className={`absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full border-4 border-white shadow-md transition-all
                    ${isSelected || isConnected ? 'bg-yellow-500 scale-125' : 'bg-yellow-400 group-hover:scale-110'}
                  `}
                ></div>
              </div>
            );
          })}
        </div>

        {/* Cột phải: Quả trứng kết quả */}
        <div className="flex flex-col gap-6 w-1/2">
          {right.map((item: any, idx: number) => {
            const isMatchSelected = Object.values(userConnections).includes(item.text);
            
            return (
              <div
                key={idx}
                ref={(el) => { rightRefs.current[item.text] = el; }}
                data-result-val={item.text}
                className={`group relative flex items-center justify-center transition-all h-20
                  ${dragStartPos ? 'scale-110' : ''}
                `}
              >
                <svg viewBox="0 0 80 100" className={`w-16 h-20 drop-shadow-md transition-all ${isMatchSelected ? 'scale-110' : ''}`}>
                   <path 
                     d="M40 5 C20 5 5 40 5 65 C5 85 20 95 40 95 C60 95 75 85 75 65 C75 40 60 5 40 5 Z" 
                     fill={isMatchSelected ? "#fef3c7" : "white"} 
                     stroke={isMatchSelected ? "#f59e0b" : "#e2e8f0"} 
                     strokeWidth="4"
                   />
                </svg>
                <span className={`absolute font-black text-2xl pointer-events-none ${isMatchSelected ? 'text-yellow-700' : 'text-gray-600'}`}>
                  {item.text}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {showResult && (
        <div className="w-full p-4 bg-gray-50 rounded-2xl text-center relative z-20">
           <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Gợi ý của cô giáo:</p>
           <div className="flex flex-wrap justify-center gap-2 mt-2">
             {Object.entries(targetAnswers).map(([id, val]: any) => {
               const leftText = left.find((l:any) => l.id === id)?.text;
               return (
                 <div key={id} className="bg-white px-3 py-1 rounded-full border text-xs font-bold text-gray-600">
                    {leftText} = {val}
                 </div>
               );
             })}
           </div>
        </div>
      )}
    </div>
  );
};

export default ConnectMath;
