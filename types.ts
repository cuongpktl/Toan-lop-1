
import React from 'react';

export interface MathProblem {
  id: string;
  type: 'word' | 'vertical' | 'expression' | 'find10' | 'fill_blank' | 'measurement' | 'geometry' | 'pattern' | 'challenge' | 'puzzle' | 'comparison' | 'multiple_choice' | 'decode' | 'coloring' | 'maze' | 'connect' | 'house';
  question?: string;
  numbers?: number[];
  operators?: string[];
  answer: any; // Can be number or string or array or object
  userAnswer?: string;
  isCorrect?: boolean;
  options?: any[]; // For choices (labels like A, B, C, D)
  
  // Specific for word problems with summary
  isEquationStyle?: boolean;
  summaryLines?: string[];
  
  // Specific for measurement & geometry
  unit?: string;
  /* Added 'missing_first', 'missing_last', 'equation', and 'chain' to visualType union */
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
