import type { RefObject } from 'react';

type Question = {
  multiplicand: number;
  multiplier: number;
};

type Answer = {
  question: Question;
  given: string;
  correct: boolean;
};

type StartedProps = {
  current: Question;
  totalQuestions: number;
  solvedUnique: number;
  correctCount: number;
  answers: Answer[];
  answer: string;
  setAnswer: (value: string) => void;
  onSubmit: () => void;
  inputRef: RefObject<HTMLInputElement>;
};

export default function Started(props: StartedProps): JSX.Element {
  const {
    current,
    totalQuestions,
    solvedUnique,
    correctCount,
    answers,
    answer,
    setAnswer,
    onSubmit,
    inputRef,
  } = props;

  return (
    <section className="space-y-4 bg-white/60 dark:bg-white/5 rounded-xl p-4 shadow-sm ring-1 ring-gray-200 dark:ring-white/10">
      <div className="flex items-baseline justify-between">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Progreso: {solvedUnique}/{totalQuestions}
        </p>
        <p className="text-sm">
          Aciertos:{' '}
          <span className="font-semibold text-emerald-600">{correctCount}</span>
        </p>
      </div>
      <div className="text-center py-6">
        <div className="text-5xl font-extrabold tracking-tight">
          {current.multiplicand} × {current.multiplier} = ?
        </div>
      </div>
      <div className="flex flex-col items-center gap-3">
        <input
          inputMode="numeric"
          value={answer}
          onChange={e => setAnswer(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') onSubmit();
          }}
          className="flex-1 rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Tu respuesta"
          ref={inputRef}
        />
        <button
          onClick={onSubmit}
          onPointerDown={e => e.preventDefault()}
          type="button"
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
  );
}

