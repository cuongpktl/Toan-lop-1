
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
  generateMazeProblems,
  generateConnectProblems,
  generateHouseProblems
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
import ConnectMath from './components/ConnectMath';
import HouseMath from './components/HouseMath';
import Find100Game from './components/Find100Game';
import WordProblem from './components/WordProblem';
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
  RouteIcon,
  HouseIcon,
} from './components/icons';

const ICON_MAP: Record<string, string> = {
  pig: "🐷",
  cat: "🐱",
  chick: "🐥",
  dog: "🐶"
};

const TABS: TabItem[] = [
  { id: 'practice', label: 'Luyện Tập', icon: <StarIcon />, color: 'bg-orange-400' },
  { id: 'house', label: 'Ngôi Nhà', icon: <HouseIcon />, color: 'bg-indigo-400' },
  { id: 'connect', label: 'Nối Kết', icon: <CompareIcon />, color: 'bg-yellow-600' },
  { id: 'maze', label: 'Mê Cung', icon: <RouteIcon />, color: 'bg-blue-600' },
  { id: 'coloring', label: 'Tô Màu', icon: <PaintIcon />, color: 'bg-pink-600' },
  { id: 'decode', label: 'Giải Mã', icon: <KeyIcon />, color: 'bg-purple-600' },
  { id: 'word', label: 'Bài Toán', icon: <BookOpenIcon />, color: 'bg-yellow-500' },
  { id: 'choice', label: 'Trắc Nghiệm', icon: <CheckCircleIcon />, color: 'bg-sky-600' },
  { id: 'pattern', label: 'Quy Luật', icon: <PatternIcon />, color: 'bg-teal-600' },
  { id: 'compare', label: 'So Sánh', icon: <CompareIcon />, color: 'bg-indigo-600' },
  { id: 'vertical', label: 'Đặt Tính', icon: <LayersIcon />, color: 'bg-blue-500' },
  { id: 'cards', label: 'Thẻ Số', icon: <GridIcon />, color: 'bg-indigo-500' },
  { id: 'expression', label: 'Biểu Thức', icon: <CalculatorIcon />, color: 'bg-purple-500' },
  { id: 'geometry', label: 'Hình Học', icon: <ShapesIcon />, color: 'bg-teal-500' },
  { id: 'measurement', label: 'Đo Lường', icon: <ScaleIcon />, color: 'bg-pink-500' },
  { id: 'matching', label: 'Ghép Hình', icon: <PuzzleIcon />, color: 'bg-orange-500' },
  { id: 'game', label: 'Tìm 10', icon: <CheckCircleIcon />, color: 'bg-green-500' },
  { id: 'challenge', label: 'Tìm hình', icon: <StarIcon fill="white" />, color: 'bg-rose-500' },
  { id: 'puzzle', label: 'Xếp Hình', icon: <GridIcon />, color: 'bg-sky-500' },
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('practice');
  const [tabsData, setTabsData] = useState<Record<string, { problems: MathProblem[], showResult: boolean }>>({});
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  useEffect(() => {
    if (!tabsData[activeTab]) {
      refreshData(activeTab);
    }
  }, [activeTab]);

  const refreshData = (tabId: string) => {
    let newProblems: MathProblem[] = [];
    if (tabId === 'vertical') newProblems = generateVerticalProblems(10);
    else if (tabId === 'expression') newProblems = generateExpressionProblems(10);
    else if (tabId === 'cards') newProblems = generateFillBlankProblems(10);
    else if (tabId === 'measurement') newProblems = generateMeasurementProblems(10);
    else if (tabId === 'geometry') newProblems = generateGeometryProblems(10);
    else if (tabId === 'pattern') newProblems = generatePatternProblems(10);
    else if (tabId === 'compare') newProblems = generateComparisonProblems(10);
    else if (tabId === 'practice') newProblems = generateMixedProblems(20);
    else if (tabId === 'choice') newProblems = generateMultipleChoiceProblems(10);
    else if (tabId === 'decode') newProblems = generateDecodeProblems(10);
    else if (tabId === 'coloring') newProblems = generateColoringProblems(10);
    else if (tabId === 'maze') newProblems = generateMazeProblems(10);
    else if (tabId === 'connect') newProblems = generateConnectProblems(10);
    else if (tabId === 'house') newProblems = generateHouseProblems(10);
    else if (tabId === 'challenge') newProblems = Array.from({ length: 10 }, () => generateChallengeProblem());
    else if (tabId === 'puzzle') newProblems = Array.from({ length: 10 }, () => generatePuzzleProblem());
    
    setTabsData(prev => ({
      ...prev,
      [tabId]: { problems: newProblems, showResult: false }
    }));
  };

  const currentTabInfo = tabsData[activeTab] || { problems: [], showResult: false };
  const problems = currentTabInfo.problems;
  const showResult = currentTabInfo.showResult;

  const handleUpdateProblem = (id: string, val: string) => {
    setTabsData(prev => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        problems: prev[activeTab].problems.map(p => p.id === id ? { ...p, userAnswer: val } : p)
      }
    }));
  };

  const handleRefresh = () => {
    audioService.play('click');
    refreshData(activeTab);
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
    const user = String(p.userAnswer || '').trim();
    if (p.type === 'house') {
        const userAns = p.userAnswer ? JSON.parse(p.userAnswer) : {};
        const { sum, p1, p2 } = p.answer;
        const userRows = [0, 1, 2, 3].map(r => [parseInt(userAns[`${r}-0`]), parseInt(userAns[`${r}-1`]), parseInt(userAns[`${r}-2`])]);
        const checkAdd = (r: number[]) => !r.some(isNaN) && r[0]+r[1]===r[2] && r[2]===sum && ((r[0]===p1 && r[1]===p2)||(r[0]===p2 && r[1]===p1));
        const checkSub = (r: number[]) => !r.some(isNaN) && r[0]-r[1]===r[2] && r[0]===sum && ((r[1]===p1 && r[2]===p2)||(r[1]===p2 && r[2]===p1));
        return checkAdd(userRows[0]) && checkAdd(userRows[1]) && checkSub(userRows[2]) && checkSub(userRows[3]);
    }
    if (p.type === 'comparison' && p.visualType === 'missing_number') {
        if (!user) return false;
        const nums = [...(p.numbers || [])];
        const hideIdx = p.visualData?.hideIdx;
        const targetSign = p.visualData?.sign;
        const ops = p.operators || ['+', '+'];
        nums[hideIdx] = parseInt(user);
        const lRes = ops[0] === '+' ? nums[0] + nums[1] : nums[0] - nums[1];
        const rRes = ops[1] === '+' ? nums[2] + nums[3] : nums[2] - nums[3];
        if (targetSign === '>') return lRes > rRes;
        if (targetSign === '<') return lRes < rRes;
        return lRes === rRes;
    }
    if (p.type === 'connect') {
      const userConnections = p.userAnswer ? JSON.parse(p.userAnswer) : {};
      const targetAnswers = p.answer || {};
      const leftIds = p.visualData?.left?.map((l:any) => l.id) || [];
      return leftIds.length > 0 && leftIds.every((id: string) => parseInt(userConnections[id]) === targetAnswers[id]);
    }
    if (p.type === 'maze') {
        const userAnswers = p.userAnswer ? JSON.parse(p.userAnswer) : {};
        const targetAnswers = p.answer || {};
        return Object.keys(targetAnswers).length > 0 && Object.keys(targetAnswers).every(coord => parseInt(userAnswers[coord]) === targetAnswers[coord]);
    }
    if (p.type === 'geometry' && p.visualType === 'identify_shape') {
      const userSelected = p.userAnswer ? JSON.parse(p.userAnswer) : [];
      const targetIds = p.visualData?.shapes?.filter((s: any) => s.type === p.visualData?.targetId).map((s: any) => s.id) || [];
      return targetIds.length === userSelected.length && targetIds.every((id: string) => userSelected.includes(id));
    }
    return parseInt(user) === p.answer;
  };

  const checkResults = () => {
    if (showResult) {
      setTabsData(prev => ({ ...prev, [activeTab]: { ...prev[activeTab], showResult: false } }));
      return;
    }
    const correctCount = problems.filter(isProblemCorrect).length;
    if (correctCount === problems.length && problems.length > 0) {
      audioService.play('success');
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#3b82f6', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6'] });
    } else {
      audioService.play(correctCount > problems.length / 2 ? 'correct' : 'wrong');
    }
    setTabsData(prev => ({ ...prev, [activeTab]: { ...prev[activeTab], showResult: true } }));
  };

  const scoreCount = problems.filter(isProblemCorrect).length;
  const calculatedScore10 = problems.length > 0 ? (10 / problems.length) * scoreCount : 0;
  const displayScore = calculatedScore10 % 1 === 0 ? calculatedScore10 : calculatedScore10.toFixed(1);

  const renderContent = () => {
    if (activeTab === 'word') return <WordProblem />;
    if (activeTab === 'game') return <Find100Game />;
    if (activeTab === 'matching') return <MatchingGame />;
    const isFullWidth = activeTab === 'challenge' || activeTab === 'puzzle' || activeTab === 'coloring' || activeTab === 'maze' || activeTab === 'connect';
    return (
      <div className="max-w-4xl mx-auto animate-fadeIn px-1 sm:px-0 relative">
        <div className="flex flex-col gap-6 sm:gap-12">
            {problems.map((p, index) => (
                <div key={p.id} data-problem-block="true" className="relative pt-6 sm:pt-10">
                    <div className="absolute top-0 left-0 bg-blue-600 text-white px-4 py-1.5 rounded-br-2xl rounded-tl-xl font-black text-[10px] sm:text-sm shadow-md z-10 flex items-center gap-2">
                        <span className="opacity-70">#</span> Câu {index + 1}
                    </div>

                    {p.type === 'decode' && p.visualData?.legend && (
                        <div className="mb-4 p-3 sm:p-6 bg-purple-50 rounded-[24px] sm:rounded-[48px] border-2 sm:border-4 border-purple-200 shadow-lg flex flex-col items-center gap-2 sm:gap-3 transition-all animate-fadeIn w-full mx-auto">
                            <span className="font-black text-purple-700 uppercase tracking-widest text-[8px] sm:text-xs bg-white px-3 py-0.5 rounded-full shadow-sm">Bảng Quy Đổi Thần Kỳ</span>
                            <div className="w-full overflow-x-auto no-scrollbar scroll-smooth">
                                <div className="flex flex-nowrap justify-start sm:justify-center gap-2 sm:gap-8 px-2 py-2 min-w-max mx-auto">
                                    {Object.entries(p.visualData.legend as Record<string, number>).map(([key, val]) => (
                                        <div key={key} className="flex items-center gap-1 sm:gap-2 bg-white px-2 sm:px-3 py-1 sm:py-2 rounded-xl sm:rounded-2xl border border-purple-100 shadow-sm shrink-0">
                                            <span className="text-xl sm:text-3xl">{ICON_MAP[key] || "🐾"}</span>
                                            <span className="text-sm sm:text-xl font-black text-purple-600">= {val}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className={`${isFullWidth ? 'w-full' : 'bg-white rounded-[24px] sm:rounded-[32px] p-1.5 sm:p-4'}`}>
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
                        {p.type === 'connect' && <ConnectMath problem={p} onUpdate={(val) => handleUpdateProblem(p.id, val)} showResult={showResult} />}
                        {p.type === 'house' && <HouseMath problem={p} onUpdate={(val) => handleUpdateProblem(p.id, val)} showResult={showResult} />}
                    </div>
                </div>
            ))}
        </div>
        {problems.length > 0 && (
          <div className="mt-12 flex flex-col sm:flex-row justify-center items-stretch sm:items-center gap-4 px-2 sm:px-4 pb-10">
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
        <div className="max-w-5xl mx-auto px-2 sm:px-4 py-3 sm:py-4 flex justify-between items-center">
            <div className="flex items-center gap-3 sm:gap-6 relative">
                <div className="flex flex-col sm:flex-row sm:items-baseline">
                    <h1 className="text-lg md:text-2xl font-black text-blue-600 uppercase tracking-tighter whitespace-nowrap">Toán lớp 1</h1>
                    <span className="sm:ml-2 text-[8px] md:text-xs font-black text-gray-500 normal-case italic">Quang Minh 1A8</span>
                </div>
                {showResult && (
                  <div className="animate-bounce-short">
                    <div className="w-14 h-14 sm:w-24 sm:h-24 bg-white border-2 sm:border-4 border-blue-600 rounded-full shadow-xl flex flex-col items-center justify-center">
                      <span className="text-[8px] sm:text-[10px] font-black text-gray-400 uppercase leading-none">Điểm</span>
                      <span className="text-sm sm:text-2xl font-black text-red-600">{displayScore}</span>
                    </div>
                  </div>
                )}
            </div>
            <div className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full border border-blue-100">Lớp 1 - Học kỳ 1</div>
        </div>
        <div className="scroll-container-mask border-t border-gray-50 bg-white">
            <div ref={scrollRef} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUpOrLeave} onMouseLeave={handleMouseUpOrLeave} className="overflow-x-auto no-scrollbar cursor-grab active:cursor-grabbing px-2 sm:px-10">
                <div className="max-w-5xl mx-auto flex space-x-1.5 py-2.5 min-w-max items-center">
                    {TABS.map(tab => (
                        <button key={tab.id} onClick={() => handleTabChange(tab.id)} className={`flex items-center gap-1.5 px-3 py-2 rounded-xl sm:rounded-2xl font-bold text-[11px] sm:text-sm transition-all duration-200 ${activeTab === tab.id ? `${tab.color} text-white shadow-lg shadow-${tab.color.split('-')[1]}-200 transform scale-105` : 'bg-gray-50 text-gray-500 hover:bg-gray-100 border border-transparent'}`}>
                            <span className="scale-75 sm:scale-90">{tab.icon}</span> {tab.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
      </header>
      <main className="flex-1 w-full max-w-5xl mx-auto px-1 sm:px-4 py-4 sm:py-10">{renderContent()}</main>
    </div>
  );
};
export default App;
