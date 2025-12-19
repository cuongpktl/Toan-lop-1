
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

// --- 1. TOÁN CÓ LỜI VĂN & HÌNH ẢNH (Dựa trên hình 1, 2, 3) ---
const SYNC_WORD_PROBLEMS = [
  { question: "Có 3 con vịt trong vòng tròn, 3 con vịt bên ngoài. Tất cả có: ... con vịt?", answer: 6 },
  { question: "Mẫu: Có 1 con mèo và 6 con chó. Tổng cộng: 1 + 6 = ...?", answer: 7 },
  { question: "Trong khay có 10 quả trứng, đã dùng hết 2 quả. Còn lại: ... quả?", answer: 8 },
  { question: "Bé có 8 quả táo, bé ăn 3 quả. Còn lại: ... quả táo?", answer: 5 },
  { question: "Có 4 con chim, thêm 5 con chim nữa. Tất cả có: ... con chim?", answer: 9 },
  { question: "Đường số 1 ngắn, đường số 2 dài. Bạn Thỏ nên đi đường số mấy để nhanh nhất?", answer: 1 },
  { question: "Nhà có 7 quả cam, ăn mất 3 quả. Viết phép tính: 7 - 3 = ...?", answer: 4 },
  { question: "Trong tổ có 5 con ong, 4 con bay về thêm. Có tất cả: ... con ong?", answer: 9 },
  { question: "Có 9 cái kẹo, chia cho em 4 cái. Còn lại: ... cái kẹo?", answer: 5 },
  { question: "Có 6 quả bóng, thêm 2 quả nữa. Có tất cả: ... quả bóng?", answer: 8 }
];

export const generateLocalWordProblemSync = (): MathProblem => {
  const p = SYNC_WORD_PROBLEMS[getRandomInt(0, SYNC_WORD_PROBLEMS.length - 1)];
  return {
    id: generateId(),
    type: 'word',
    question: p.question,
    answer: p.answer,
    userAnswer: ''
  };
};

// --- 2. ĐẶT TÍNH & ĐIỀN DẤU (Dựa trên câu 4 hình 1 & câu 1 hình 2) ---
export const generateVerticalProblems = (count: number): MathProblem[] => {
  const problems: MathProblem[] = [];
  for (let i = 0; i < count; i++) {
    const mode = getRandomInt(0, 2); 
    if (mode === 0) {
        // Phép tính cơ bản
        const op = Math.random() > 0.5 ? '+' : '-';
        let a, b, ans;
        if (op === '+') { a = getRandomInt(0, 10); b = getRandomInt(0, 10 - a); ans = a + b; }
        else { a = getRandomInt(0, 10); b = getRandomInt(0, a); ans = a - b; }
        problems.push({ id: generateId(), type: 'vertical', numbers: [a, b], operators: [op], answer: ans });
    } else if (mode === 1) {
        // Điền dấu + hoặc - (Câu 4 hình 1)
        const a = getRandomInt(1, 9);
        const b = getRandomInt(1, 9);
        const isPlus = Math.random() > 0.5;
        const res = isPlus ? (a + b > 10 ? a - b : a + b) : (a - b < 0 ? a + b : a - b);
        const finalOp = (res === a + b) ? '+' : '-';
        problems.push({ 
          id: generateId(), type: 'fill_blank', visualType: 'calc', 
          question: "Điền dấu + hoặc - thích hợp:",
          numbers: [a, b], operators: ['?'], answer: finalOp, options: [3], visualData: res
        });
    } else {
        // Sơ đồ tính liên tiếp (Câu 4 hình 2)
        const n1 = getRandomInt(1, 5);
        const n2 = getRandomInt(1, 3);
        const n3 = getRandomInt(1, 2);
        const res = n1 + n2 - n3;
        problems.push({ 
            id: generateId(), type: 'expression', 
            numbers: [n1, n2, n3], operators: ['+', '-'], answer: res 
        });
    }
  }
  return problems;
};

// --- 3. QUY LUẬT DÃY SỐ (Câu 1 & 5 hình 1 & hình 2) ---
export const generatePatternProblems = (count: number): MathProblem[] => {
  const problems: MathProblem[] = [];
  for (let p = 0; p < count; p++) {
    const type = getRandomInt(0, 2);
    if (type === 0) {
      // Dãy số chẵn: 2, 4, 6, 8, 10
      const sequence = [2, 4, 6, 8, 10];
      const hideIdx = getRandomInt(1, 3);
      problems.push({ 
        id: generateId(), type: 'word', 
        question: `Điền số vào dãy: ${sequence.map((n, i) => i === hideIdx ? '...' : n).join(', ')}`, 
        answer: sequence[hideIdx], userAnswer: '' 
      });
    } else if (type === 1) {
      // Dãy số giảm dần: 9, 7, 5, 3
      const sequence = [9, 7, 5, 3, 1];
      const hideIdx = getRandomInt(1, 3);
      problems.push({ 
        id: generateId(), type: 'word', 
        question: `Dãy số giảm dần: ${sequence.map((n, i) => i === hideIdx ? '...' : n).join(', ')}`, 
        answer: sequence[hideIdx], userAnswer: '' 
      });
    } else {
      // Hình học lặp lại (Câu 5 hình 2)
      const shapes = ["Vuông", "Tròn", "Tam giác", "Tam giác"];
      const hideIdx = 2; // Giả lập tìm hình ở dấu ?
      problems.push({ 
        id: generateId(), type: 'word', 
        question: `Quy luật: Vuông - Tròn - Tam giác - Tam giác - Vuông - Tròn - ...? (1: Tam giác, 2: Vuông)`, 
        answer: 1, userAnswer: '' 
      });
    }
  }
  return problems;
};

// --- 4. SO SÁNH (Câu 1 hình 1 & câu 7 hình 2) ---
export const generateComparisonProblems = (count: number): MathProblem[] => {
  const problems: MathProblem[] = [];
  for (let i = 0; i < count; i++) {
    const type = getRandomInt(0, 1);
    if (type === 0) {
      // So sánh biểu thức với số: 5+1+1 ... 6
      const n1 = getRandomInt(1, 4), n2 = getRandomInt(1, 3), n3 = getRandomInt(1, 2);
      const resL = n1 + n2 + n3;
      const resR = getRandomInt(5, 10);
      const ans = resL > resR ? '>' : (resL < resR ? '<' : '=');
      problems.push({ id: generateId(), type: 'comparison', numbers: [n1, n2, resR, 0], operators: ['+', '='], answer: ans, question: `${n1}+${n2}+${n3} ... ${resR}` });
    } else {
      // So sánh 2 biểu thức: 9-2 ... 1+5
      const opL = Math.random() > 0.5 ? '+' : '-';
      const opR = Math.random() > 0.5 ? '+' : '-';
      let n1L = getRandomInt(5, 9), n2L = getRandomInt(1, 4);
      let n1R = getRandomInt(1, 5), n2R = getRandomInt(1, 4);
      const resL = opL === '+' ? n1L + n2L : n1L - n2L;
      const resR = opR === '+' ? n1R + n2R : n1R - n2R;
      const ans = resL > resR ? '>' : (resL < resR ? '<' : '=');
      problems.push({ id: generateId(), type: 'comparison', numbers: [n1L, n2L, n1R, n2R], operators: [opL, opR], answer: ans });
    }
  }
  return problems;
};

// --- 5. THẺ SỐ / ĐIỀN SỐ (Câu 5 hình 3 - Nhà số) ---
export const generateFillBlankProblems = (count: number): MathProblem[] => {
  const problems: MathProblem[] = [];
  for (let i = 0; i < count; i++) {
    const type = getRandomInt(0, 1);
    if (type === 0) {
        // Nhà số (Fact family): 5 + ... = 7
        const total = getRandomInt(5, 10);
        const part1 = getRandomInt(1, total - 1);
        const part2 = total - part1;
        const hide = Math.random() > 0.5 ? 1 : 2;
        problems.push({ 
          id: generateId(), type: 'fill_blank', 
          numbers: [part1, part2], operators: ['+'], 
          answer: hide === 1 ? part1 : part2, 
          options: [hide === 1 ? 0 : 1],
          visualData: total 
        });
    } else {
        // Điền số kết quả: 10 - 2 = ...
        const a = getRandomInt(5, 10), b = getRandomInt(0, 5);
        problems.push({ id: generateId(), type: 'fill_blank', numbers: [a, b], operators: ['-'], answer: a - b, options: [2] });
    }
  }
  return problems;
};

// --- 6. BIỂU THỨC (Câu 4 hình 2) ---
export const generateExpressionProblems = (count: number): MathProblem[] => {
  const problems: MathProblem[] = [];
  for (let i = 0; i < count; i++) {
    const op1 = Math.random() > 0.5 ? '+' : '-';
    const op2 = Math.random() > 0.5 ? '+' : '-';
    let n1 = getRandomInt(5, 9), n2 = getRandomInt(1, 4);
    let temp = op1 === '+' ? n1 + n2 : n1 - n2;
    if (temp > 10) temp = 10; if (temp < 0) temp = 0;
    
    let n3 = getRandomInt(1, 3);
    let ans = op2 === '+' ? temp + n3 : temp - n3;
    if (ans > 10) ans = 10; if (ans < 0) ans = 0;

    problems.push({ id: generateId(), type: 'expression', numbers: [n1, n2, n3], operators: [op1, op2], answer: ans });
  }
  return problems;
};

export const generateMixedProblems = (count: number): MathProblem[] => {
  const result: MathProblem[] = [];
  const generators = [
    () => generateVerticalProblems(1)[0],
    () => generateComparisonProblems(1)[0],
    () => generateFillBlankProblems(1)[0],
    () => generatePatternProblems(1)[0],
    () => generateExpressionProblems(1)[0],
    () => generateLocalWordProblemSync()
  ];
  for (let i = 0; i < count; i++) {
    result.push(generators[i % generators.length]());
  }
  return shuffleArray(result);
};

// Giữ các hàm khác
export const generateFind10Problems = (count: number): MathProblem[] => {
  const problems: MathProblem[] = [];
  for (let i = 0; i < count; i++) {
    const isTarget = Math.random() > 0.4;
    let a = getRandomInt(0, 10), b = isTarget ? 10 - a : getRandomInt(0, 10);
    if (!isTarget && a + b === 10) b = (b + 1) % 11;
    problems.push({ id: generateId(), type: 'find10', numbers: [a, b], answer: 10, isCorrect: a + b === 10 });
  }
  return problems;
};

export const generateMatchingGameData = (count: number) => {
  const birds: MathProblem[] = [];
  for(let i=0; i < count; i++) { 
    let n1 = getRandomInt(1, 3), n2 = getRandomInt(1, 3), n3 = getRandomInt(1, 3), ans = n1 + n2 + n3;
    birds.push({ id: generateId(), type: 'expression', numbers: [n1, n2, n3], operators: ['+', '+'], answer: ans }); 
  }
  return { birds, houses: birds.map(p => ({ id: p.id, value: p.answer })).sort(() => Math.random() - 0.5) };
};

export const generateGeometryProblems = (count: number): MathProblem[] => {
  const problems: MathProblem[] = [];
  const SHAPES_LOCAL = {
    TRI: { id: 'tri', name: 'hình tam giác', d: "M 50 15 L 85 85 L 15 85 Z", color: '#3b82f6' },
    SQ: { id: 'sq', name: 'hình vuông', d: "M 20 20 L 80 20 L 80 80 L 20 80 Z", color: '#10b981' },
    CIR: { id: 'cir', name: 'hình tròn', d: "M 50 50 m -35 0 a 35 35 0 1 0 70 0 a 35 35 0 1 0 -70 0", color: '#ef4444' }
  };
  for (let i = 0; i < count; i++) {
    const keys = Object.keys(SHAPES_LOCAL);
    const targetKey = keys[getRandomInt(0, keys.length-1)] as keyof typeof SHAPES_LOCAL;
    const target = SHAPES_LOCAL[targetKey];
    const shapes: any[] = [];
    for(let j=0; j<6; j++) {
      const k = keys[getRandomInt(0, keys.length-1)] as keyof typeof SHAPES_LOCAL;
      shapes.push({...SHAPES_LOCAL[k], id: generateId(), type: SHAPES_LOCAL[k].id, num: j+1});
    }
    problems.push({ id: generateId(), type: 'geometry', visualType: 'identify_shape', question: `Bé hãy chỉ ra các mảnh bìa là ${target.name} nhé:`, visualData: { targetId: target.id, shapes }, answer: 0, userAnswer: '[]' });
  }
  return problems;
};

export const generateMeasurementProblems = (count: number): MathProblem[] => {
  const problems: MathProblem[] = [];
  for (let i = 0; i < count; i++) {
    const w = getRandomInt(1, 10);
    problems.push({ id: generateId(), type: 'measurement', visualType: 'spring', unit: 'kg', visualData: w, answer: w });
  }
  return problems;
};

export const generatePuzzleProblem = (): MathProblem => {
  const SHAPES_LOCAL = {
    TRI: { id: 'tri', name: 'hình tam giác', d: "M 50 15 L 85 85 L 15 85 Z", color: '#3b82f6' },
    SQ: { id: 'sq', name: 'hình vuông', d: "M 20 20 L 80 20 L 80 80 L 20 80 Z", color: '#10b981' },
    RECT: { id: 'rect', name: 'hình chữ nhật', d: "M 10 30 L 90 30 L 90 70 L 10 70 Z", color: '#f59e0b' }
  };
  return { id: generateId(), type: 'puzzle', visualType: 'puzzle_logic', answer: [{ id: 't1', targetRot: 0 }, { id: 't2', targetRot: 0 }], visualData: { templateName: 'Ngôi nhà', sourceShapes: [{...SHAPES_LOCAL.TRI, instanceId: 's1'}, {...SHAPES_LOCAL.SQ, instanceId: 's2'}], gridPieces: [{ id: 't1', type: 'tri', x: 50, y: 35, scale: 0.8, targetRot: 0 }, { id: 't2', type: 'sq', x: 50, y: 70, scale: 0.8, targetRot: 0 }], allShapes: SHAPES_LOCAL } };
};

export const generateChallengeProblem = (): MathProblem => {
  return { id: generateId(), type: 'challenge', question: "Mảnh nào còn thiếu để tạo thành hình tròn?", answer: "1", visualData: { sourceShapes: [{ id: 'base', d: "M 50 50 m -40 0 a 40 40 0 1 1 80 0 L 50 50 Z", color: '#f3f4f6' }], options: [{ id: "1", label: "A", name: "Mảnh A", d: "M 50 10 a 40 40 0 0 1 40 40 L 50 50 Z", color: "#ef4444" }, { id: "2", label: "B", name: "Mảnh B", d: "M 10 10 L 90 10 L 50 90 Z", color: "#3b82f6" }] } };
};
