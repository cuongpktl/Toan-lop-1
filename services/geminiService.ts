
import { GoogleGenAI, Type } from "@google/genai";
import { MathProblem } from "../types";

const generateId = () => Math.random().toString(36).substr(2, 9);

const LOCAL_WORD_PROBLEMS: MathProblem[] = [
  // Dạng dài (Có fullQuestion và summaryLines)
  { 
    id: 'l1', 
    type: 'word', 
    isEquationStyle: true,
    fullQuestion: "Anh cao 95cm, em thấp hơn anh 10cm. Hỏi em cao bao nhiêu xăng-ti-mét?",
    summaryLines: ["Anh cao : 95 cm", "Em thấp hơn: 10 cm", "Em cao : ....... cm?"],
    question: "Bé hãy viết phép tính thích hợp.", 
    answer: 85, 
    numbers: [95, 10], 
    operators: ['-'] 
  },
  { 
    id: 'l2', 
    type: 'word', 
    isEquationStyle: true,
    fullQuestion: "Nhà An có 15 con gà, mẹ mua thêm 10 con gà nữa. Hỏi nhà An có tất cả bao nhiêu con gà?",
    summaryLines: ["Có : 15 con gà", "Thêm : 10 con gà", "Tất cả: ....... con gà?"],
    question: "Bé hãy viết phép tính thích hợp.", 
    answer: 25, 
    numbers: [15, 10], 
    operators: ['+'] 
  },
  // Dạng ngắn (Cũ)
  {
    id: 's1',
    type: 'word',
    isEquationStyle: true,
    question: "Lan có 12 quyển vở, Mai có 7 quyển vở. Hỏi cả hai bạn có bao nhiêu quyển vở?",
    answer: 19,
    numbers: [12, 7],
    operators: ['+']
  },
  {
    id: 's2',
    type: 'word',
    isEquationStyle: true,
    question: "Trong rổ có 25 quả táo, bé ăn mất 5 quả. Hỏi trong rổ còn lại bao nhiêu quả táo?",
    answer: 20,
    numbers: [25, 5],
    operators: ['-']
  }
];

export const generateWordProblem = async (forcedOperator?: '+' | '-'): Promise<MathProblem> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const opInstruction = forcedOperator 
      ? `MUST use the ${forcedOperator === '+' ? 'Addition (+)' : 'Subtraction (-)'} operation.`
      : "Use either Addition (+) or Subtraction (-).";

    // Trộn ngẫu nhiên phong cách
    const style = Math.random() > 0.5 ? 'long' : 'short';

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a math word problem for a 2nd grade student in Vietnamese.
      
      Style: ${style === 'long' ? 'Detailed narrative with a summary section' : 'Simple direct word problem'}.
      
      Requirements:
      1. If style is 'long':
         - fullQuestion: Detailed narrative like "Anh cao 95cm, em thấp hơn anh 10cm..."
         - summaryLines: 3 lines of summary.
         - question: Always "Bé hãy viết phép tính thích hợp."
      2. If style is 'short':
         - question: Direct problem like "Lan có 12 vở, Mai có 7 vở. Hỏi có tất cả bao nhiêu?"
         - fullQuestion: leave empty or null.
         - summaryLines: leave empty or null.
      3. ${opInstruction}
      4. Numbers up to 100.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            fullQuestion: { type: Type.STRING },
            question: { type: Type.STRING },
            summaryLines: { type: Type.ARRAY, items: { type: Type.STRING } },
            answer: { type: Type.INTEGER },
            operation: { type: Type.STRING },
            numbers: { type: Type.ARRAY, items: { type: Type.INTEGER } }
          },
          required: ["question", "answer", "operation", "numbers"],
        },
      },
    });

    const data = JSON.parse(response.text || '{}');
    return {
      id: generateId(),
      type: 'word',
      isEquationStyle: true,
      fullQuestion: data.fullQuestion || null,
      summaryLines: data.summaryLines || null,
      question: data.question,
      answer: data.answer,
      numbers: data.numbers || [],
      operators: [data.operation || forcedOperator || '+']
    };
  } catch (error: any) {
    console.warn("API Error, using local fallback.");
    return useLocalFallback(forcedOperator);
  }
};

function useLocalFallback(op?: string): MathProblem {
  let pool = LOCAL_WORD_PROBLEMS;
  if (op) pool = LOCAL_WORD_PROBLEMS.filter(p => p.operators?.[0] === op);
  if (pool.length === 0) pool = LOCAL_WORD_PROBLEMS;
  const p = pool[Math.floor(Math.random() * pool.length)];
  return { ...p, id: generateId() };
}
