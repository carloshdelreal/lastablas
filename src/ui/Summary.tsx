// Summary view for the end of a session

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
  onBack: () => void;
  onRepeat: () => void;
};

export default function Summary({
  answers,
  correctCount,
  onBack,
  onRepeat,
}: SummaryProps): JSX.Element {
  return (
    <section className="space-y-4 bg-white/60 dark:bg-white/5 rounded-xl p-4 shadow-sm ring-1 ring-gray-200 dark:ring-white/10">
      <h2 className="text-xl font-semibold">Resumen</h2>
      <p>
        Preguntas: {answers.length} · Aciertos: {correctCount} · Precisión:{' '}
        {answers.length ? Math.round((correctCount / answers.length) * 100) : 0}%
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
        onClick={onBack}
        className="inline-flex items-center justify-center rounded-md bg-gray-200 dark:bg-gray-700 px-4 py-2 font-medium hover:bg-gray-300 dark:hover:bg-gray-600"
      >
        Volver a configuración
      </button>
      <button
        onClick={onRepeat}
        className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-white font-medium shadow hover:bg-indigo-500 ml-2"
      >
        Repetir
      </button>
    </section>
  );
}

