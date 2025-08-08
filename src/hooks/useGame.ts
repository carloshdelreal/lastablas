import { useMemo, useState } from 'react';
import { buildQuestions, isCorrectAnswer, parseTables, shuffle } from '../game/logic';
import type { Answer, Question } from '../game/types';

export function useGame() {
  const [tablesInput, setTablesInput] = useState<string>('');
  const [rangeFrom, setRangeFrom] = useState<number>(1);
  const [rangeTo, setRangeTo] = useState<number>(10);
  const [repeatErrors, setRepeatErrors] = useState<boolean>(true);
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(true);

  const [deck, setDeck] = useState<Question[]>([]);
  const [current, setCurrent] = useState<Question | null>(null);
  const [answer, setAnswer] = useState<string>('');
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [started, setStarted] = useState<boolean>(false);
  const [totalQuestions, setTotalQuestions] = useState<number>(0);

  const parsedTables = useMemo(() => parseTables(tablesInput), [tablesInput]);

  const start = (): void => {
    const baseTables = parsedTables.length ? parsedTables : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const questions = shuffle(buildQuestions(baseTables, rangeFrom, rangeTo));
    setTotalQuestions(questions.length);
    setDeck(questions.slice(1));
    setCurrent(questions[0] ?? null);
    setAnswers([]);
    setStarted(true);
    setAnswer('');
  };

  const submit = (): void => {
    if (!current) return;
    const ok = isCorrectAnswer(current, answer);
    const record: Answer = {
      question: current,
      given: answer.trim(),
      correct: Boolean(ok),
    };

    setAnswers(prev => [...prev, record]);

    const nextDeck = deck.slice(1);
    if (repeatErrors && !ok) {
      const idx = Math.floor(Math.random() * (nextDeck.length + 1));
      nextDeck.splice(idx, 0, current);
    }
    setDeck(nextDeck);
    setCurrent(nextDeck[0] ?? null);
    setAnswer('');
  };

  const reset = (): void => {
    setStarted(false);
    setDeck([]);
    setCurrent(null);
    setAnswers([]);
    setAnswer('');
  };

  return {
    // config
    tablesInput,
    setTablesInput,
    rangeFrom,
    setRangeFrom,
    rangeTo,
    setRangeTo,
    repeatErrors,
    setRepeatErrors,
    voiceEnabled,
    setVoiceEnabled,
    // game state
    deck,
    current,
    answer,
    setAnswer,
    answers,
    started,
    totalQuestions,
    // actions
    start,
    submit,
    reset,
  } as const;
}

