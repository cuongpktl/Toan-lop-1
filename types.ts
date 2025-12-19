
import React from 'react';

export interface MathProblem {
  id: string;
  type: 'word' | 'vertical' | 'expression' | 'find10' | 'fill_blank' | 'measurement' | 'geometry' | 'pattern' | 'challenge' | 'puzzle' | 'comparison';
  question?: string;
  numbers?: number[];
  operators?: string[];
  answer: any; // Can be number or string or array or object
  userAnswer?: string;
  isCorrect?: boolean;
  options?: any[]; // For choices
  
  // Specific for measurement & geometry
  unit?: string;
  visualType?: 'calc' | 'balance' | 'spring' | 'beaker' | 'identify_shape' | 'path_length' | 'puzzle_logic' | 'dissection' | 'compare_expr';
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
