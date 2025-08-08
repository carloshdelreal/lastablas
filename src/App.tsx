import { useEffect, useRef } from 'react';
import Started from './ui/Started';
import Setup from './ui/Setup';
import Summary from './ui/Summary';
import { useGame } from './hooks/useGame';

function App(): JSX.Element {
  const {
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
    deck,
    current,
    answer,
    setAnswer,
    answers,
    started,
    totalQuestions,
    start,
    submit,
    reset,
  } = useGame();

  const answerInputRef = useRef<HTMLInputElement | null>(null);

  const handleSubmit = (): void => {
    submit();
    // Re-enfocar el input para mantener abierto el teclado en móvil
    setTimeout(() => {
      answerInputRef.current?.focus();
    }, 0);
  };

  // Asegura que al cambiar de pregunta el input recupere el foco
  useEffect(() => {
    if (started) {
      answerInputRef.current?.focus();
    }
  }, [current, started]);

  const pendingUnique = (current ? 1 : 0) + deck.length;
  const solvedUnique = Math.max(0, totalQuestions - pendingUnique);
  const correctCount = answers.filter(a => a.correct).length;

  return (
    <div className="min-h-full flex flex-col items-center px-4 py-8">
      <div className="w-full max-w-2xl">
        <header className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Las Tablas</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Practica las tablas de multiplicar.
          </p>
        </header>
        {!started ? (
          <Setup
            tablesInput={tablesInput}
            setTablesInput={setTablesInput}
            rangeFrom={rangeFrom}
            setRangeFrom={setRangeFrom}
            rangeTo={rangeTo}
            setRangeTo={setRangeTo}
            repeatErrors={repeatErrors}
            setRepeatErrors={setRepeatErrors}
            voiceEnabled={voiceEnabled}
            setVoiceEnabled={setVoiceEnabled}
            onStart={start}
          />
        ) : current ? (
          <Started
            current={current}
            totalQuestions={totalQuestions}
            solvedUnique={solvedUnique}
            correctCount={correctCount}
            answers={answers}
            answer={answer}
            setAnswer={setAnswer}
            onSubmit={handleSubmit}
            inputRef={answerInputRef}
            voiceEnabled={voiceEnabled}
          />
        ) : (
          <Summary
            answers={answers}
            correctCount={correctCount}
            onBack={reset}
            onRepeat={start}
          />
        )}
      </div>
      <footer className="mt-10 text-xs text-gray-500">
        Hecho con ❤️ por{' '}
        <a
          href="https://carloshdelreal.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Carlos Del Real
        </a>
      </footer>
    </div>
  );
}

export default App;
