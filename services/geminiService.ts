
import { GoogleGenAI, Type } from "@google/genai";
import { MathProblem } from "../types";

const generateId = () => Math.random().toString(36).substr(2, 9);

const LOCAL_WORD_PROBLEMS: MathProblem[] = [
  { 
    id: 'l1', 
    type: 'word', 
    isEquationStyle: true,
    summaryLines: ["Có : 7 quả cam", "Ăn : 3 quả cam", "Còn lại: ....... quả cam?"],
    question: "Bé hãy viết phép tính thích hợp để tìm số quả cam còn lại nhé!", 
    answer: 4, 
    numbers: [7, 3], 
    operators: ['-'] 
  },
  { 
    id: 'l2', 
    type: 'word', 
    isEquationStyle: true,
    summaryLines: ["Có : 4 cái kẹo", "Thêm : 5 cái kẹo", "Tất cả: ....... cái kẹo?"],
    question: "Bé hãy viết phép tính thích hợp để tìm tổng số cái kẹo nhé!", 
    answer: 9, 
    numbers: [4, 5], 
    operators: ['+'] 
  },
  { 
    id: 'l3', 
    type: 'word', 
    isEquationStyle: true,
    summaryLines: ["Có : 6 con chim", "Bay đi : 2 con chim", "Còn lại: ....... con chim?"],
    question: "Bé hãy viết phép tính thích hợp để tìm số con chim còn lại nhé!", 
    answer: 4, 
    numbers: [6, 2], 
    operators: ['-'] 
  }
];

export const generateWordProblem = async (forcedOperator?: '+' | '-'): Promise<MathProblem> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const opInstruction = forcedOperator 
      ? `MUST use the ${forcedOperator === '+' ? 'Addition (+)' : 'Subtraction (-)'} operation.`
      : "Use either Addition (+) or Subtraction (-).";

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a math word problem for a 1st/2nd grade student in Vietnamese in a specific "Summary" style.
      
      Format Requirements:
      1. Use a "Summary" style with exactly 3 lines.
         - Line 1: "Có : [number] [object]"
         - Line 2: "[Action] : [number] [object]" (Action could be "Thêm", "Ăn", "Cho", "Bay đi", "Hái")
         - Line 3: "[Target]: ....... [object]?" (Target could be "Tất cả", "Còn lại")
      2. The question should ask the child to write the corresponding equation.
      3. ${opInstruction}
      4. All numbers MUST be between 0 and 10. Sum/Result MUST also be between 0 and 10.
      5. Context: fruits, candies, animals, toys.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING, description: "Instruction like: Bé hãy viết phép tính thích hợp." },
            summaryLines: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Array of 3 summary lines." },
            answer: { type: Type.INTEGER },
            operation: { type: Type.STRING },
            numbers: { type: Type.ARRAY, items: { type: Type.INTEGER } }
          },
          required: ["question", "summaryLines", "answer", "operation", "numbers"],
        },
      },
    });

    const data = JSON.parse(response.text || '{}');
    return {
      id: generateId(),
      type: 'word',
      isEquationStyle: true,
      summaryLines: data.summaryLines,
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
