
import { MathProblem } from '../types';

export const generateId = () => Math.random().toString(36).substr(2, 9);

const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const shuffleArray = <T>(array: T[]): T[] => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

// --- SINH BÀI TOÁN NGÔI NHÀ PHÉP TÍNH (PHẠM VI 10) ---
export const generateHouseProblems = (count: number): MathProblem[] => {
  const problems: MathProblem[] = [];
  for (let i = 0; i < count; i++) {
    let sum = getRandomInt(2, 10);
    let p1 = getRandomInt(0, sum);
    let p2 = sum - p1;

    problems.push({
      id: generateId(),
      type: 'house',
      question: "Viết các phép tính thích hợp",
      numbers: [sum, p1, p2],
      answer: { sum, p1, p2 }
    });
  }
  return problems;
};

// --- SINH ĐỀ CHO THẺ SỐ (CHỈ TRONG PHẠM VI 0-10) ---
export const generateChainProblem = (): MathProblem => {
  const nodesCount = getRandomInt(3, 4);
  const shape = Math.random() > 0.5 ? 'circle' : 'square';
  const nodes: any[] = [];
  const steps: any[] = [];
  const answers: Record<string, number> = {};
  
  let currentVal = getRandomInt(0, 10);
  nodes.push({ value: currentVal, isHidden: false, isStarting: true, shape });

  for (let i = 0; i < nodesCount - 1; i++) {
    const op = Math.random() > 0.5 ? '+' : '-';
    let stepVal, nextVal;

    if (op === '+') {
      stepVal = getRandomInt(0, 10 - currentVal);
      nextVal = currentVal + stepVal;
    } else {
      stepVal = getRandomInt(0, currentVal);
      nextVal = currentVal - stepVal;
    }

    steps.push({ op, val: stepVal });
    nodes.push({ value: nextVal, isHidden: true, shape });
    answers[String(i + 1)] = nextVal;
    currentVal = nextVal;
  }

  return { 
    id: generateId(), 
    type: 'fill_blank', 
    visualType: 'chain', 
    question: "Thực hiện phép tính theo sơ đồ nhé!", 
    visualData: { nodes, steps }, 
    answer: answers, 
    userAnswer: JSON.stringify({}) 
  };
};

export const generateFillBlankProblems = (count: number): MathProblem[] => {
  const problems: MathProblem[] = [];
  for (let i = 0; i < count; i++) {
    if (Math.random() < 0.4) {
      problems.push(generateChainProblem());
    } else {
      const op = Math.random() > 0.5 ? '+' : '-';
      let n1, n2, res;
      if (op === '+') {
        n1 = getRandomInt(0, 10);
        n2 = getRandomInt(0, 10 - n1);
        res = n1 + n2;
      } else {
        n1 = getRandomInt(0, 10);
        n2 = getRandomInt(0, n1);
        res = n1 - n2;
      }
      const hideIdx = getRandomInt(0, 2);
      problems.push({ 
        id: generateId(), 
        type: 'fill_blank', 
        numbers: [n1, n2], 
        visualData: res, 
        answer: hideIdx === 0 ? n1 : hideIdx === 1 ? n2 : res, 
        operators: [op], 
        options: [hideIdx] 
      });
    }
  }
  return problems;
};

export const generateExpressionProblems = (count: number): MathProblem[] => {
  const problems: MathProblem[] = [];
  for (let i = 0; i < count; i++) {
    const type = getRandomInt(1, 4);
    const op1 = Math.random() > 0.5 ? '+' : '-';
    const op2 = Math.random() > 0.5 ? '+' : '-';
    if (type <= 3) {
      let n1: number, n2: number, n3: number, d: number;
      let found = false;
      while (!found) {
        n1 = getRandomInt(0, 10); n2 = getRandomInt(0, 10); n3 = getRandomInt(0, 10);
        const step1 = op1 === '+' ? n1 + n2 : n1 - n2;
        if (step1 >= 0 && step1 <= 10) {
          d = op2 === '+' ? step1 + n3 : step1 - n3;
          if (d >= 0 && d <= 10) found = true;
        }
      }
      if (type === 1) problems.push({ id: generateId(), type: 'expression', visualType: 'calc', numbers: [n1!, n2!, n3!], operators: [op1, op2], answer: d! });
      else if (type === 2) problems.push({ id: generateId(), type: 'expression', visualType: 'missing_first', numbers: [n1!, n2!, n3!], operators: [op1, op2], answer: n1!, visualData: d! });
      else problems.push({ id: generateId(), type: 'expression', visualType: 'missing_last', numbers: [n1!, n2!, n3!], operators: [op1, op2], answer: n3!, visualData: d! });
    } else {
      let n1: number, n2: number, n3: number, n4: number, res: number;
      let found = false;
      while (!found) {
        n1 = getRandomInt(0, 10); n2 = getRandomInt(0, 10);
        res = op1 === '+' ? n1 + n2 : n1 - n2;
        if (res >= 0 && res <= 10) {
          n3 = getRandomInt(0, 10);
          if (op2 === '+') { n4 = res - n3; } else { n4 = n3 - res; }
          if (n4 >= 0 && n4 <= 10) found = true;
        }
      }
      problems.push({ id: generateId(), type: 'expression', visualType: 'equation', numbers: [n1!, n2!, n3!, n4!], operators: [op1, op2], answer: n4! });
    }
  }
  return problems;
};

export const generatePatternProblems = (count: number): MathProblem[] => {
  const problems: MathProblem[] = [];
  const SHAPES_LIB = {
    square: { id: 'sq', d: "M 20 20 H 80 V 80 H 20 Z", color: "#3b82f6", name: "Hình vuông" },
    circle: { id: 'cir', d: "M 50 10 A 40 40 0 1 1 50 90 A 40 40 0 1 1 50 10", color: "#f43f5e", name: "Hình tròn" },
    triangle: { id: 'tri', d: "M 50 15 L 90 85 L 10 85 Z", color: "#fbbf24", name: "Hình tam giác" }
  };
  const generateSequencePattern = (): MathProblem => {
    const unit = [SHAPES_LIB.square, SHAPES_LIB.circle, SHAPES_LIB.triangle, SHAPES_LIB.triangle];
    const fullSequence = [...unit, ...unit, ...unit];
    const hiddenIndex = getRandomInt(8, 10);
    const targetShapeId = fullSequence[hiddenIndex].id;
    return { id: generateId(), type: 'pattern', visualType: 'sequence', question: "Tìm hình thích hợp để đặt vào dấu '?'", visualData: { sequence: fullSequence, hiddenIndex, options: [SHAPES_LIB.square, SHAPES_LIB.circle, SHAPES_LIB.triangle] }, answer: targetShapeId };
  };
  for (let i = 0; i < count; i++) {
    if (Math.random() < 0.7) { problems.push(generateSequencePattern()); } 
    else {
      const shapes = [{ id: 's1', d: "M 50 10 L 90 90 L 10 90 Z", color: "#fbbf24" }, { id: 's2', d: "M 20 20 H 80 V 80 H 20 Z", color: "#3b82f6" }, { id: 's3', d: "M 50 10 A 40 40 0 1 1 50 90 A 40 40 0 1 1 50 10", color: "#f43f5e" }];
      problems.push({ id: generateId(), type: 'pattern', question: "Tìm hình còn thiếu theo quy luật nhé!", visualData: { grid: [[shapes[0], shapes[1], shapes[2]], [shapes[1], shapes[2], shapes[0]], [shapes[2], shapes[0], shapes[1]]], hiddenCells: [{ r: 2, c: 2, target: 's1' }], options: shapes }, answer: 's1' });
    }
  }
  return problems;
};

export const generateShortestPathProblem = (): MathProblem => {
  const startEmoji = "🐰"; const endEmoji = "🥕"; const cols = getRandomInt(4, 6); const rows = 3;
  const templates = [{ p1: [[0,0], [cols,0], [cols,rows]], p2: [[0,0], [0,1], [1,1], [1,2], [2,2], [2,1], [3,1], [3,2], [4,2], [4,rows], [cols,rows]] }, { p1: [[0,0], [0,rows], [cols,rows]], p2: [[0,0], [1,0], [1,1], [2,1], [2,2], [3,2], [3,1], [4,1], [4,0], [5,0], [5,rows], [cols,rows]] }, { p1: [[0,0], [cols,0], [cols,rows]], p2: [[0,0], [1,0], [1,2], [0,2], [0,3], [2,3], [2,1], [4,1], [4,3], [cols,rows]] }, { p1: [[0,0], [1,0], [1,1], [2,1], [2,2], [3,2], [3,3], [cols,rows]], p2: [[0,0], [0,1], [2,1], [2,0], [4,0], [4,1], [3,1], [3,2], [5,2], [cols,rows]] }];
  const selectedTemplate = templates[getRandomInt(0, templates.length - 1)]; const len1 = selectedTemplate.p1.length; const len2 = selectedTemplate.p2.length; const swap = Math.random() > 0.5; const finalP1 = swap ? selectedTemplate.p2 : selectedTemplate.p1; const finalP2 = swap ? selectedTemplate.p1 : selectedTemplate.p2; const finalLen1 = swap ? len2 : len1; const finalLen2 = swap ? len1 : len2; const correctAnswer = finalLen1 < finalLen2 ? "Đường số 1" : "Đường số 2";
  return { id: generateId(), type: 'multiple_choice', visualType: 'shortest_path', question: `Đường ngắn nhất để bạn Thỏ đến được chỗ củ cà rốt là:`, visualData: { paths: [finalP1, finalP2], startEmoji, endEmoji, gridSize: { cols, rows } }, options: ["Đường số 1", "Đường số 2"], answer: correctAnswer };
};

export const generateMultipleChoiceProblems = (count: number): MathProblem[] => {
  const problems: MathProblem[] = [];
  for (let i = 0; i < count; i++) {
    if (i % 2 === 0) problems.push(generateShortestPathProblem());
    else {
      const n1 = getRandomInt(1, 9); const n2 = getRandomInt(0, 10 - n1); const ans = n1 + n2;
      problems.push({ id: generateId(), type: 'multiple_choice', question: `Kết quả của ${n1} + ${n2} là bao nhiêu?`, options: shuffleArray([ans, (ans + 1) % 11, (ans + 2) % 11, Math.abs(ans - 1)]), answer: String(ans) });
    }
  }
  return problems;
};

export const generateConnectProblems = (count: number): MathProblem[] => {
  const problems: MathProblem[] = [];
  for (let p = 0; p < count; p++) {
    const pairs = []; const usedResults = new Set();
    while (pairs.length < 5) {
      const res = getRandomInt(4, 10);
      if (!usedResults.has(res)) {
        usedResults.add(res);
        const n1 = getRandomInt(0, res - 2); const n2 = getRandomInt(1, res - n1 - 1); const n3 = res - n1 - n2;
        pairs.push({ id: generateId(), expression: `${n1} + ${n2} + ${n3}`, result: res });
      }
    }
    problems.push({ id: generateId(), type: 'connect', question: "Bé hãy nối phép tính với kết quả đúng ở các quả trứng nhé!", visualData: { left: shuffleArray(pairs.map(p => ({ id: p.id, text: p.expression, val: p.result }))), right: shuffleArray(pairs.map(p => ({ id: p.id, text: p.result.toString(), val: p.result }))) }, answer: pairs.reduce((acc: any, curr) => { acc[curr.id] = curr.result; return acc; }, {}), userAnswer: JSON.stringify({}) });
  }
  return problems;
};

export const generateMazeProblems = (count: number): MathProblem[] => {
  const problems: MathProblem[] = [];
  for (let p = 0; p < count; p++) {
    const grid: Record<string, any> = {}; 
    const segments: any[] = []; 
    let currR = 0, currC = 0, lastValue = getRandomInt(2, 5);
    grid[`${currR},${currC}`] = { type: 'number', value: lastValue, isStatic: true };
    
    for (let i = 0; i < 4; i++) {
      const isHorizontal = i % 2 === 0;
      let op = Math.random() > 0.5 ? '+' : '-';
      
      if (lastValue >= 10) op = '-';
      if (lastValue <= 0) op = '+';

      let n2, res;
      if (op === '+') {
        n2 = getRandomInt(1, Math.max(1, 10 - lastValue));
        res = lastValue + n2;
      } else {
        n2 = getRandomInt(1, Math.max(1, lastValue));
        res = lastValue - n2;
      }

      const segment = {
        start: `${currR},${currC}`,
        op: op,
        middle: "",
        end: ""
      };

      if (isHorizontal) {
        grid[`${currR},${currC + 1}`] = { type: 'op', value: op };
        const hideN2 = Math.random() > 0.5;
        grid[`${currR},${currC + 2}`] = { type: 'number', value: n2, isStatic: !hideN2 };
        segment.middle = `${currR},${currC + 2}`;
        grid[`${currR},${currC + 3}`] = { type: 'op', value: '=' };
        const hideRes = !hideN2 || Math.random() > 0.5;
        grid[`${currR},${currC + 4}`] = { type: 'number', value: res, isStatic: !hideRes };
        segment.end = `${currR},${currC + 4}`;
        currC += 4;
      } else {
        grid[`${currR + 1},${currC}`] = { type: 'op', value: op };
        const hideN2 = Math.random() > 0.5;
        grid[`${currR + 2},${currC}`] = { type: 'number', value: n2, isStatic: !hideN2 };
        segment.middle = `${currR + 2},${currC}`;
        grid[`${currR + 3},${currC}`] = { type: 'op', value: '=' };
        const hideRes = !hideN2 || Math.random() > 0.5;
        grid[`${currR + 4},${currC}`] = { type: 'number', value: res, isStatic: !hideRes };
        segment.end = `${currR + 4},${currC}`;
        currR += 4;
      }
      segments.push(segment);
      lastValue = res;
    }
    problems.push({ 
      id: generateId(), 
      type: 'maze', 
      question: "Bé hãy tính theo mũi tên để điền số còn thiếu (0-10) qua 4 bước nhé!", 
      visualData: { grid, segments }, 
      answer: null, 
      userAnswer: JSON.stringify({}) 
    });
  }
  return problems;
};

export const generateComparisonProblems = (count: number): MathProblem[] => {
  const problems: MathProblem[] = [];
  for (let i = 0; i < count; i++) {
    const isMissingNumber = Math.random() > 0.5, op1 = Math.random() > 0.5 ? '+' : '-', op2 = Math.random() > 0.5 ? '+' : '-';
    let n1, n2, leftRes, n3, n4, rightRes;
    if (op1 === '+') { n1 = getRandomInt(1, 9); n2 = getRandomInt(0, 10 - n1); leftRes = n1 + n2; }
    else { n1 = getRandomInt(1, 10); n2 = getRandomInt(0, n1); leftRes = n1 - n2; }
    if (op2 === '+') { n3 = getRandomInt(1, 9); n4 = getRandomInt(0, 10 - n3); rightRes = n3 + n4; }
    else { n3 = getRandomInt(1, 10); n4 = getRandomInt(0, n3); rightRes = n3 - n4; }
    const sign = leftRes > rightRes ? '>' : leftRes < rightRes ? '<' : '=';
    if (isMissingNumber) {
      const hideIdx = getRandomInt(0, 3), originalNums = [n1, n2, n3, n4], targetVal = originalNums[hideIdx];
      problems.push({ id: generateId(), type: 'comparison', visualType: 'missing_number', numbers: originalNums, operators: [op1, op2], visualData: { sign, hideIdx }, answer: targetVal, question: "Bé hãy điền số thích hợp vào chỗ trống nhé!" });
    } else {
      problems.push({ id: generateId(), type: 'comparison', numbers: [n1, n2, n3, n4], operators: [op1, op2], answer: sign });
    }
  }
  return problems;
};

export const generateColoringProblems = (count: number): MathProblem[] => {
  const problems: MathProblem[] = [];
  const palette = [{ id: 'p1', color: '#f87171', target: 10, name: 'Đỏ' }, { id: 'p2', color: '#60a5fa', target: 5, name: 'Xanh' }, { id: 'p3', color: '#fbbf24', target: 8, name: 'Vàng' }, { id: 'p4', color: '#4ade80', target: 7, name: 'Lá' }, { id: 'p5', color: '#a78bfa', target: 4, name: 'Tím' }];
  for (let i = 0; i < count; i++) {
    const cells = [{ id: 'c1', q: 0, r: 0, expression: "5 + 5", targetValue: 10, targetColor: 'p1' }, { id: 'c2', q: 1, r: 0, expression: "7 - 2", targetValue: 5, targetColor: 'p2' }, { id: 'c3', q: 0, r: 1, expression: "4 + 4", targetValue: 8, targetColor: 'p3' }, { id: 'c4', q: -1, r: 1, expression: "10 - 3", targetValue: 7, targetColor: 'p4' }, { id: 'c5', q: -1, r: 0, expression: "2 + 2", targetValue: 4, targetColor: 'p5' }, { id: 'c6', q: 0, r: -1, expression: "8 + 2", targetValue: 10, targetColor: 'p1' }, { id: 'c7', q: 1, r: -1, expression: "9 - 4", targetValue: 5, targetColor: 'p2' }, { id: 'c8', q: 2, r: 0, expression: "4 + 4", targetValue: 8, targetColor: 'p3' }, { id: 'c9', q: 2, r: -1, expression: "10 - 0", targetValue: 10, targetColor: 'p1' }, { id: 'c10', q: 1, r: -2, expression: "3 + 4", targetValue: 7, targetColor: 'p4' }, { id: 'c11', q: 0, r: -2, expression: "6 - 1", targetValue: 5, targetColor: 'p2' }, { id: 'c12', q: -1, r: -1, expression: "1 + 3", targetValue: 4, targetColor: 'p5' }, { id: 'c13', q: -2, r: 0, expression: "6 + 4", targetValue: 10, targetColor: 'p1' }, { id: 'c14', q: -2, r: 1, expression: "9 - 1", targetValue: 8, targetColor: 'p3' }, { id: 'c15', q: -2, r: 2, expression: "2 + 5", targetValue: 7, targetColor: 'p4' }];
    problems.push({ id: generateId(), type: 'coloring', visualData: { palette, cells }, answer: null });
  }
  return problems;
};

export const generateDecodeProblems = (count: number): MathProblem[] => {
  const problems: MathProblem[] = [];
  const icons = ['pig', 'cat', 'chick', 'dog'];
  for (let i = 0; i < count; i++) {
    const i1 = icons[getRandomInt(0, 3)], i2 = icons[getRandomInt(0, 3)], legend: Record<string, number> = {};
    icons.forEach(icon => { legend[icon] = getRandomInt(1, 5); });
    const v1 = legend[i1], op = Math.random() > 0.5 ? '+' : '-';
    let v2 = legend[i2];
    if (op === '+') { if (v1 + v2 > 10) v2 = 10 - v1; } else { if (v1 < v2) v2 = v1; }
    legend[i2] = v2;
    problems.push({ id: generateId(), type: 'decode', visualData: { icon1: i1, icon2: i2, legend }, operators: [op], answer: op === '+' ? v1 + v2 : v1 - v2 });
  }
  return problems;
};

export const generateVerticalProblems = (count: number): MathProblem[] => {
  const problems: MathProblem[] = [];
  for (let i = 0; i < count; i++) {
    const op = Math.random() > 0.5 ? '+' : '-';
    let n1, n2, ans;
    if (op === '+') { n1 = getRandomInt(1, 9); n2 = getRandomInt(0, 10 - n1); ans = n1 + n2; }
    else { n1 = getRandomInt(1, 10); n2 = getRandomInt(0, n1); ans = n1 - n2; }
    problems.push({ id: generateId(), type: 'vertical', numbers: [n1, n2], operators: [op], answer: ans });
  }
  return problems;
};

export const generateFind10Problems = (count: number): MathProblem[] => {
  const problems: MathProblem[] = [];
  for (let i = 0; i < count; i++) {
    const isTen = Math.random() > 0.5;
    let n1, n2;
    if (isTen) { n1 = getRandomInt(1, 9); n2 = 10 - n1; }
    else { n1 = getRandomInt(1, 8); n2 = getRandomInt(1, 8); if (n1 + n2 === 10) n2 = (n2 + 1) % 9 || 1; }
    problems.push({ id: generateId(), type: 'find10', numbers: [n1, n2], answer: 10, isCorrect: isTen });
  }
  return problems;
};

export const generateGeometryProblems = (count: number): MathProblem[] => {
  const problems: MathProblem[] = [];
  
  const SHAPE_DEFS = [
    { type: 'tri', name: 'hình Tam Giác', d: "M 50 10 L 90 90 L 10 90 Z" },
    { type: 'sq', name: 'hình Vuông', d: "M 15 15 H 85 V 85 H 15 Z" },
    { type: 'cir', name: 'hình Tròn', d: "M 50 10 A 40 40 0 1 1 50 90 A 40 40 0 1 1 50 10" },
    { type: 'rect', name: 'hình Chữ Nhật', d: "M 10 30 H 90 V 70 H 10 Z" }
  ];

  const COLORS = ["#FFD700", "#4B0082", "#00FF7F", "#FF4500", "#1E90FF", "#FF69B4", "#8B4513"];

  for (let i = 0; i < count; i++) {
    if (i % 2 === 0) {
      const l1 = getRandomInt(1, 4), l2 = getRandomInt(1, 3), l3 = getRandomInt(1, 3);
      problems.push({ 
        id: generateId(), 
        type: 'geometry', 
        visualType: 'path_length', 
        question: "Tính độ dài đường gấp khúc (trong phạm vi 10) nhé!", 
        visualData: [{ length: l1 }, { length: l2 }, { length: l3 }], 
        answer: l1 + l2 + l3 
      });
    } else {
      const target = SHAPE_DEFS[getRandomInt(0, SHAPE_DEFS.length - 1)];
      const displayShapes = [];
      
      for (let j = 0; j < 8; j++) {
        let chosen;
        if (j < 3) {
           chosen = Math.random() > 0.5 ? target : SHAPE_DEFS[getRandomInt(0, SHAPE_DEFS.length - 1)];
        } else {
           chosen = SHAPE_DEFS[getRandomInt(0, SHAPE_DEFS.length - 1)];
        }
        
        displayShapes.push({
          id: generateId(),
          type: chosen.type,
          d: chosen.d,
          color: COLORS[getRandomInt(0, COLORS.length - 1)]
        });
      }

      problems.push({ 
        id: generateId(), 
        type: 'geometry', 
        visualType: 'identify_shape', 
        question: `Bé hãy chọn tất cả các ${target.name} nhé!`, 
        visualData: { 
          targetId: target.type, 
          shapes: shuffleArray(displayShapes) 
        }, 
        answer: displayShapes.filter(s => s.type === target.type).length 
      });
    }
  }
  return problems;
};

// --- SINH BÀI TOÁN XẾP HÌNH (PUZZLE) ---
export const generatePuzzleProblem = (): MathProblem => {
  const shapes = {
    TRIANGLE: { d: "M 50 15 L 90 85 L 10 85 Z" },
    SQUARE: { d: "M 20 20 H 80 V 80 H 20 Z" },
    CIRCLE: { d: "M 50 10 A 40 40 0 1 1 50 90 A 40 40 0 1 1 50 10" },
    RECT: { d: "M 10 30 H 90 V 70 H 10 Z" }
  };

  const templates = [
    {
      name: "Tên Lửa",
      pieces: [
        { id: 'p1', x: 50, y: 30, scale: 0.6, type: 'TRIANGLE', targetRot: 0 },
        { id: 'p2', x: 50, y: 70, scale: 0.8, type: 'SQUARE', targetRot: 0 },
      ],
      colors: ["#ef4444", "#3b82f6"]
    },
    {
      name: "Cây Thông",
      pieces: [
        { id: 'p1', x: 50, y: 30, scale: 0.5, type: 'TRIANGLE', targetRot: 0 },
        { id: 'p2', x: 50, y: 55, scale: 0.7, type: 'TRIANGLE', targetRot: 0 },
        { id: 'p3', x: 50, y: 85, scale: 0.3, type: 'RECT', targetRot: 90 },
      ],
      colors: ["#22c55e", "#16a34a", "#78350f"]
    }
  ];

  const template = templates[getRandomInt(0, templates.length - 1)];
  const sourceShapes = template.pieces.map((p, i) => ({
    instanceId: generateId(),
    id: p.type,
    d: (shapes as any)[p.type].d,
    color: template.colors[i % template.colors.length]
  }));

  return {
    id: generateId(),
    type: 'puzzle',
    visualData: {
      sourceShapes: shuffleArray(sourceShapes),
      gridPieces: template.pieces,
      templateName: template.name,
      allShapes: shapes
    },
    answer: template.pieces.map(p => ({ id: p.id, targetRot: p.targetRot }))
  };
};

export const generateMixedProblems = (count: number): MathProblem[] => {
  const atomicGenerators: (() => MathProblem)[] = [
    () => generateVerticalProblems(1)[0],
    () => {
      const op1 = Math.random() > 0.5 ? '+' : '-';
      const op2 = Math.random() > 0.5 ? '+' : '-';
      let n1: number, n2: number, n3: number, d: number;
      let found = false;
      while (!found) {
        n1 = getRandomInt(0, 10); n2 = getRandomInt(0, 10); n3 = getRandomInt(0, 10);
        const step1 = op1 === '+' ? n1 + n2 : n1 - n2;
        if (step1 >= 0 && step1 <= 10) {
          d = op2 === '+' ? step1 + n3 : step1 - n3;
          if (d >= 0 && d <= 10) found = true;
        }
      }
      return { id: generateId(), type: 'expression', visualType: 'calc', numbers: [n1!, n2!, n3!], operators: [op1, op2], answer: d! };
    },
    () => {
      const op1 = Math.random() > 0.5 ? '+' : '-';
      const op2 = Math.random() > 0.5 ? '+' : '-';
      let n1: number, n2: number, n3: number, d: number;
      let found = false;
      while (!found) {
        n1 = getRandomInt(0, 10); n2 = getRandomInt(0, 10); n3 = getRandomInt(0, 10);
        const step1 = op1 === '+' ? n1 + n2 : n1 - n2;
        if (step1 >= 0 && step1 <= 10) {
          d = op2 === '+' ? step1 + n3 : step1 - n3;
          if (d >= 0 && d <= 10) found = true;
        }
      }
      return { id: generateId(), type: 'expression', visualType: 'missing_first', numbers: [n1!, n2!, n3!], operators: [op1, op2], answer: n1!, visualData: d! };
    },
    () => generateChainProblem(),
    () => {
      const op = Math.random() > 0.5 ? '+' : '-';
      let n1, n2, res;
      if (op === '+') { n1 = getRandomInt(0, 10); n2 = getRandomInt(0, 10 - n1); res = n1 + n2; }
      else { n1 = getRandomInt(0, 10); n2 = getRandomInt(0, n1); res = n1 - n2; }
      const hideIdx = getRandomInt(0, 2);
      return { id: generateId(), type: 'fill_blank', numbers: [n1, n2], visualData: res, answer: hideIdx === 0 ? n1 : hideIdx === 1 ? n2 : res, operators: [op], options: [hideIdx] };
    },
    () => {
      const l1 = getRandomInt(1, 4), l2 = getRandomInt(1, 3), l3 = getRandomInt(1, 3);
      return { id: generateId(), type: 'geometry', visualType: 'path_length', question: "Tính độ dài đường gấp khúc (trong phạm vi 10) nhé!", visualData: [{ length: l1 }, { length: l2 }, { length: l3 }], answer: l1 + l2 + l3 };
    },
    () => {
      const SHAPE_DEFS = [
        { type: 'tri', name: 'hình Tam Giác', d: "M 50 10 L 90 90 L 10 90 Z" },
        { type: 'sq', name: 'hình Vuông', d: "M 15 15 H 85 V 85 H 15 Z" },
        { type: 'cir', name: 'hình Tròn', d: "M 50 10 A 40 40 0 1 1 50 90 A 40 40 0 1 1 50 10" },
        { type: 'rect', name: 'hình Chữ Nhật', d: "M 10 30 H 90 V 70 H 10 Z" }
      ];
      const target = SHAPE_DEFS[getRandomInt(0, SHAPE_DEFS.length - 1)];
      const displayShapes = Array.from({length: 8}, () => {
        const chosen = SHAPE_DEFS[getRandomInt(0, SHAPE_DEFS.length - 1)];
        return { id: generateId(), type: chosen.type as any, d: chosen.d, color: "#" + Math.floor(Math.random()*16777215).toString(16) };
      });
      return { id: generateId(), type: 'geometry', visualType: 'identify_shape', question: `Bé hãy chọn tất cả các ${target.name} nhé!`, visualData: { targetId: target.type, shapes: shuffleArray(displayShapes) }, answer: displayShapes.filter(s => s.type === target.type).length };
    },
    () => {
      const SHAPES_LIB = {
        square: { id: 'sq', d: "M 20 20 H 80 V 80 H 20 Z", color: "#3b82f6", name: "Hình vuông" },
        circle: { id: 'cir', d: "M 50 10 A 40 40 0 1 1 50 90 A 40 40 0 1 1 50 10", color: "#f43f5e", name: "Hình tròn" },
        triangle: { id: 'tri', d: "M 50 15 L 90 85 L 10 85 Z", color: "#fbbf24", name: "Hình tam giác" }
      };
      const unit = [SHAPES_LIB.square, SHAPES_LIB.circle, SHAPES_LIB.triangle, SHAPES_LIB.triangle];
      const fullSequence = [...unit, ...unit, ...unit];
      const hiddenIndex = getRandomInt(8, 10);
      const targetShapeId = fullSequence[hiddenIndex].id;
      return { id: generateId(), type: 'pattern', visualType: 'sequence', question: "Tìm hình thích hợp để đặt vào dấu '?'", visualData: { sequence: fullSequence, hiddenIndex, options: [SHAPES_LIB.square, SHAPES_LIB.circle, SHAPES_LIB.triangle] }, answer: targetShapeId };
    },
    () => {
      const op1 = Math.random() > 0.5 ? '+' : '-', op2 = Math.random() > 0.5 ? '+' : '-';
      let n1, n2, lRes, n3, n4, rRes;
      if (op1 === '+') { n1 = getRandomInt(1, 9); n2 = getRandomInt(0, 10 - n1); lRes = n1 + n2; } else { n1 = getRandomInt(1, 10); n2 = getRandomInt(0, n1); lRes = n1 - n2; }
      if (op2 === '+') { n3 = getRandomInt(1, 9); n4 = getRandomInt(0, 10 - n3); rRes = n3 + n4; } else { n3 = getRandomInt(1, 10); n4 = getRandomInt(0, n3); rRes = n3 - n4; }
      const sign = lRes > rRes ? '>' : lRes < rRes ? '<' : '=';
      return { id: generateId(), type: 'comparison', numbers: [n1, n2, n3, n4], operators: [op1, op2], answer: sign };
    },
    () => generateShortestPathProblem(),
    () => generateDecodeProblems(1)[0],
    () => generateHouseProblems(1)[0],
    () => generateMazeProblems(1)[0],
    () => generateConnectProblems(1)[0],
    () => generateChallengeProblem(),
    () => generatePuzzleProblem(),
    () => generateColoringProblems(1)[0]
  ];

  const shuffledGenerators = shuffleArray(atomicGenerators);

  const problems: MathProblem[] = [];
  for (let i = 0; i < count; i++) {
    const genIndex = i % shuffledGenerators.length;
    problems.push(shuffledGenerators[genIndex]());
  }

  return problems;
};

// --- SINH DỮ LIỆU CHO TRÒ CHƠI GHÉP CẶP (BIRD & HOUSE) ---
export const generateMatchingGameData = (count: number) => {
  const birds: MathProblem[] = [];
  const houses: { id: string; value: number }[] = [];
  const usedResults = new Set<number>();

  for (let i = 0; i < count; i++) {
    let n1: number, n2: number, n3: number, op1: string, op2: string, res: number;
    let found = false;
    let attempts = 0;
    
    while (!found && attempts < 100) {
      attempts++;
      res = getRandomInt(2, 10);
      if (usedResults.has(res)) continue;

      op1 = Math.random() > 0.5 ? '+' : '-';
      op2 = Math.random() > 0.5 ? '+' : '-';

      n1 = getRandomInt(0, 10);
      n2 = getRandomInt(0, 10);
      
      const step1 = op1 === '+' ? n1 + n2 : n1 - n2;
      
      if (step1 >= 0 && step1 <= 10) {
        if (op2 === '+') {
          n3 = res - step1;
        } else {
          n3 = step1 - res;
        }
        
        if (n3 >= 0 && n3 <= 10) {
          found = true;
          usedResults.add(res);
          const id = generateId();
          birds.push({
            id,
            type: 'connect',
            numbers: [n1, n2, n3],
            operators: [op1, op2],
            answer: res
          });
          houses.push({ id, value: res });
        }
      }
    }
  }

  return { 
    birds: shuffleArray(birds), 
    houses: shuffleArray(houses) 
  };
};

const CHALLENGE_SHAPES = {
    square: { d: "M 10 10 H 40 V 40 H 10 Z", color: "#fbbf24" },
    triangle: { d: "M 25 10 L 40 40 L 10 40 Z", color: "#60a5fa" },
    circle: { d: "M 25 10 A 15 15 0 1 1 25 40 A 15 15 0 1 1 25 10", color: "#f87171" },
    rect: { d: "M 10 20 H 50 V 40 H 10 Z", color: "#a78bfa" }
};

const CHALLENGE_TEMPLATES = [
    { name: "Ngôi Nhà", parts: [CHALLENGE_SHAPES.square, CHALLENGE_SHAPES.triangle], correctD: "M 20 50 H 80 V 100 H 20 Z M 15 50 L 85 50 L 50 10 Z", correctColor: "#fbbf24" },
    { name: "Cây Kem", parts: [CHALLENGE_SHAPES.circle, CHALLENGE_SHAPES.triangle], correctD: "M 50 20 A 25 25 0 1 1 50 70 A 25 25 0 1 1 50 20 M 25 45 L 75 45 L 50 95 Z", correctColor: "#f87171" },
    { name: "Kẹo Mút", parts: [CHALLENGE_SHAPES.circle, CHALLENGE_SHAPES.rect], correctD: "M 50 10 A 30 30 0 1 1 50 70 A 30 30 0 1 1 50 10 M 45 70 H 55 V 100 H 45 Z", correctColor: "#f472b6" },
    { name: "Tháp Hình", parts: [CHALLENGE_SHAPES.square, CHALLENGE_SHAPES.square], correctD: "M 30 10 H 70 V 50 H 30 Z M 30 55 H 70 V 95 H 30 Z", correctColor: "#34d399" },
    { name: "Ô Tô", parts: [CHALLENGE_SHAPES.rect, CHALLENGE_SHAPES.circle], correctD: "M 10 30 H 70 V 70 H 10 Z M 15 70 A 10 10 0 1 1 35 70 M 45 70 A 10 10 0 1 1 65 70", correctColor: "#3b82f6" },
    { name: "Mũ Sinh Nhật", parts: [CHALLENGE_SHAPES.triangle, CHALLENGE_SHAPES.circle], correctD: "M 20 80 L 80 80 L 50 20 Z M 50 10 A 8 8 0 1 1 50 26 A 8 8 0 1 1 50 10", correctColor: "#fbbf24" },
    { name: "Robot Con", parts: [CHALLENGE_SHAPES.square, CHALLENGE_SHAPES.rect], correctD: "M 35 10 H 65 V 40 H 35 Z M 20 45 H 80 V 85 H 20 Z", correctColor: "#94a3b8" },
    { name: "Tên Lửa", parts: [CHALLENGE_SHAPES.triangle, CHALLENGE_SHAPES.rect], correctD: "M 50 10 L 70 40 L 30 40 Z M 35 40 H 65 V 90 H 35 Z", correctColor: "#ef4444" },
    { name: "Thuyền", parts: [CHALLENGE_SHAPES.triangle, CHALLENGE_SHAPES.rect], correctD: "M 20 60 H 80 V 90 H 20 Z M 50 10 L 50 60 L 80 60 Z", correctColor: "#10b981" },
    { name: "Bông Hoa", parts: [CHALLENGE_SHAPES.circle, CHALLENGE_SHAPES.circle], correctD: "M 50 30 A 15 15 0 1 1 50 60 M 30 50 A 15 15 0 1 1 70 50 M 50 70 A 15 15 0 1 1 50 40", correctColor: "#fb923c" }
];

export const generateChallengeProblem = (): MathProblem => {
    const idx = getRandomInt(0, CHALLENGE_TEMPLATES.length - 1);
    const template = CHALLENGE_TEMPLATES[idx];
    const decoy1 = { id: 'w1', label: 'B', d: "M 20 20 H 80 V 80 H 20 Z", color: "#ddd", name: "Hình sai" };
    const decoy2 = { id: 'w2', label: 'C', d: "M 50 10 L 90 90 L 10 90 Z", color: "#eee", name: "Hình khác" };
    const correctOption = { id: 'a', label: 'A', d: template.correctD, color: template.correctColor, name: template.name };
    const allOptions = shuffleArray([correctOption, decoy1, decoy2]);
    allOptions.forEach((o, i) => o.label = String.fromCharCode(65 + i));

    return { 
        id: generateId(), 
        type: 'challenge', 
        question: "Hình nào ghép từ các mảnh bên trái?", 
        visualData: { 
            sourceShapes: template.parts.map((p, i) => ({ ...p, id: `s-${i}` })), 
            options: allOptions 
        }, 
        answer: allOptions.find(o => o.id === 'a')?.label 
    };
};
