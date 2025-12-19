
import { GoogleGenAI, Type } from "@google/genai";
import { MathProblem } from "../types";

const generateId = () => Math.random().toString(36).substr(2, 9);

const LOCAL_WORD_PROBLEMS: MathProblem[] = [
  { id: 'l1', type: 'word', question: "Nhà An có 4 con gà, mẹ mua thêm 5 con gà nữa. Hỏi nhà An có tất cả bao nhiêu con gà?", answer: 9, numbers: [4, 5], operators: ['+'] },
  { id: 'l2', type: 'word', question: "Bình có 8 viên bi, Bình cho Nam 3 viên bi. Hỏi Bình còn lại bao nhiêu viên bi?", answer: 5, numbers: [8, 3], operators: ['-'] },
  { id: 'l3', type: 'word', question: "Trong vườn có 4 cây cam và 4 cây bưởi. Hỏi trong vườn có tất cả bao nhiêu cây?", answer: 8, numbers: [4, 4], operators: ['+'] },
  { id: 'l4', type: 'word', question: "Có 7 chú chim đậu trên cành, 3 chú bay đi. Hỏi còn lại bao nhiêu chú chim?", answer: 4, numbers: [7, 3], operators: ['-'] },
  { id: 'l5', type: 'word', question: "Mẹ mua 10 quả cam, biếu bà 5 quả. Hỏi mẹ còn bao nhiêu quả cam?", answer: 5, numbers: [10, 5], operators: ['-'] }
];

export const generateWordProblem = async (forcedOperator?: '+' | '-'): Promise<MathProblem> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const opInstruction = forcedOperator 
      ? `MUST use the ${forcedOperator === '+' ? 'Addition (+)' : 'Subtraction (-)'} operation.`
      : "Use either Addition (+) or Subtraction (-).";

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a math word problem for a 1st grade student in Vietnamese. 
      Constraints: 
      1. ${opInstruction}
      2. All numbers used in the question MUST be between 0 and 10.
      3. The final answer MUST be between 0 and 10.
      4. DO NOT generate negative results.
      5. Engaging context suitable for children (animals, toys, fruits).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            answer: { type: Type.INTEGER },
            operation: { type: Type.STRING },
            numbers: { type: Type.ARRAY, items: { type: Type.INTEGER } }
          },
          required: ["question", "answer", "operation"],
        },
      },
    });

    const data = JSON.parse(response.text || '{}');
    return {
      id: generateId(),
      type: 'word',
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
