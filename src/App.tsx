import { useMemo, useState } from 'react';

type Question = {
  multiplicand: number;
  multiplier: number;
};

type Answer = {
  question: Question;
  given: string;
  correct: boolean;
};

function buildQuestions(
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

function shuffle<T>(arr: T[]): T[] {
  const res = arr.slice();
  for (let i = res.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [res[i], res[j]] = [res[j], res[i]];
  }
  return res;
}

function App(): JSX.Element {
  const [tablesInput, setTablesInput] = useState<string>('2-10');
  const [rangeFrom, setRangeFrom] = useState<number>(1);
  const [rangeTo, setRangeTo] = useState<number>(10);
  const [repeatErrors, setRepeatErrors] = useState<boolean>(true);

  const [deck, setDeck] = useState<Question[]>([]);
  const [current, setCurrent] = useState<Question | null>(null);
  const [answer, setAnswer] = useState<string>('');
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [started, setStarted] = useState<boolean>(false);
  const [totalQuestions, setTotalQuestions] = useState<number>(0);

  const parseTables = (input: string): number[] => {
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
  };

  const parsedTables = useMemo(() => parseTables(tablesInput), [tablesInput]);

  const start = (): void => {
    const baseTables = parsedTables.length
      ? parsedTables
      : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
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
    const parsed = Number(answer);
    const isCorrect =
      Number.isFinite(parsed) &&
      parsed === current.multiplicand * current.multiplier;
    const record: Answer = {
      question: current,
      given: answer.trim(),
      correct: Boolean(isCorrect),
    };

    setAnswers(prev => [...prev, record]);

    const nextDeck = deck.slice(1);
    if (repeatErrors && !isCorrect) {
      const idx = Math.floor(Math.random() * (nextDeck.length + 1));
      nextDeck.splice(idx, 0, current);
    }
    setDeck(nextDeck);
    setCurrent(nextDeck[0] ?? null);
    setAnswer('');
  };

  const pendingUnique = (current ? 1 : 0) + deck.length;
  const solvedUnique = Math.max(0, totalQuestions - pendingUnique);
  const correctCount = answers.filter(a => a.correct).length;

  return (
    <div className="min-h-full flex flex-col items-center px-4 py-8">
      <div className="w-full max-w-2xl">
        <header className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Las Tablas</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Práctica de multiplicaciones con orden aleatorio y resumen final.
          </p>
        </header>
        {!started ? (
          <section className="space-y-4 bg-white/60 dark:bg-white/5 rounded-xl p-4 shadow-sm ring-1 ring-gray-200 dark:ring-white/10">
            <div>
              <label className="block text-sm font-medium mb-1">Tablas</label>
              <input
                value={tablesInput}
                onChange={e => setTablesInput(e.target.value)}
                placeholder="e.g., 2,3,5-7"
                className="w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                Acepta listas y rangos. Ejemplos: 2,3,5-7
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Desde</label>
                <input
                  type="number"
                  value={rangeFrom}
                  onChange={e => setRangeFrom(Number(e.target.value))}
                  className="w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Hasta</label>
                <input
                  type="number"
                  value={rangeTo}
                  onChange={e => setRangeTo(Number(e.target.value))}
                  className="w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={repeatErrors}
                onChange={e => setRepeatErrors(e.target.checked)}
                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
              />
              Repetir errores hasta acertarlos
            </label>

            <button
              onClick={start}
              className="mt-2 inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-white font-medium shadow hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Comenzar
            </button>
          </section>
        ) : current ? (
          <section className="space-y-4 bg-white/60 dark:bg-white/5 rounded-xl p-4 shadow-sm ring-1 ring-gray-200 dark:ring-white/10">
            <div className="flex items-baseline justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Progreso: {solvedUnique}/{totalQuestions}
              </p>
              <p className="text-sm">
                Aciertos:{' '}
                <span className="font-semibold text-emerald-600">
                  {correctCount}
                </span>
              </p>
            </div>
            <div className="text-center py-6">
              <div className="text-5xl font-extrabold tracking-tight">
                {current.multiplicand} × {current.multiplier} = ?
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                autoFocus
                inputMode="numeric"
                value={answer}
                onChange={e => setAnswer(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') submit();
                }}
                className="flex-1 rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Tu respuesta"
              />
              <button
                onClick={submit}
                className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-white font-medium shadow hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Responder
              </button>
            </div>
            {answers.length > 0 && (
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Última respuesta:{' '}
                {answers[answers.length - 1].correct ? (
                  <span className="text-emerald-600 font-medium">Correcta</span>
                ) : (
                  <span className="text-rose-600 font-medium">Incorrecta</span>
                )}
              </div>
            )}
          </section>
        ) : (
          <section className="space-y-4 bg-white/60 dark:bg-white/5 rounded-xl p-4 shadow-sm ring-1 ring-gray-200 dark:ring-white/10">
            <h2 className="text-xl font-semibold">Resumen</h2>
            <p>
              Preguntas: {answers.length} · Aciertos: {correctCount} ·
              Precisión:{' '}
              {answers.length
                ? Math.round((correctCount / answers.length) * 100)
                : 0}
              %
            </p>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left">
                    <th className="py-1 pr-4">Pregunta</th>
                    <th className="py-1 pr-4">Tu respuesta</th>
                    <th className="py-1">Resultado</th>
                  </tr>
                </thead>
                <tbody>
                  {answers.map((a, idx) => {
                    const correct =
                      a.question.multiplicand * a.question.multiplier;
                    const ok = a.correct;
                    return (
                      <tr
                        key={idx}
                        className="border-t border-gray-200 dark:border-white/10"
                      >
                        <td className="py-1 pr-4">
                          {a.question.multiplicand} × {a.question.multiplier} ={' '}
                          {correct}
                        </td>
                        <td className="py-1 pr-4">{a.given || '(vacío)'}</td>
                        <td className="py-1">
                          {ok ? (
                            <span className="text-emerald-600">Correcta</span>
                          ) : (
                            <span className="text-rose-600">Incorrecta</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <button
              onClick={() => setStarted(false)}
              className="inline-flex items-center justify-center rounded-md bg-gray-200 dark:bg-gray-700 px-4 py-2 font-medium hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              Volver a configuración
            </button>
            <button
              onClick={start}
              className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-white font-medium shadow hover:bg-indigo-500 ml-2"
            >
              Repetir
            </button>
          </section>
        )}
      </div>
      <footer className="mt-10 text-xs text-gray-500">
        Hecho con React + Vite + Tailwind
      </footer>
    </div>
  );
}

export default App;
