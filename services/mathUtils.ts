
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

// --- SINH BÀI TOÁN NGÔI NHÀ PHÉP TÍNH (THEO HÌNH ẢNH) ---
export const generateHouseProblems = (count: number): MathProblem[] => {
  const problems: MathProblem[] = [];
  for (let i = 0; i < count; i++) {
    let sum, p1, p2;
    // Đảm bảo các số khác nhau và tổng không quá 10
    sum = getRandomInt(3, 10);
    p1 = getRandomInt(1, sum - 1);
    p2 = sum - p1;

    // Tránh trường hợp p1 = p2 để bài toán đa dạng hơn
    if (p1 === p2 && sum < 10) {
        sum++;
        p2 = sum - p1;
    }

    problems.push({
      id: generateId(),
      type: 'house',
      question: "Viết phép tính thích hợp (theo mẫu)",
      numbers: [sum, p1, p2], // sum ở nóc, p1 p2 ở dưới
      answer: { sum, p1, p2 }
    });
  }
  return problems;
};

// --- CÁC HÀM KHÁC GIỮ NGUYÊN TUYỆT ĐỐI ---
export const generateChainProblem = (): MathProblem => {
  const nodesCount = getRandomInt(3, 4);
  const shape = Math.random() > 0.5 ? 'circle' : 'square';
  const nodes: any[] = [];
  const steps: any[] = [];
  const answers: Record<string, number> = {};
  let currentVal = getRandomInt(2, 8);
  nodes.push({ value: currentVal, isHidden: false, isStarting: true, shape });
  for (let i = 0; i < nodesCount - 1; i++) {
    const op = Math.random() > 0.5 ? '+' : '-';
    let stepVal, nextVal;
    if (op === '+') { stepVal = getRandomInt(1, 10 - currentVal); nextVal = currentVal + stepVal; }
    else { stepVal = getRandomInt(1, currentVal); nextVal = currentVal - stepVal; }
    steps.push({ op, val: stepVal });
    const isHidden = true;
    nodes.push({ value: nextVal, isHidden, shape });
    if (isHidden) answers[String(i + 1)] = nextVal;
    currentVal = nextVal;
  }
  return { id: generateId(), type: 'fill_blank', visualType: 'chain', question: "Thực hiện phép tính theo sơ đồ nhé!", visualData: { nodes, steps }, answer: answers, userAnswer: JSON.stringify({}) };
};

export const generateFillBlankProblems = (count: number): MathProblem[] => {
  const problems: MathProblem[] = [];
  for (let i = 0; i < count; i++) {
    if (Math.random() < 0.4) problems.push(generateChainProblem());
    else {
      const op = Math.random() > 0.5 ? '+' : '-';
      let n1, n2, res;
      if (op === '+') { n1 = getRandomInt(1, 9); n2 = getRandomInt(0, 10 - n1); res = n1 + n2; }
      else { n1 = getRandomInt(1, 10); n2 = getRandomInt(0, n1); res = n1 - n2; }
      const hideIdx = getRandomInt(0, 2);
      problems.push({ id: generateId(), type: 'fill_blank', numbers: [n1, n2], visualData: res, answer: hideIdx === 0 ? n1 : hideIdx === 1 ? n2 : res, operators: [op], options: [hideIdx] });
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
    const grid: Record<string, any> = {}; const answers: Record<string, number> = {}; let currR = 0, currC = 0, lastValue = getRandomInt(2, 5);
    grid[`${currR},${currC}`] = { type: 'number', value: lastValue, isStatic: true };
    for (let i = 0; i < 6; i++) {
      const isHorizontal = i % 2 === 0, op = Math.random() > 0.5 ? '+' : '-';
      let n2, res;
      if (op === '+') { n2 = getRandomInt(1, 10 - lastValue); res = lastValue + n2; }
      else { n2 = getRandomInt(1, lastValue); res = lastValue - n2; }
      if (isHorizontal) {
        grid[`${currR},${currC + 1}`] = { type: 'op', value: op };
        const hideN2 = Math.random() > 0.5;
        grid[`${currR},${currC + 2}`] = { type: 'number', value: n2, isStatic: !hideN2 };
        if (hideN2) answers[`${currR},${currC + 2}`] = n2;
        grid[`${currR},${currC + 3}`] = { type: 'op', value: '=' };
        const hideRes = !hideN2 || Math.random() > 0.5;
        grid[`${currR},${currC + 4}`] = { type: 'number', value: res, isStatic: !hideRes };
        if (hideRes) answers[`${currR},${currC + 4}`] = res;
        currC += 4;
      } else {
        grid[`${currR + 1},${currC}`] = { type: 'op', value: op };
        const hideN2 = Math.random() > 0.5;
        grid[`${currR + 2},${currC}`] = { type: 'number', value: n2, isStatic: !hideN2 };
        if (hideN2) answers[`${currR + 2},${currC}`] = n2;
        grid[`${currR + 3},${currC}`] = { type: 'op', value: '=' };
        const hideRes = !hideN2 || Math.random() > 0.5;
        grid[`${currR + 4},${currC}`] = { type: 'number', value: res, isStatic: !hideRes };
        if (hideRes) answers[`${currR + 4},${currC}`] = res;
        currR += 4;
      }
      lastValue = res;
    }
    problems.push({ id: generateId(), type: 'maze', question: "Bé hãy tính theo mũi tên để điền số còn thiếu (0-10) qua 6 bước nhé!", visualData: { grid }, answer: answers, userAnswer: JSON.stringify({}) });
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

export const generateMeasurementProblems = (count: number): MathProblem[] => {
  const problems: MathProblem[] = [];
  const types: ('balance' | 'spring' | 'beaker' | 'calc')[] = ['balance', 'spring', 'beaker', 'calc'];
  for (let i = 0; i < count; i++) {
    const vType = types[i % types.length];
    if (vType === 'balance') {
      const w1 = getRandomInt(1, 4), w2 = getRandomInt(1, 10 - w1);
      problems.push({ id: generateId(), type: 'measurement', visualType: 'balance', visualData: [w1, w2], answer: w1 + w2, unit: 'kg' });
    } else if (vType === 'spring') {
      problems.push({ id: generateId(), type: 'measurement', visualType: 'spring', visualData: getRandomInt(1, 10), answer: getRandomInt(1, 10), unit: 'kg' });
    } else if (vType === 'beaker') {
      problems.push({ id: generateId(), type: 'measurement', visualType: 'beaker', visualData: getRandomInt(1, 10), answer: getRandomInt(1, 10), unit: 'l' });
    } else {
      const n1 = getRandomInt(1, 8), n2 = getRandomInt(1, 10 - n1);
      problems.push({ id: generateId(), type: 'measurement', visualType: 'calc', numbers: [n1, n2], operators: ['+'], answer: n1 + n2, unit: 'cm' });
    }
  }
  return problems;
};

export const generateGeometryProblems = (count: number): MathProblem[] => {
  const problems: MathProblem[] = [];
  for (let i = 0; i < count; i++) {
    if (i % 2 === 0) {
      const l1 = getRandomInt(2, 3), l2 = getRandomInt(2, 3), l3 = getRandomInt(2, 4);
      problems.push({ id: generateId(), type: 'geometry', visualType: 'path_length', question: "Tính độ dài đường gấp khúc (trong phạm vi 10) nhé!", visualData: [{ length: l1 }, { length: l2 }, { length: l3 }], answer: l1 + l2 + l3 });
    } else {
      problems.push({ id: generateId(), type: 'geometry', visualType: 'identify_shape', question: "Bé hãy chọn tất cả các hình Tam Giác nhé!", visualData: { targetId: 'tri', shapes: [{ id: '1', type: 'tri', d: "M 50 10 L 90 90 L 10 90 Z", color: "#FFD700" }, { id: '2', type: 'rect', d: "M 10 10 H 90 V 90 H 10 Z", color: "#4B0082" }, { id: '3', type: 'tri', d: "M 10 10 L 90 50 L 10 90 Z", color: "#00FF7F" }, { id: '4', type: 'circle', d: "M 50 10 A 40 40 0 1 1 50 90 A 40 40 0 1 1 50 10", color: "#FF4500" }] }, answer: 2 });
    }
  }
  return problems;
};

// CÁC HÌNH LIB CHO CHALLENGE
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
    
    // Tạo options sai
    const decoy1 = { id: 'w1', label: 'B', d: "M 20 20 H 80 V 80 H 20 Z", color: "#ddd", name: "Hình sai" };
    const decoy2 = { id: 'w2', label: 'C', d: "M 50 10 L 90 90 L 10 90 Z", color: "#eee", name: "Hình khác" };
    
    const correctOption = { id: 'a', label: 'A', d: template.correctD, color: template.correctColor, name: template.name };
    const allOptions = shuffleArray([correctOption, decoy1, decoy2]);
    
    // Gán lại label A, B, C cho options đã shuffle
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

const PUZZLE_TEMPLATES = [
    { name: "Ngôi Nhà", pieces: [{ id: 't1', type: 'SQR', x: 50, y: 70, scale: 0.4, targetRot: 0 }, { id: 't2', type: 'TRI', x: 50, y: 30, scale: 0.5, targetRot: 0 }] },
    { name: "Cây Thông", pieces: [{ id: 't1', type: 'RECT', x: 50, y: 80, scale: 0.3, targetRot: 0 }, { id: 't2', type: 'TRI', x: 50, y: 40, scale: 0.6, targetRot: 0 }] },
    { name: "Thuyền", pieces: [{ id: 't1', type: 'RECT', x: 50, y: 70, scale: 0.5, targetRot: 0 }, { id: 't2', type: 'TRI', x: 70, y: 40, scale: 0.4, targetRot: 0 }] },
    { name: "Xe Tải", pieces: [{ id: 't1', type: 'RECT', x: 40, y: 60, scale: 0.5, targetRot: 0 }, { id: 't2', type: 'CIR', x: 25, y: 85, scale: 0.2, targetRot: 0 }, { id: 't3', type: 'CIR', x: 55, y: 85, scale: 0.2, targetRot: 0 }] },
    { name: "Robot", pieces: [{ id: 't1', type: 'SQR', x: 50, y: 30, scale: 0.3, targetRot: 0 }, { id: 't2', type: 'RECT', x: 50, y: 70, scale: 0.5, targetRot: 0 }] },
    { name: "Kẹo", pieces: [{ id: 't1', type: 'CIR', x: 50, y: 40, scale: 0.5, targetRot: 0 }, { id: 't2', type: 'RECT', x: 50, y: 85, scale: 0.3, targetRot: 90 }] },
    { name: "Mũ", pieces: [{ id: 't1', type: 'TRI', x: 50, y: 60, scale: 0.6, targetRot: 0 }, { id: 't2', type: 'CIR', x: 50, y: 15, scale: 0.2, targetRot: 0 }] },
    { name: "Mũ", pieces: [{ id: 't1', type: 'TRI', x: 50, y: 40, scale: 0.5, targetRot: 180 }, { id: 't2', type: 'TRI', x: 50, y: 80, scale: 0.4, targetRot: 0 }] },
    { name: "Cửa Sổ", pieces: [{ id: 't1', type: 'SQR', x: 35, y: 35, scale: 0.3, targetRot: 0 }, { id: 't2', type: 'SQR', x: 65, y: 35, scale: 0.3, targetRot: 0 }, { id: 't3', type: 'SQR', x: 35, y: 65, scale: 0.3, targetRot: 0 }, { id: 't4', type: 'SQR', x: 65, y: 65, scale: 0.3, targetRot: 0 }] },
    { name: "Dấu Cộng", pieces: [{ id: 't1', type: 'RECT', x: 50, y: 50, scale: 0.6, targetRot: 0 }, { id: 't2', type: 'RECT', x: 50, y: 50, scale: 0.6, targetRot: 90 }] }
];

const SHAPES_DATA = { 
    'SQR': { d: "M 0 0 H 100 V 100 H 0 Z", color: "#fcd34d" }, 
    'TRI': { d: "M 0 100 L 100 100 L 50 0 Z", color: "#60a5fa" },
    'CIR': { d: "M 50 0 A 50 50 0 1 1 50 100 A 50 50 0 1 1 50 0", color: "#f87171" },
    'RECT': { d: "M 0 30 H 100 V 70 H 0 Z", color: "#34d399" }
};

export const generatePuzzleProblem = (): MathProblem => {
    const idx = getRandomInt(0, PUZZLE_TEMPLATES.length - 1);
    const template = PUZZLE_TEMPLATES[idx];
    
    const sourceShapes = template.pieces.map((p, i) => ({
        instanceId: `i-${i}`,
        id: p.type,
        ...SHAPES_DATA[p.type as keyof typeof SHAPES_DATA]
    }));

    return { 
        id: generateId(), 
        type: 'puzzle', 
        visualData: { 
            templateName: template.name, 
            allShapes: SHAPES_DATA, 
            sourceShapes: sourceShapes, 
            gridPieces: template.pieces 
        }, 
        answer: template.pieces.map(p => ({ id: p.id, targetRot: p.targetRot })) 
    };
};

// --- SINH DỮ LIỆU TRÒ CHƠI GHÉP CẶP (BIRD MATCHING) ---
export const generateMatchingGameData = (count: number) => {
  const birds: MathProblem[] = []; const houses: { id: string; value: number }[] = []; const usedResults = new Set<number>();
  for (let i = 0; i < count; i++) {
    let birdData: MathProblem | null = null; let houseData: { id: string; value: number } | null = null; let found = false;
    while (!found) {
      const n1 = getRandomInt(1, 8); const n2 = getRandomInt(1, 5); const op1 = Math.random() > 0.5 ? '+' : '-'; const step1 = op1 === '+' ? n1 + n2 : n1 - n2;
      if (step1 >= 0 && step1 <= 10) {
        const n3 = getRandomInt(1, 5); const op2 = Math.random() > 0.5 ? '+' : '-'; const res = op2 === '+' ? step1 + n3 : step1 - n3;
        if (res >= 0 && res <= 10 && !usedResults.has(res)) {
          usedResults.add(res); const id = generateId();
          birdData = { id, type: 'expression', numbers: [n1, n2, n3], operators: [op1, op2], answer: res };
          houseData = { id, value: res }; found = true;
        }
      }
    }
    if (birdData && houseData) { birds.push(birdData); houses.push(houseData); }
  }
  return { birds: shuffleArray(birds), houses: shuffleArray(houses) };
};

export const generateMixedProblems = (count: number): MathProblem[] => {
  const problems: MathProblem[] = [];
  // 1. Đặt tính (Vertical Add/Sub)
  problems.push(generateVerticalProblems(1)[0]);
  // 2. Biểu thức dãy tính chuẩn (Expression Calc)
  problems.push(generateExpressionProblems(20).find(p => p.visualType === 'calc')!);
  // 3. Biểu thức khuyết số đầu (Expression Missing First)
  problems.push(generateExpressionProblems(20).find(p => p.visualType === 'missing_first')!);
  // 4. Biểu thức so sánh/phương trình (Expression Equation)
  problems.push(generateExpressionProblems(20).find(p => p.visualType === 'equation')!);
  // 5. Thẻ số điền khuyết (FillBlank Missing A/B/Result)
  problems.push(generateFillBlankProblems(20).find(p => !p.visualType)!);
  // 6. Sơ đồ dây chuyền (Chain)
  problems.push(generateChainProblem());
  // 7. Đo lường - Cân đòn (Balance Scale)
  problems.push(generateMeasurementProblems(20).find(p => p.visualType === 'balance')!);
  // 8. Đo lường - Cân đồng hồ (Spring Scale)
  problems.push(generateMeasurementProblems(20).find(p => p.visualType === 'spring')!);
  // 9. Đo lường - Bình nước (Beaker)
  problems.push(generateMeasurementProblems(20).find(p => p.visualType === 'beaker')!);
  // 10. Đo lường - Phép tính đơn vị (Unit Calculation)
  problems.push(generateMeasurementProblems(20).find(p => p.visualType === 'calc')!);
  // 11. Hình học - Độ dài đường gấp khúc (Path Length)
  problems.push(generateGeometryProblems(20).find(p => p.visualType === 'path_length')!);
  // 12. Hình học - Nhận dạng hình (Identify Shape)
  problems.push(generateGeometryProblems(20).find(p => p.visualType === 'identify_shape')!);
  // 13. Quy luật - Chuỗi hình (Sequence Pattern)
  problems.push(generatePatternProblems(20).find(p => p.visualType === 'sequence')!);
  // 14. Quy luật - Ô lưới (Grid Pattern)
  problems.push(generatePatternProblems(20).find(p => p.visualData.grid)!);
  // 15. So sánh - Tìm dấu > < = (Comparison Sign)
  problems.push(generateComparisonProblems(20).find(p => !p.visualType)!);
  // 16. So sánh - Điền số khuyết (Comparison Missing Num)
  problems.push(generateComparisonProblems(20).find(p => p.visualType === 'missing_number')!);
  // 17. Trắc nghiệm - Kết quả phép tính (MCQ Result)
  problems.push(generateMultipleChoiceProblems(20).find(p => !p.visualType)!);
  // 18. Trắc nghiệm - Đường đi ngắn nhất (Shortest Path)
  problems.push(generateShortestPathProblem());
  // 19. Giải mã con vật (Decode)
  problems.push(generateDecodeProblems(1)[0]);
  // 20. Ngôi nhà phép tính (House Math)
  problems.push(generateHouseProblems(1)[0]);
  
  return problems;
};
