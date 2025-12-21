
import React from 'react';

export interface MathProblem {
  id: string;
  type: 'word' | 'vertical' | 'expression' | 'find10' | 'fill_blank' | 'geometry' | 'pattern' | 'challenge' | 'puzzle' | 'comparison' | 'multiple_choice' | 'decode' | 'coloring' | 'maze' | 'connect' | 'house';
  question?: string;
  fullQuestion?: string; 
  numbers?: number[];
  operators?: string[];
  answer: any; 
  userAnswer?: string;
  isCorrect?: boolean;
  options?: any[]; 
  
  isEquationStyle?: boolean;
  summaryLines?: string[];
  
  unit?: string;
  visualType?: 'calc' | 'balance' | 'spring' | 'beaker' | 'identify_shape' | 'path_length' | 'puzzle_logic' | 'dissection' | 'compare_expr' | 'reverse_calc' | 'double_op' | 'missing_number' | 'shortest_path' | 'sequence' | 'missing_first' | 'missing_last' | 'equation' | 'chain';
  visualData?: any; 
}

export interface TabItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
}

export enum GameState {
  PLAYING,
  CHECKED,
}
