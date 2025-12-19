
import React, { useState, useEffect, useRef } from 'react';
import { MathProblem } from '../types';
import { audioService } from '../services/audioService';

interface Props {
  problem: MathProblem;
  onUpdate: (val: string) => void;
  showResult: boolean;
}

interface PlacedPiece {
  sourceInstanceId: string;
  rotation: number;
}

const PuzzleMath: React.FC<Props> = ({ problem, onUpdate, showResult }) => {
  const { sourceShapes = [], gridPieces = [], templateName = '', allShapes = {} } = (problem.visualData && typeof problem.visualData === 'object' && !Array.isArray(problem.visualData)) 
    ? problem.visualData 
    : {};
    
  const placedPieces: Record<string, PlacedPiece> = problem.userAnswer ? JSON.parse(problem.userAnswer) : {};
  
  const [activeSourceId, setActiveSourceId] = useState<string | null>(null);
  const [sourceRotations, setSourceRotations] = useState<Record<string, number>>({});
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Khởi tạo góc xoay cho các mảnh ở kho
  useEffect(() => {
    const rots: Record<string, number> = {};
    sourceShapes.forEach((s: any) => { rots[s.instanceId] = 0; });
    setSourceRotations(rots);
    setActiveSourceId(null);
  }, [problem.id]);

  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!activeSourceId) return;
      const clientX = 'touches' in e ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX;
      const clientY = 'touches' in e ? (e as TouchEvent).touches[0].clientY : (e as MouseEvent).clientY;
      setMousePos({ x: clientX, y: clientY });
    };
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchmove', handleMove);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleMove);
    };
  }, [activeSourceId]);

  const handleSourceClick = (instanceId: string, e: React.MouseEvent | React.TouchEvent) => {
    if (showResult) return;
    audioService.play('click');
    setActiveSourceId(activeSourceId === instanceId ? null : instanceId);
    
    const clientX = 'touches' in e ? (e as React.TouchEvent).touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? (e as React.TouchEvent).touches[0].clientY : (e as React.MouseEvent).clientY;
    setMousePos({ x: clientX, y: clientY });
  };

  const rotateSource = (instanceId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (showResult) return;
    audioService.play('click');
    setSourceRotations(prev => ({
      ...prev,
      [instanceId]: (prev[instanceId] + 90) % 360
    }));
  };

  const handleTargetClick = (targetId: string, e: React.MouseEvent) => {
    if (showResult) return;
    e.stopPropagation();

    const targetConfig = gridPieces.find((p: any) => p.id === targetId);
    const alreadyPlaced = placedPieces[targetId];

    // TRƯỜNG HỢP 1: Đang cầm mảnh ghép -> Kiểm tra xem có khớp hướng và hình không
    if (activeSourceId && !alreadyPlaced) {
      const sourceShape = sourceShapes.find((s: any) => s.instanceId === activeSourceId);
      const currentRot = sourceRotations[activeSourceId] || 0;

      // Logic: Đúng loại hình (type) VÀ đúng góc xoay (targetRot)
      if (sourceShape.id === targetConfig.type && (currentRot % 360) === (targetConfig.targetRot % 360)) {
        audioService.play('correct');
        const newPlaced = { ...placedPieces };
        newPlaced[targetId] = { sourceInstanceId: activeSourceId, rotation: currentRot };
        onUpdate(JSON.stringify(newPlaced));
        setActiveSourceId(null);
      } else {
        audioService.play('wrong');
      }
    } 
    // TRƯỜNG HỢP 2: Đã lắp hình vào đó -> Cho phép gỡ ra để lắp lại nếu cần
    else if (alreadyPlaced) {
      audioService.play('click');
      const newPlaced = { ...placedPieces };
      delete newPlaced[targetId];
      onUpdate(JSON.stringify(newPlaced));
    }
  };

  const isAllCorrect = showResult && 
    gridPieces.every((p: any) => {
      const placed = placedPieces[p.id];
      return placed && (placed.rotation % 360) === (p.targetRot % 360);
    });

  return (
    <div ref={containerRef} className="bg-white p-4 sm:p-10 rounded-[48px] border-4 border-sky-100 shadow-2xl flex flex-col items-center w-full max-w-5xl mx-auto relative select-none">
      
      <div className="text-center mb-8">
          <h3 className="text-3xl font-black text-gray-800 mb-2 uppercase tracking-tighter">Bé tập xếp hình {templateName}</h3>
          <p className="text-orange-600 font-bold bg-orange-50 px-8 py-2 rounded-full inline-block animate-pulse text-sm sm:text-base border border-orange-100">
            XOAY hình ở kho cho đúng hướng rồi mới chạm vào bóng mờ nhé!
          </p>
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-center gap-12 w-full">
        
        {/* KHO MẢNH GHÉP (BÊN TRÁI) */}
        <div className="flex flex-row lg:flex-col items-center justify-center bg-gray-50 p-6 rounded-[40px] border-2 border-dashed border-gray-200 w-full lg:w-48 gap-6 shadow-inner">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest hidden lg:block">Chọn và Xoay</p>
          {sourceShapes.map((s: any) => {
              const isPicked = activeSourceId === s.instanceId;
              const isUsed = Object.values(placedPieces).some(p => p.sourceInstanceId === s.instanceId);
              const rotation = sourceRotations[s.instanceId] || 0;

              return (
                  <div key={s.instanceId} className="relative group">
                    <div 
                        onClick={(e) => handleSourceClick(s.instanceId, e)}
                        className={`p-3 rounded-3xl border-4 transition-all duration-300 cursor-pointer bg-white relative
                          ${isPicked ? 'border-sky-500 shadow-2xl -translate-y-2 scale-110 z-20' : 'border-transparent hover:border-sky-100'}
                          ${isUsed && !isPicked ? 'opacity-20 grayscale' : 'opacity-100'}
                        `}
                    >
                        <svg viewBox="0 0 100 100" className="w-16 h-16 sm:w-20 sm:h-20 overflow-visible transition-transform duration-300" style={{ transform: `rotate(${rotation}deg)` }}>
                            <path d={s.d} fill={s.color} stroke="#1e293b" strokeWidth="4" />
                        </svg>

                        {/* Nút xoay ngay tại kho */}
                        {isPicked && (
                          <button 
                            onClick={(e) => rotateSource(s.instanceId, e)}
                            className="absolute -top-4 -right-4 w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center shadow-xl border-4 border-white active:scale-90 transition-all z-30 pointer-events-auto"
                          >
                             <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                          </button>
                        )}
                    </div>
                    {isPicked && <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-black text-sky-600 animate-bounce uppercase">Đang cầm</div>}
                  </div>
              )
          })}
        </div>

        {/* KHUNG TRANH MẪU (BÊN PHẢI) */}
        <div className="relative flex-1 bg-white rounded-[56px] border-[12px] border-gray-100 p-4 shadow-2xl w-full aspect-square max-w-[500px]">
           <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
              {/* Bóng mờ gợi ý (Outlines) */}
              {gridPieces.map((p: any) => {
                const shapeType = allShapes[p.type.toUpperCase()];
                return (
                  <g key={`guide-${p.id}`} transform={`translate(${p.x-50*p.scale}, ${p.y-50*p.scale}) scale(${p.scale}) rotate(${p.targetRot}, 50, 50)`}>
                    <path 
                      d={shapeType.d} 
                      fill="#f8fafc" 
                      stroke="#cbd5e1" 
                      strokeWidth="2" 
                      strokeDasharray="4 4"
                    />
                  </g>
                );
              })}

              {/* Vùng tương tác và Hình đã lắp */}
              {gridPieces.map((p: any) => {
                  const placed = placedPieces[p.id];
                  const sourceData = placed ? sourceShapes.find((s:any) => s.instanceId === placed.sourceInstanceId) : null;
                  const isCorrectPos = placed && (placed.rotation % 360) === (p.targetRot % 360);
                  const showCorrect = showResult && isCorrectPos;

                  return (
                      <g key={p.id} onClick={(e) => handleTargetClick(p.id, e)} className="cursor-pointer group">
                          {/* Hitbox cảm ứng RỘNG */}
                          <circle cx={p.x} cy={p.y} r={18 * p.scale + 10} fill="transparent" />
                          
                          {/* Hình đã lắp (Đè khít tuyệt đối) */}
                          {placed && sourceData && (
                              <g transform={`translate(${p.x-50*p.scale}, ${p.y-50*p.scale}) scale(${p.scale}) rotate(${placed.rotation}, 50, 50)`}>
                                  <path 
                                      d={sourceData.d} 
                                      fill={sourceData.color} 
                                      stroke={showCorrect ? "#16a34a" : "#1e293b"} 
                                      strokeWidth={6 / p.scale}
                                      className="drop-shadow-lg transition-all duration-500"
                                  />
                              </g>
                          )}

                          {/* Dấu gỡ mảnh đã lắp */}
                          {placed && !showResult && (
                             <g transform={`translate(${p.x + 8}, ${p.y - 8})`}>
                               <circle r="4" fill="#ef4444" stroke="white" strokeWidth="1" />
                             </g>
                          )}
                      </g>
                  )
              })}
           </svg>
        </div>
      </div>

      {/* MẢNH GHÉP ĐANG CẦM (BAY THEO TAY) */}
      {activeSourceId && (
          <div 
            className="fixed pointer-events-none z-[9999]"
            style={{ left: mousePos.x, top: mousePos.y, transform: 'translate(-50%, -50%)' }}
          >
              <svg viewBox="0 0 100 100" className="w-24 h-24 drop-shadow-2xl" style={{ transform: `rotate(${sourceRotations[activeSourceId] || 0}deg)` }}>
                  <path 
                    d={sourceShapes.find((s:any) => s.instanceId === activeSourceId).d} 
                    fill={sourceShapes.find((s:any) => s.instanceId === activeSourceId).color} 
                    stroke="#0ea5e9" 
                    strokeWidth="8" 
                  />
              </svg>
          </div>
      )}

      {showResult && (
          <div className={`mt-10 p-6 rounded-[40px] font-black text-2xl shadow-2xl animate-fadeIn w-full text-center ${isAllCorrect ? 'bg-green-500 text-white' : 'bg-orange-500 text-white'}`}>
              {isAllCorrect ? '🌟 HOÀN THÀNH! BÉ XẾP ĐÚNG RỒI! 🏆' : '🧐 Bé hãy nhấn vào hình sai để gỡ ra, xoay lại hướng cho đúng rồi lắp vào nha!'}
          </div>
      )}
    </div>
  );
};

export default PuzzleMath;
