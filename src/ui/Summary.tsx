import { getTranslation } from '../utils/translations';
import type { Language } from '../utils/translations';

type Question = {
  multiplicand: number;
  multiplier: number;
};

type Answer = {
  question: Question;
  given: string;
  correct: boolean;
};

type SummaryProps = {
  answers: Answer[];
  correctCount: number;
  language: Language;
  onBack: () => void;
  onRepeat: () => void;
};

export default function Summary({
  answers,
  correctCount,
  language,
  onBack,
  onRepeat,
}: SummaryProps): JSX.Element {
  const t = getTranslation(language);

  return (
    <section className="space-y-4 bg-white/60 dark:bg-white/5 rounded-xl p-4 shadow-sm ring-1 ring-gray-200 dark:ring-white/10">
      <h2 className="text-xl font-semibold">{t.summary}</h2>
      <p>
        {t.questions}: {answers.length} · {t.correctAnswers}: {correctCount} · {t.accuracy}:{' '}
        {answers.length ? Math.round((correctCount / answers.length) * 100) : 0}%
      </p>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left">
              <th className="py-1 pr-4">{t.question}</th>
              <th className="py-1 pr-4">{t.yourResponse}</th>
              <th className="py-1">{t.result}</th>
            </tr>
          </thead>
          <tbody>
            {answers.map((a, idx) => {
              const correct = a.question.multiplicand * a.question.multiplier;
              const ok = a.correct;
              return (
                <tr key={idx} className="border-t border-gray-200 dark:border-white/10">
                  <td className="py-1 pr-4">
                    {a.question.multiplicand} × {a.question.multiplier} = {correct}
                  </td>
                  <td className="py-1 pr-4">{a.given || '(vacío)'}</td>
                  <td className="py-1">
                    {ok ? (
                      <span className="text-emerald-600">{t.correct}</span>
                    ) : (
                      <span className="text-rose-600">{t.incorrect}</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <button
        onClick={onBack}
        className="inline-flex items-center justify-center rounded-md bg-gray-200 dark:bg-gray-700 px-4 py-2 font-medium hover:bg-gray-300 dark:hover:bg-gray-600"
      >
        {t.practiceAnotherTable}
      </button>
      <button
        onClick={onRepeat}
        className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-white font-medium shadow hover:bg-indigo-500 ml-2"
      >
        {t.repeat}
      </button>
    </section>
  );
}

