
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

// --- SINH ĐỀ MÊ CUNG TOÁN HỌC (PHỨC TẠP HƠN - 6 BƯỚC) ---
export const generateMazeProblems = (count: number): MathProblem[] => {
  const problems: MathProblem[] = [];
  for (let p = 0; p < count; p++) {
    const grid: Record<string, any> = {};
    const answers: Record<string, number> = {};
    let currR = 0;
    let currC = 0;
    const numEqs = 6; // Tăng lên 6 bước để phức tạp hơn
    let lastValue = getRandomInt(2, 5);
    grid[`${currR},${currC}`] = { type: 'number', value: lastValue, isStatic: true };

    for (let i = 0; i < numEqs; i++) {
      const isHorizontal = i % 2 === 0;
      const op = Math.random() > 0.5 ? '+' : '-';
      let n2: number;
      let res: number;
      if (op === '+') {
        n2 = getRandomInt(1, 10 - lastValue);
        res = lastValue + n2;
      } else {
        n2 = getRandomInt(1, lastValue);
        res = lastValue - n2;
      }

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
    problems.push({
      id: generateId(),
      type: 'maze',
      question: "Bé hãy tính theo mũi tên để điền số còn thiếu (0-10) qua 6 bước nhé!",
      visualData: { grid },
      answer: answers,
      userAnswer: JSON.stringify({})
    });
  }
  return problems;
};

// --- SINH ĐỀ SO SÁNH (CẢ 2 VẾ ĐỀU LÀ PHÉP TÍNH, CÓ CỘNG VÀ TRỪ) ---
export const generateComparisonProblems = (count: number): MathProblem[] => {
  const problems: MathProblem[] = [];
  for (let i = 0; i < count; i++) {
    const op1 = Math.random() > 0.5 ? '+' : '-';
    const op2 = Math.random() > 0.5 ? '+' : '-';
    
    // Vế trái: A op1 B
    let n1, n2, leftRes;
    if (op1 === '+') {
      n1 = getRandomInt(1, 9);
      n2 = getRandomInt(0, 10 - n1);
      leftRes = n1 + n2;
    } else {
      n1 = getRandomInt(1, 10);
      n2 = getRandomInt(0, n1);
      leftRes = n1 - n2;
    }
    
    // Vế phải: C op2 D (Luôn là biểu thức như yêu cầu)
    let n3, n4, rightRes;
    if (op2 === '+') {
      n3 = getRandomInt(1, 9);
      n4 = getRandomInt(0, 10 - n3);
      rightRes = n3 + n4;
    } else {
      n3 = getRandomInt(1, 10);
      n4 = getRandomInt(0, n3);
      rightRes = n3 - n4;
    }

    problems.push({
      id: generateId(),
      type: 'comparison',
      numbers: [n1, n2, n3, n4],
      operators: [op1, op2],
      answer: leftRes > rightRes ? '>' : leftRes < rightRes ? '<' : '='
    });
  }
  return problems;
};

// --- SINH ĐỀ TÔ MÀU (PHẠM VI 10, ĐÚNG 15 Ô TỔ ONG, 5 MÀU) ---
export const generateColoringProblems = (count: number): MathProblem[] => {
  const problems: MathProblem[] = [];
  const palette = [
    { id: 'p1', color: '#f87171', target: 10, name: 'Đỏ' },
    { id: 'p2', color: '#60a5fa', target: 5, name: 'Xanh' },
    { id: 'p3', color: '#fbbf24', target: 8, name: 'Vàng' },
    { id: 'p4', color: '#4ade80', target: 7, name: 'Lá' },
    { id: 'p5', color: '#a78bfa', target: 4, name: 'Tím' }
  ];

  for (let i = 0; i < count; i++) {
    // 15 ô tổ ong được tính toán tọa độ để xếp khít
    const cells = [
      { id: 'c1', q: 0, r: 0, expression: "5 + 5", targetValue: 10, targetColor: 'p1' },
      { id: 'c2', q: 1, r: 0, expression: "7 - 2", targetValue: 5, targetColor: 'p2' },
      { id: 'c3', q: 0, r: 1, expression: "4 + 4", targetValue: 8, targetColor: 'p3' },
      { id: 'c4', q: -1, r: 1, expression: "10 - 3", targetValue: 7, targetColor: 'p4' },
      { id: 'c5', q: -1, r: 0, expression: "2 + 2", targetValue: 4, targetColor: 'p5' },
      { id: 'c6', q: 0, r: -1, expression: "8 + 2", targetValue: 10, targetColor: 'p1' },
      { id: 'c7', q: 1, r: -1, expression: "9 - 4", targetValue: 5, targetColor: 'p2' },
      { id: 'c8', q: 2, r: 0, expression: "4 + 4", targetValue: 8, targetColor: 'p3' },
      { id: 'c9', q: 2, r: -1, expression: "10 - 0", targetValue: 10, targetColor: 'p1' },
      { id: 'c10', q: 1, r: -2, expression: "3 + 4", targetValue: 7, targetColor: 'p4' },
      { id: 'c11', q: 0, r: -2, expression: "6 - 1", targetValue: 5, targetColor: 'p2' },
      { id: 'c12', q: -1, r: -1, expression: "1 + 3", targetValue: 4, targetColor: 'p5' },
      { id: 'c13', q: -2, r: 0, expression: "6 + 4", targetValue: 10, targetColor: 'p1' },
      { id: 'c14', q: -2, r: 1, expression: "9 - 1", targetValue: 8, targetColor: 'p3' },
      { id: 'c15', q: -2, r: 2, expression: "2 + 5", targetValue: 7, targetColor: 'p4' }
    ];
    problems.push({
      id: generateId(),
      type: 'coloring',
      visualData: { palette, cells },
      answer: null
    });
  }
  return problems;
};

// --- CÁC HÀM KHÁC GIỮ NGUYÊN (KHÔNG THAY ĐỔI) ---
export const generateDecodeProblems = (count: number): MathProblem[] => {
  const problems: MathProblem[] = [];
  const icons = ['pig', 'cat', 'chick', 'dog'];
  for (let i = 0; i < count; i++) {
    const i1 = icons[getRandomInt(0, 3)];
    const i2 = icons[getRandomInt(0, 3)];
    const legend: Record<string, number> = {};
    icons.forEach(icon => { legend[icon] = getRandomInt(1, 5); });
    const v1 = legend[i1];
    const op = Math.random() > 0.5 ? '+' : '-';
    let v2 = legend[i2];
    if (op === '+') { if (v1 + v2 > 10) v2 = 10 - v1; } else { if (v1 < v2) v2 = v1; }
    legend[i2] = v2;
    problems.push({ id: generateId(), type: 'decode', visualData: { icon1: i1, icon2: i2, legend }, operators: [op], answer: op === '+' ? v1 + v2 : v1 - v2 });
  }
  return problems;
};

export const generateMatchingGameData = (count: number) => {
  const birds: MathProblem[] = [];
  const houses = [];
  const targetCount = 6;
  for (let i = 0; i < targetCount; i++) {
    const sum = getRandomInt(3, 10);
    const n1 = getRandomInt(1, Math.floor(sum/2));
    const n2 = getRandomInt(1, sum - n1 - 1);
    const n3 = sum - n1 - n2;
    const id = generateId();
    birds.push({ id, type: 'expression', numbers: [n1, n2, n3], operators: ['+', '+'], answer: sum });
    houses.push({ id, value: sum });
  }
  return { birds, houses: shuffleArray(houses) };
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

export const generateExpressionProblems = (count: number): MathProblem[] => {
  const problems: MathProblem[] = [];
  for (let i = 0; i < count; i++) {
    const op1 = Math.random() > 0.5 ? '+' : '-';
    const op2 = Math.random() > 0.5 ? '+' : '-';
    let n1 = getRandomInt(3, 7);
    let n2 = op1 === '+' ? getRandomInt(0, 10 - n1) : getRandomInt(0, n1);
    let step1 = op1 === '+' ? n1 + n2 : n1 - n2;
    let n3 = op2 === '+' ? getRandomInt(0, 10 - step1) : getRandomInt(0, step1);
    let ans = op2 === '+' ? step1 + n3 : step1 - n3;
    problems.push({ id: generateId(), type: 'expression', numbers: [n1, n2, n3], operators: [op1, op2], answer: ans });
  }
  return problems;
};

export const generateFillBlankProblems = (count: number): MathProblem[] => {
  const problems: MathProblem[] = [];
  for (let i = 0; i < count; i++) {
    const op = Math.random() > 0.5 ? '+' : '-';
    let n1, n2, res;
    if (op === '+') { n1 = getRandomInt(1, 9); n2 = getRandomInt(0, 10 - n1); res = n1 + n2; }
    else { n1 = getRandomInt(1, 10); n2 = getRandomInt(0, n1); res = n1 - n2; }
    const hideIdx = getRandomInt(0, 2);
    problems.push({ id: generateId(), type: 'fill_blank', numbers: [n1, n2], visualData: res, answer: hideIdx === 0 ? n1 : hideIdx === 1 ? n2 : res, operators: [op], options: [hideIdx] });
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
      const w1 = getRandomInt(1, 4); const w2 = getRandomInt(1, 10 - w1);
      problems.push({ id: generateId(), type: 'measurement', visualType: 'balance', visualData: [w1, w2], answer: w1 + w2, unit: 'kg' });
    } else if (vType === 'spring') {
      problems.push({ id: generateId(), type: 'measurement', visualType: 'spring', visualData: getRandomInt(1, 10), answer: getRandomInt(1, 10), unit: 'kg' });
    } else if (vType === 'beaker') {
      problems.push({ id: generateId(), type: 'measurement', visualType: 'beaker', visualData: getRandomInt(1, 10), answer: getRandomInt(1, 10), unit: 'l' });
    } else {
      const n1 = getRandomInt(1, 8); const n2 = getRandomInt(1, 10 - n1);
      problems.push({ id: generateId(), type: 'measurement', visualType: 'calc', numbers: [n1, n2], operators: ['+'], answer: n1 + n2, unit: 'cm' });
    }
  }
  return problems;
};

export const generateGeometryProblems = (count: number): MathProblem[] => {
  const problems: MathProblem[] = [];
  for (let i = 0; i < count; i++) {
    if (i % 2 === 0) {
      const l1 = getRandomInt(2, 3); const l2 = getRandomInt(2, 3); const l3 = getRandomInt(2, 4);
      problems.push({ id: generateId(), type: 'geometry', visualType: 'path_length', question: "Tính độ dài đường gấp khúc (trong phạm vi 10) nhé!", visualData: [{ length: l1 }, { length: l2 }, { length: l3 }], answer: l1 + l2 + l3 });
    } else {
      problems.push({ id: generateId(), type: 'geometry', visualType: 'identify_shape', question: "Bé hãy chọn tất cả các hình Tam Giác nhé!", visualData: { targetId: 'tri', shapes: [{ id: '1', type: 'tri', d: "M 50 10 L 90 90 L 10 90 Z", color: "#FFD700" }, { id: '2', type: 'rect', d: "M 10 10 H 90 V 90 H 10 Z", color: "#4B0082" }, { id: '3', type: 'tri', d: "M 10 10 L 90 50 L 10 90 Z", color: "#00FF7F" }, { id: '4', type: 'circle', d: "M 50 10 A 40 40 0 1 1 50 90 A 40 40 0 1 1 50 10", color: "#FF4500" }] }, answer: 2 });
    }
  }
  return problems;
};

export const generatePatternProblems = (count: number): MathProblem[] => {
  const problems: MathProblem[] = [];
  const shapes = [{ id: 's1', d: "M 50 10 L 90 90 L 10 90 Z", color: "#fbbf24" }, { id: 's2', d: "M 20 20 H 80 V 80 H 20 Z", color: "#60a5fa" }, { id: 's3', d: "M 50 10 A 40 40 0 1 1 50 90 A 40 40 0 1 1 50 10", color: "#f87171" }];
  for (let i = 0; i < count; i++) {
    problems.push({ id: generateId(), type: 'pattern', question: "Tìm hình còn thiếu theo quy luật nhé!", visualData: { grid: [[shapes[0], shapes[1], shapes[2]], [shapes[1], shapes[2], shapes[0]], [shapes[2], shapes[0], shapes[1]]], hiddenCells: [{ r: 2, c: 2, target: 's1' }], options: shapes }, answer: 's1' });
  }
  return problems;
};

export const generateMultipleChoiceProblems = (count: number): MathProblem[] => {
  const problems: MathProblem[] = [];
  for (let i = 0; i < count; i++) {
    const n1 = getRandomInt(1, 9); const n2 = getRandomInt(0, 10 - n1); const ans = n1 + n2;
    problems.push({ id: generateId(), type: 'multiple_choice', question: `Kết quả của ${n1} + ${n2} là bao nhiêu?`, options: shuffleArray([ans, (ans + 1) % 11, (ans + 2) % 11, Math.abs(ans - 1)]), answer: String(ans) });
  }
  return problems;
};

export const generateChallengeProblem = (): MathProblem => ({ id: generateId(), type: 'challenge', question: "Hình nào ghép từ các mảnh bên trái?", visualData: { sourceShapes: [{ id: '1', d: "M 10 10 H 40 V 40 H 10 Z", color: "#fbbf24" }], options: [{ id: 'a', label: 'A', d: "M 10 10 H 40 V 40 H 10 Z", color: "#fbbf24", name: "Hình vuông" }, { id: 'b', label: 'B', d: "M 50 10 L 90 90 L 10 90 Z", color: "#60a5fa", name: "Tam giác" }, { id: 'c', label: 'C', d: "M 50 10 A 40 40 0 1 1 50 90 A 40 40 0 1 1 50 10", color: "#f87171", name: "Hình tròn" }] }, answer: 'a' });

export const generatePuzzleProblem = (): MathProblem => ({ id: generateId(), type: 'puzzle', visualData: { templateName: "Ngôi Nhà", allShapes: { 'SQR': { d: "M 0 0 H 100 V 100 H 0 Z", color: "#fcd34d" }, 'TRI': { d: "M 0 100 L 100 100 L 50 0 Z", color: "#60a5fa" } }, sourceShapes: [{ instanceId: 'i1', id: 'SQR', d: "M 0 0 H 100 V 100 H 0 Z", color: "#fcd34d" }, { instanceId: 'i2', id: 'TRI', d: "M 0 100 L 100 100 L 50 0 Z", color: "#60a5fa" }], gridPieces: [{ id: 't1', type: 'SQR', x: 50, y: 70, scale: 0.4, targetRot: 0 }, { id: 't2', type: 'TRI', x: 50, y: 30, scale: 0.5, targetRot: 0 }] }, answer: [{ id: 't1', targetRot: 0 }, { id: 't2', targetRot: 0 }] });

export const generateMixedProblems = (count: number): MathProblem[] => {
  const problems: MathProblem[] = [];
  for (let i = 0; i < count; i++) {
    const r = Math.random();
    if (r < 0.3) problems.push(generateVerticalProblems(1)[0]);
    else if (r < 0.6) problems.push(generateExpressionProblems(1)[0]);
    else problems.push(generateFillBlankProblems(1)[0]);
  }
  return problems;
};
