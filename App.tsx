
import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { TabItem, MathProblem } from './types';
import { audioService } from './services/audioService';
import { 
  generateVerticalProblems, 
  generateExpressionProblems, 
  generateFillBlankProblems, 
  generateMeasurementProblems, 
  generateGeometryProblems,
  generatePatternProblems,
  generateChallengeProblem,
  generatePuzzleProblem,
  generateComparisonProblems,
  generateMixedProblems,
  generateMultipleChoiceProblems,
  generateDecodeProblems,
  generateColoringProblems,
  generateMazeProblems
} from './services/mathUtils';
import VerticalMath from './components/VerticalMath';
import ExpressionMath from './components/ExpressionMath';
import FillBlankMath from './components/FillBlankMath';
import MeasurementMath from './components/MeasurementMath';
import GeometryMath from './components/GeometryMath';
import PatternMath from './components/PatternMath';
import ChallengeMath from './components/ChallengeMath';
import PuzzleMath from './components/PuzzleMath';
import ComparisonMath from './components/ComparisonMath';
import MultipleChoiceMath from './components/MultipleChoiceMath';
import DecodeMath from './components/DecodeMath';
import ColoringMath from './components/ColoringMath';
import MazeMath from './components/MazeMath';
import Find100Game from './components/Find100Game';
import WordProblem from './components/WordProblem';
import WordProblemItem from './components/WordProblemItem';
import MatchingGame from './components/MatchingGame';
import { 
  CalculatorIcon, 
  BookOpenIcon, 
  GridIcon, 
  LayersIcon, 
  CheckCircleIcon, 
  RefreshIcon, 
  PuzzleIcon, 
  ScaleIcon, 
  ShapesIcon,
  PatternIcon,
  StarIcon,
  CompareIcon,
  KeyIcon,
  PaintIcon,
  RouteIcon
} from './components/icons';

const ICON_MAP: Record<string, string> = {
  pig: "🐷",
  cat: "🐱",
  chick: "🐥",
  dog: "🐶"
};

const TABS: TabItem[] = [
  { id: 'practice', label: 'Luyện Tập', icon: <StarIcon />, color: 'bg-orange-400' },
  { id: 'maze', label: 'Mê Cung', icon: <RouteIcon />, color: 'bg-blue-600' },
  { id: 'coloring', label: 'Tô Màu', icon: <PaintIcon />, color: 'bg-pink-600' },
  { id: 'decode', label: 'Giải Mã', icon: <KeyIcon />, color: 'bg-purple-600' },
  { id: 'word', label: 'Bài Toán', icon: <BookOpenIcon />, color: 'bg-yellow-500' },
  { id: 'choice', label: 'Trắc Nghiệm', icon: <CheckCircleIcon />, color: 'bg-sky-600' },
  { id: 'pattern', label: 'Quy Luật', icon: <PatternIcon />, color: 'bg-teal-600' },
  { id: 'compare', label: 'So Sánh', icon: <CompareIcon />, color: 'bg-indigo-600' },
  { id: 'geometry', label: 'Hình Học', icon: <ShapesIcon />, color: 'bg-teal-500' },
  { id: 'measurement', label: 'Đo Lường', icon: <ScaleIcon />, color: 'bg-pink-500' },
  { id: 'vertical', label: 'Đặt Tính', icon: <LayersIcon />, color: 'bg-blue-500' },
  { id: 'matching', label: 'Ghép Hình', icon: <PuzzleIcon />, color: 'bg-orange-500' },
  { id: 'cards', label: 'Thẻ Số', icon: <GridIcon />, color: 'bg-indigo-500' },
  { id: 'expression', label: 'Biểu Thức', icon: <CalculatorIcon />, color: 'bg-purple-500' },
  { id: 'game', label: 'Tìm 10', icon: <CheckCircleIcon />, color: 'bg-green-500' },
  { id: 'challenge', label: 'Tìm hình', icon: <StarIcon fill="white" />, color: 'bg-rose-500' },
  { id: 'puzzle', label: 'Xếp Hình', icon: <GridIcon />, color: 'bg-sky-500' },
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('practice');
  const [problems, setProblems] = useState<MathProblem[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  useEffect(() => {
    setShowResult(false);
    setScore(0);
    setProblems([]); 
    refreshData();
  }, [activeTab]);

  const refreshData = () => {
    if (activeTab === 'vertical') setProblems(generateVerticalProblems(10));
    else if (activeTab === 'expression') setProblems(generateExpressionProblems(10));
    else if (activeTab === 'cards') setProblems(generateFillBlankProblems(10));
    else if (activeTab === 'measurement') setProblems(generateMeasurementProblems(10));
    else if (activeTab === 'geometry') setProblems(generateGeometryProblems(10));
    else if (activeTab === 'pattern') setProblems(generatePatternProblems(10));
    else if (activeTab === 'compare') setProblems(generateComparisonProblems(10));
    else if (activeTab === 'practice') setProblems(generateMixedProblems(10));
    else if (activeTab === 'choice') setProblems(generateMultipleChoiceProblems(10));
    else if (activeTab === 'decode') setProblems(generateDecodeProblems(10));
    else if (activeTab === 'coloring') setProblems(generateColoringProblems(10));
    else if (activeTab === 'maze') setProblems(generateMazeProblems(10)); // Khôi phục lên 10 bài
    else if (activeTab === 'challenge') setProblems([generateChallengeProblem()]);
    else if (activeTab === 'puzzle') setProblems([generatePuzzleProblem()]);
    else setProblems([]);
  };

  const handleUpdateProblem = (id: string, val: string) => {
    setProblems(prev => prev.map(p => p.id === id ? { ...p, userAnswer: val } : p));
  };

  const handleRefresh = () => {
    audioService.play('click');
    setShowResult(false);
    setScore(0);
    refreshData();
  };

  const handleTabChange = (id: string) => {
    audioService.play('click');
    setActiveTab(id);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    isDragging.current = true;
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeft.current = scrollRef.current.scrollLeft;
    scrollRef.current.style.scrollBehavior = 'auto';
    scrollRef.current.style.cursor = 'grabbing';
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 2;
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    isDragging.current = false;
    if (scrollRef.current) {
        scrollRef.current.style.scrollBehavior = 'smooth';
        scrollRef.current.style.cursor = 'grab';
    }
  };

  const isProblemCorrect = (p: MathProblem) => {
    if (p.type === 'maze') {
        const userAnswers = p.userAnswer ? JSON.parse(p.userAnswer) : {};
        const targetAnswers = p.answer || {};
        const targetKeys = Object.keys(targetAnswers);
        if (targetKeys.length === 0) return false;
        return targetKeys.every(coord => {
            return parseInt(userAnswers[coord]) === targetAnswers[coord];
        });
    }
    if (p.type === 'coloring') {
        const userData = p.userAnswer ? JSON.parse(p.userAnswer) : { colors: {}, results: {} };
        const userColors = userData.colors || {};
        const userResults = userData.results || {};
        const cells = p.visualData?.cells || [];
        if (Object.keys(userColors).length === 0 && Object.keys(userResults).length === 0) return false;
        return cells.every((cell: any) => {
           const colorCorrect = userColors[cell.id] === cell.targetColor;
           const resultCorrect = parseInt(userResults[cell.id]) === cell.targetValue;
           return colorCorrect && resultCorrect;
        });
    }
    if (p.type === 'geometry' && p.visualType === 'identify_shape') {
      const userSelected = p.userAnswer ? JSON.parse(p.userAnswer) : [];
      const targetIds = p.visualData?.shapes?.filter((s: any) => s.type === p.visualData?.targetId).map((s: any) => s.id) || [];
      return targetIds.length === userSelected.length && targetIds.every((id: string) => userSelected.includes(id));
    }
    if (p.type === 'puzzle') {
      const placedPieces = p.userAnswer ? JSON.parse(p.userAnswer) : {};
      const targets = (p.answer as any[]) || [];
      if (Object.keys(placedPieces).length !== targets.length) return false;
      return targets.every(t => {
          const placed = placedPieces[t.id];
          return placed && (placed.rotation % 360) === (t.targetRot % 360);
      });
    }
    if (p.visualType === 'double_op') {
      const userOps = p.userAnswer ? JSON.parse(p.userAnswer) : ['', ''];
      const targetOps = p.answer ? JSON.parse(p.answer) : ['', ''];
      return userOps.every((op: string, i: number) => op === targetOps[i]);
    }
    if (p.type === 'challenge' || p.type === 'word' || p.type === 'comparison' || p.type === 'fill_blank' || p.type === 'multiple_choice' || p.type === 'decode') {
        return String(p.userAnswer) === String(p.answer) || (p.type !== 'word' && p.type !== 'multiple_choice' && parseInt(p.userAnswer || '') === p.answer);
    }
    if (p.type === 'pattern') {
        const userAnswers = p.userAnswer ? JSON.parse(p.userAnswer) : {};
        const hiddenCells = (p.visualData?.hiddenCells as any[]) || [];
        if (hiddenCells.length === 0) return String(p.userAnswer) === String(p.answer);
        return hiddenCells.every(h => userAnswers[`${h.r}-${h.c}`] === h.target);
    }
    return parseInt(p.userAnswer || '') === p.answer;
  };

  const checkResults = () => {
    if (showResult) { setShowResult(false); return; }
    const correctCount = problems.filter(isProblemCorrect).length;
    setScore(correctCount);
    if (correctCount === problems.length && problems.length > 0) {
      audioService.play('success');
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#3b82f6', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6'] });
    } else {
      audioService.play(correctCount > problems.length / 2 ? 'correct' : 'wrong');
    }
    setShowResult(true);
  };

  const calculatedScore10 = problems.length > 0 ? (10 / problems.length) * score : 0;
  const displayScore = calculatedScore10 % 1 === 0 ? calculatedScore10 : calculatedScore10.toFixed(1);

  const renderContent = () => {
    if (activeTab === 'word') return <WordProblem />;
    if (activeTab === 'game') return <Find100Game />;
    if (activeTab === 'matching') return <MatchingGame />;

    const isFullWidth = activeTab === 'challenge' || activeTab === 'puzzle' || activeTab === 'coloring' || activeTab === 'maze';
    
    return (
      <div className="max-w-4xl mx-auto animate-fadeIn px-2 sm:px-0 relative">
        {activeTab === 'decode' && problems.length > 0 && problems[0]?.visualData?.legend && (
           <div className="sticky top-[132px] sm:top-[144px] z-40 mb-10 p-4 sm:p-6 bg-purple-50/95 backdrop-blur-md rounded-[32px] border-4 border-purple-200 shadow-xl flex flex-col items-center gap-3 transition-all">
              <span className="font-black text-purple-700 uppercase tracking-widest text-[10px] sm:text-xs">Bảng Quy Đổi Thần Kỳ</span>
              <div className="flex flex-wrap justify-center gap-3 sm:gap-8">
                 {Object.entries(problems[0].visualData.legend as Record<string, number>).map(([key, val]) => (
                    <div key={key} className="flex items-center gap-2 bg-white px-3 py-2 rounded-2xl border-2 border-purple-100 shadow-sm">
                       <span className="text-2xl sm:text-3xl">{ICON_MAP[key] || "🐾"}</span>
                       <span className="text-lg sm:text-xl font-black text-purple-600">= {val}</span>
                    </div>
                 ))}
              </div>
           </div>
        )}

        <div className={`flex flex-col gap-8 sm:gap-12`}>
            {problems.map((p, index) => (
                <div key={p.id} className="relative pt-8 sm:pt-10">
                    <div className="absolute top-0 left-0 bg-blue-600 text-white px-5 py-1.5 rounded-br-2xl rounded-tl-xl font-black text-sm shadow-md z-10 flex items-center gap-2">
                        <span className="opacity-70">#</span> Câu {index + 1}
                    </div>
                    <div className={`${isFullWidth ? 'w-full' : 'bg-white rounded-[32px] p-2 sm:p-4'}`}>
                        {p.type === 'fill_blank' && <FillBlankMath problem={p} onUpdate={(val) => handleUpdateProblem(p.id, val)} showResult={showResult} />}
                        {p.type === 'measurement' && <MeasurementMath problem={p} onUpdate={(val) => handleUpdateProblem(p.id, val)} showResult={showResult} />}
                        {p.type === 'geometry' && <GeometryMath problem={p} onUpdate={(val) => handleUpdateProblem(p.id, val)} showResult={showResult} />}
                        {p.type === 'pattern' && <PatternMath problem={p} onUpdate={(val) => handleUpdateProblem(p.id, val)} showResult={showResult} />}
                        {p.type === 'challenge' && <ChallengeMath problem={p} onUpdate={(val) => handleUpdateProblem(p.id, val)} showResult={showResult} />}
                        {p.type === 'puzzle' && <PuzzleMath problem={p} onUpdate={(val) => handleUpdateProblem(p.id, val)} showResult={showResult} />}
                        {p.type === 'comparison' && <ComparisonMath problem={p} onUpdate={(val) => handleUpdateProblem(p.id, val)} showResult={showResult} />}
                        {p.type === 'vertical' && <VerticalMath problem={p} onUpdate={(val) => handleUpdateProblem(p.id, val)} showResult={showResult} />}
                        {p.type === 'expression' && <ExpressionMath problem={p} onUpdate={(val) => handleUpdateProblem(p.id, val)} showResult={showResult} />}
                        {p.type === 'multiple_choice' && <MultipleChoiceMath problem={p} onUpdate={(val) => handleUpdateProblem(p.id, val)} showResult={showResult} />}
                        {p.type === 'decode' && <DecodeMath problem={p} onUpdate={(val) => handleUpdateProblem(p.id, val)} showResult={showResult} />}
                        {p.type === 'coloring' && <ColoringMath problem={p} onUpdate={(val) => handleUpdateProblem(p.id, val)} showResult={showResult} />}
                        {p.type === 'maze' && <MazeMath problem={p} onUpdate={(val) => handleUpdateProblem(p.id, val)} showResult={showResult} />}
                    </div>
                </div>
            ))}
        </div>
        
        {problems.length > 0 && (
          <div className="mt-12 flex flex-col sm:flex-row justify-center items-stretch sm:items-center gap-4 px-4 pb-10">
              <button onClick={handleRefresh} className="px-6 py-4 sm:py-3 rounded-2xl bg-white border-2 border-gray-200 hover:border-blue-300 text-gray-700 font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm">
                  <RefreshIcon /> Làm Đề Khác
              </button>
              <button onClick={checkResults} className={`px-12 py-4 sm:py-3 rounded-2xl font-black shadow-lg transform transition-all active:scale-95 text-white text-lg ${showResult ? 'bg-gray-500' : 'bg-blue-600 hover:bg-blue-700'}`}>
                  {showResult ? 'Làm Lại' : 'Nộp Bài'}
              </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-10 flex flex-col">
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center gap-4 sm:gap-6 relative">
                <div className="flex flex-col sm:flex-row sm:items-baseline">
                    <h1 className="text-xl md:text-2xl font-black text-blue-600 uppercase tracking-tighter whitespace-nowrap">Toán lớp 1</h1>
                    <span className="sm:ml-2 text-[10px] md:text-xs font-black text-gray-500 normal-case italic">Quang Minh 1A8</span>
                </div>
                {showResult && problems.length > 0 && (
                  <div className="animate-bounce-short">
                    <div className="w-16 h-16 sm:w-24 sm:h-24 bg-white border-4 border-blue-600 rounded-full shadow-xl flex flex-col items-center justify-center">
                      <span className="text-[10px] font-black text-gray-400 uppercase leading-none">Điểm</span>
                      <span className="text-lg sm:text-2xl font-black text-red-600">{displayScore}</span>
                    </div>
                  </div>
                )}
            </div>
            <div className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">Lớp 1 - Học kỳ 2</div>
        </div>
        <div className="scroll-container-mask border-t border-gray-50 bg-white">
            <div ref={scrollRef} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUpOrLeave} onMouseLeave={handleMouseUpOrLeave} className="overflow-x-auto no-scrollbar cursor-grab active:cursor-grabbing px-4 sm:px-10">
                <div className="max-w-5xl mx-auto flex space-x-2 py-3 min-w-max items-center">
                    {TABS.map(tab => (
                        <button key={tab.id} onClick={() => handleTabChange(tab.id)} className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-sm transition-all duration-200 ${activeTab === tab.id ? `${tab.color} text-white shadow-lg shadow-${tab.color.split('-')[1]}-200 transform scale-105` : 'bg-gray-50 text-gray-500 hover:bg-gray-100 border border-transparent'}`}>
                            <span className="scale-90">{tab.icon}</span> {tab.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
      </header>
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-6 sm:py-10">{renderContent()}</main>
    </div>
  );
};
export default App;
