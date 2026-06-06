import { useMemo, useRef, useState } from 'react';
import { buildQuestions, isCorrectAnswer, parseTables, shuffle } from '../game/logic';
import type { Answer, Question } from '../game/types';
import type { Language } from '../utils/translations';

export function useGame() {
  const [tablesInput, setTablesInput] = useState<string>('');
  const [rangeFrom, setRangeFrom] = useState<number>(1);
  const [rangeTo, setRangeTo] = useState<number>(10);
  const [repeatErrors, setRepeatErrors] = useState<boolean>(true);
  const [easyMode, setEasyMode] = useState<boolean>(false);
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(true);
  const [language, setLanguage] = useState<Language>('es');

  const [deck, setDeck] = useState<Question[]>([]);
  const [current, setCurrent] = useState<Question | null>(null);
  const [answer, setAnswer] = useState<string>('');
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [started, setStarted] = useState<boolean>(false);
  const [totalQuestions, setTotalQuestions] = useState<number>(0);
  const [elapsedMs, setElapsedMs] = useState<number>(0);
  const startTimeRef = useRef<number>(0);

  const parsedTables = useMemo(() => parseTables(tablesInput), [tablesInput]);

  const start = (): void => {
    const baseTables = parsedTables.length ? parsedTables : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const built = buildQuestions(baseTables, rangeFrom, rangeTo);
    const questions = easyMode ? built : shuffle(built);
    setTotalQuestions(questions.length);
    setDeck(questions.slice(1));
    setCurrent(questions[0] ?? null);
    setAnswers([]);
    setStarted(true);
    setAnswer('');
    setElapsedMs(0);
    startTimeRef.current = Date.now();
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

    // `deck` holds the upcoming questions (current is tracked separately).
    const upcoming = deck.slice();
    if (repeatErrors && !ok) {
      // In easy mode keep the in-order flow by appending at the end,
      // otherwise reinsert at a random position.
      const idx = easyMode
        ? upcoming.length
        : Math.floor(Math.random() * (upcoming.length + 1));
      upcoming.splice(idx, 0, current);
    }
    const next = upcoming[0] ?? null;
    if (!next) {
      setElapsedMs(Date.now() - startTimeRef.current);
    }
    setCurrent(next);
    setDeck(upcoming.slice(1));
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
    easyMode,
    setEasyMode,
    voiceEnabled,
    setVoiceEnabled,
    language,
    setLanguage,
    // game state
    deck,
    current,
    answer,
    setAnswer,
    answers,
    started,
    totalQuestions,
    elapsedMs,
    // actions
    start,
    submit,
    reset,
  } as const;
}

