import type { Question } from './types';

export function parseTables(input: string): number[] {
  const parts = input
    .split(',')
    .map(p => p.trim())
    .filter(Boolean);

  const result: number[] = [];
  for (const part of parts) {
    if (part.includes('-')) {
      const [a, b] = part.split('-', 2);
      const start = Number(a);
      const end = Number(b);
      if (!Number.isFinite(start) || !Number.isFinite(end)) continue;
      const lo = Math.min(start, end);
      const hi = Math.max(start, end);
      for (let n = lo; n <= hi; n += 1) result.push(n);
    } else {
      const n = Number(part);
      if (Number.isFinite(n)) result.push(n);
    }
  }
  return Array.from(new Set(result)).sort((a, b) => a - b);
}

export function buildQuestions(
  tables: number[],
  from: number,
  to: number
): Question[] {
  const qs: Question[] = [];
  const [min, max] = from <= to ? [from, to] : [to, from];
  for (const t of tables) {
    for (let m = min; m <= max; m += 1) {
      qs.push({ multiplicand: t, multiplier: m });
    }
  }
  return qs;
}

export function shuffle<T>(arr: T[]): T[] {
  const res = arr.slice();
  for (let i = res.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [res[i], res[j]] = [res[j], res[i]];
  }
  return res;
}

export function isCorrectAnswer(question: Question, given: string): boolean {
  const parsed = Number(given);
  return (
    Number.isFinite(parsed) && parsed === question.multiplicand * question.multiplier
  );
}

