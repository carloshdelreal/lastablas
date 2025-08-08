export type Question = {
  multiplicand: number;
  multiplier: number;
};

export type Answer = {
  question: Question;
  given: string;
  correct: boolean;
};

